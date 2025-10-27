#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

async function extractBackup(backupFile) {
  if (!fs.existsSync(backupFile)) {
    console.error(`Backup file not found: ${backupFile}`);
    return;
  }

  const outputDir = path.basename(backupFile, ".zip");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Extracting ${backupFile} to ${outputDir}/`);

  try {
    // Read the ZIP file
    const zipData = fs.readFileSync(backupFile);
    const zip = new JSZip();

    // Load the ZIP file
    const zipContent = await zip.loadAsync(zipData);

    // Extract all files
    const extractPromises = [];
    zipContent.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir) {
        const outputPath = path.join(outputDir, relativePath);
        const outputDirPath = path.dirname(outputPath);

        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }

        // Extract the file
        const extractPromise = zipEntry.async("nodebuffer").then((content) => {
          fs.writeFileSync(outputPath, content);
          console.log(`  Extracted: ${relativePath}`);
        });

        extractPromises.push(extractPromise);
      }
    });

    await Promise.all(extractPromises);
    console.log(`\nExtraction complete! Files extracted to: ${outputDir}/`);
  } catch (error) {
    console.error("Error extracting backup:", error);
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2];

if (!backupFile) {
  console.log("Usage: node extract-backup.js <backup-file.zip>");
  console.log("");
  console.log("Example:");
  console.log("  node extract-backup.js daily_backup_2025-06-19.zip");
  console.log("  node extract-backup.js daily_media_backup_2025-06-19.zip");
  process.exit(1);
}

extractBackup(backupFile);
