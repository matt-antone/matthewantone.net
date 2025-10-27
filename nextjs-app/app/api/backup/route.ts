import { createClient } from '@sanity/client'
import { put, del, list } from '@vercel/blob'
import JSZip from 'jszip'

// This is a pure Node.js API route
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Get environment variables
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID
const SANITY_DATASET = process.env.SANITY_DATASET
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN
const BACKUP_SECRET = process.env.BACKUP_SECRET

// Retention periods
const DAILY_RETENTION_DAYS = 7
const MONTHLY_RETENTION_MONTHS = 6

// Helper function to determine backup type
async function determineBackupType(now: Date): Promise<{ backupType: string; timestamp: string }> {
  const isFirstDayOfMonth = now.getDate() === 1

  // Check if there are any existing monthly backups
  const { blobs } = await list()
  const hasMonthlyBackups = blobs.some(blob => blob.pathname.startsWith('monthly_backup_'))

  // Force monthly backup if none exist, otherwise use normal logic
  const shouldCreateMonthly = isFirstDayOfMonth || !hasMonthlyBackups
  const backupType = shouldCreateMonthly ? 'monthly' : 'daily'
  const timestamp = shouldCreateMonthly
    ? now.toISOString().slice(0, 7) // YYYY-MM for monthly
    : now.toISOString().slice(0, 10) // YYYY-MM-DD for daily

  console.log(`Creating ${backupType} backup. Has monthly backups: ${hasMonthlyBackups}`)

  return { backupType, timestamp }
}

// Helper function to create a ZIP archive
async function createZipArchive(files: Array<{ name: string; content: Buffer }>): Promise<Buffer> {
  const zip = new JSZip()

  // Add files to the ZIP
  files.forEach(file => {
    zip.file(file.name, file.content)
  })

  // Generate the ZIP file as a buffer
  return await zip.generateAsync({ type: 'nodebuffer' })
}

// Helper function to export dataset in CLI-compatible format
async function exportDataset(timestamp: string): Promise<Buffer> {
  try {
    // Initialize Sanity client for comprehensive data export
    const client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: '2024-03-01',
      token: SANITY_API_TOKEN,
      useCdn: false,
    })

    console.log('Executing Sanity CLI-compatible export...')

    // Export all documents (excluding assets which are handled separately)
    const documents = await client.fetch(`*[_type != "sanity.imageAsset" && _type != "sanity.fileAsset"]`)

    // Export all assets metadata
    const assets = await client.fetch(`*[_type == "sanity.imageAsset" || _type == "sanity.fileAsset"]`)

    // Create a map of asset IDs to their filenames for reference transformation
    const assetFileMap = new Map()
    assets.forEach((asset: any) => {
      const originalFilename = asset.originalFilename || 'unknown'
      const fileName = `${asset._id}-${originalFilename}`
      const isImage = asset._type === 'sanity.imageAsset'
      const folder = isImage ? 'images' : 'files'
      assetFileMap.set(asset._id, `${folder}/${fileName}`)
    })

    // Function to transform asset references in documents
    function transformAssetReferences(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map(transformAssetReferences)
      }

      if (obj && typeof obj === 'object') {
        const transformed = { ...obj }

        // Transform _ref to _sanityAsset if it's an asset reference
        if (obj._ref && assetFileMap.has(obj._ref)) {
          const filePath = assetFileMap.get(obj._ref)
          const isImage = filePath.startsWith('images/')
          return {
            _sanityAsset: `${isImage ? 'image' : 'file'}@file://./${filePath}`,
            _type: isImage ? 'image' : 'file'
          }
        }

        // Recursively transform nested objects
        for (const key in transformed) {
          transformed[key] = transformAssetReferences(transformed[key])
        }

        return transformed
      }

      return obj
    }

    // Clean dataset references and transform asset references
    const cleanDocuments = documents.map((doc: any) => {
      const cleaned = { ...doc }
      // Remove dataset-specific fields that could cause import issues
      delete cleaned._dataset
      delete cleaned._projectId
      // Transform asset references to CLI format
      return transformAssetReferences(cleaned)
    })

    const cleanAssets = assets.map((asset: any) => {
      const cleaned = { ...asset }
      // Remove dataset-specific fields that could cause import issues
      delete cleaned._dataset
      delete cleaned._projectId

      // Clean the path field to remove dataset references
      if (cleaned.path) {
        // Remove dataset name from path (e.g., "images/gqqvmay9/production/..." -> "images/...")
        cleaned.path = cleaned.path.replace(/^images\/[^\/]+\/[^\/]+\//, 'images/')
      }

      return cleaned
    })

    // Download actual media files and prepare for CLI import
    console.log('Downloading media files...')
    const assetFiles = await Promise.all(
      assets.map(async (asset: any) => {
        try {
          const url = asset.url
          const response = await fetch(url)
          const buffer = await response.arrayBuffer()

          // Determine folder and filename based on asset type
          const isImage = asset._type === 'sanity.imageAsset'
          const folder = isImage ? 'images' : 'files'

          // Use the exact filename format from CLI export: assetId-originalFilename
          const originalFilename = asset.originalFilename || 'unknown'
          const fileName = `${asset._id}-${originalFilename}`

          return {
            name: `${folder}/${fileName}`,
            content: Buffer.from(buffer)
          }
        } catch (error) {
          console.warn(`Failed to download asset ${asset._id}:`, error)
          return null
        }
      })
    )

    // Filter out failed downloads
    const successfulAssetFiles = assetFiles.filter(file => file !== null)

    // Create NDJSON content with all cleaned documents (excluding assets)
    // Sanity CLI expects only content documents in the NDJSON file
    const ndjsonContent = cleanDocuments.map((doc: any) => JSON.stringify(doc)).join('\n')

    console.log('CLI-compatible Sanity export completed')

    // Create ZIP archive with CLI-compatible structure
    const files = [
      {
        name: `data.ndjson`, // Main export file with all documents (including assets) - matches CLI format
        content: Buffer.from(ndjsonContent)
      },
      {
        name: `assets.json`, // Individual assets file (for reference) - matches CLI format
        content: Buffer.from(JSON.stringify(cleanAssets, null, 2))
      },
      {
        name: `README.md`, // Instructions for restoration
        content: Buffer.from(`# Sanity Dataset Export

This export was created on ${new Date().toISOString()}

## Restoration Instructions

To restore this dataset using the Sanity CLI:

1. Extract this ZIP file
2. Use the main \`data.ndjson\` file for CLI import:
   \`\`\`bash
   sanity dataset import <target-dataset> data.ndjson --replace
   \`\`\`

## Files Included

- \`data.ndjson\` - Content documents only (use this for CLI import)
- \`assets.json\` - Asset metadata only (for reference)
- \`images/\` - Directory containing all image files
- \`files/\` - Directory containing all file assets

## Notes

- This export is compatible with Sanity CLI import
- Dataset references have been cleaned to allow import into any dataset
- Asset references have been transformed to CLI format
- The \`data.ndjson\` file contains only content documents (no asset documents)
- Asset files are included in \`images/\` and \`files/\` directories
- Asset files are named using their asset \`_id\` with original filename
- Use \`--replace\` flag to overwrite existing dataset
- Use \`--missing\` flag to only import missing documents
`)
      },
      // Add all asset files in the correct folder structure
      ...successfulAssetFiles
    ]

    return await createZipArchive(files)

  } catch (error) {
    console.error('Error exporting dataset:', error)
    throw error
  }
}

async function cleanupOldBackups() {
  try {
    // List all blobs
    const { blobs } = await list()

    // Get current date
    const now = new Date()

    // Calculate cutoff dates
    const dailyCutoff = new Date(now)
    dailyCutoff.setDate(dailyCutoff.getDate() - DAILY_RETENTION_DAYS)

    const monthlyCutoff = new Date(now)
    monthlyCutoff.setMonth(monthlyCutoff.getMonth() - MONTHLY_RETENTION_MONTHS)

    // Filter and delete old backups
    for (const blob of blobs) {
      const fileName = blob.pathname

      if (fileName.startsWith('daily_backup_')) {
        // Extract date from filename (daily_backup_YYYY-MM-DD.zip)
        const dateStr = fileName.replace('daily_backup_', '').replace('.zip', '')
        const backupDate = new Date(dateStr)

        if (backupDate < dailyCutoff) {
          console.log(`Deleting old daily backup: ${fileName}`)
          await del(blob.url)
        }
      } else if (fileName.startsWith('monthly_backup_')) {
        // Extract date from filename (monthly_backup_YYYY-MM.zip)
        const dateStr = fileName.replace('monthly_backup_', '').replace('.zip', '')
        const [year, month] = dateStr.split('-')
        const backupDate = new Date(parseInt(year), parseInt(month) - 1)

        if (backupDate < monthlyCutoff) {
          console.log(`Deleting old monthly backup: ${fileName}`)
          await del(blob.url)
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error)
  }
}

// Handle GET requests (for cron jobs) and POST requests
export async function GET(request: Request) {
  // Get the raw request body and headers
  const headers = new Headers(request.headers)
  const url = new URL(request.url)

  // Log the environment we're running in
  console.log('Runtime environment:', {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    hasProjectId: true,
    hasDataset: true,
    hasToken: true,
    hasBackupSecret: true
  })

  // Check secret token
  const secret = url.searchParams.get('secret')
  if (!secret || secret !== BACKUP_SECRET) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Initialize Sanity client
    const client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: '2024-03-01',
      token: SANITY_API_TOKEN,
      useCdn: false,
    })

    // Get current date
    const now = new Date()

    // Determine backup type and filename
    const { backupType, timestamp } = await determineBackupType(now)
    const backupFileName = `${backupType}_backup_${timestamp}.zip`

    // Export the dataset
    const datasetArchive = await exportDataset(timestamp)

    // Upload dataset backup to Vercel Blob Storage
    const blob = await put(backupFileName, datasetArchive, {
      access: 'public',
      addRandomSuffix: false,
    })

    // Clean up old backups
    await cleanupOldBackups()

    return new Response(JSON.stringify({
      success: true,
      message: 'Backup completed successfully',
      backupType,
      datasetBackupUrl: blob.url,
      timestamp,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Backup failed:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Backup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: Request) {
  // Get the raw request body and headers
  const headers = new Headers(request.headers)
  const url = new URL(request.url)

  // Log the environment we're running in
  console.log('Runtime environment:', {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    hasProjectId: true,
    hasDataset: true,
    hasToken: true,
    hasBackupSecret: true
  })

  // Check secret token
  const secret = url.searchParams.get('secret')
  if (!secret || secret !== BACKUP_SECRET) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Initialize Sanity client
    const client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: '2024-03-01',
      token: SANITY_API_TOKEN,
      useCdn: false,
    })

    // Get current date
    const now = new Date()

    // Determine backup type and filename
    const { backupType, timestamp } = await determineBackupType(now)
    const backupFileName = `${backupType}_backup_${timestamp}.zip`

    // Export the dataset
    const datasetArchive = await exportDataset(timestamp)

    // Upload dataset backup to Vercel Blob Storage
    const blob = await put(backupFileName, datasetArchive, {
      access: 'public',
      addRandomSuffix: false,
    })

    // Clean up old backups
    await cleanupOldBackups()

    return new Response(JSON.stringify({
      success: true,
      message: 'Backup completed successfully',
      backupType,
      datasetBackupUrl: blob.url,
      timestamp,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Backup failed:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Backup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 