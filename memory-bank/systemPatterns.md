# System Patterns

## Backup & Export Pattern (Finalized)

- **Comprehensive Sanity Backup**
  - Uses a Next.js API route (`nextjs-app/app/api/backup/route.ts`) to generate backups
  - Backups are created as ZIP archives using JSZip
  - Each backup includes:
    - `data.ndjson` (all content documents, no asset documents)
    - `assets.json` (asset metadata)
    - `images/` and `files/` folders with all media files (named as in CLI export)
    - `README.md` with restoration instructions
  - Format is fully compatible with Sanity CLI import (`sanity dataset import <dataset> data.ndjson`)
  - No separate media backup is needed; all assets are included in the main backup
  - Backups are stored in Vercel Blob Storage and cleaned up according to retention policy
  - Cron job triggers daily/monthly backups via GET requests
  - Secure API endpoint with token authentication
  - Environment variables: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, `BACKUP_SECRET`
  - Naming: `{daily|monthly}_backup_YYYY-MM-DD.zip`

## Architecture Overview

This is a Next.js application with Sanity CMS integration, featuring:

- **Dual Workspace Structure**: Separate `nextjs-app/` and `studio/` directories
- **App Router**: Using Next.js 13+ App Router with server and client components
- **Sanity Integration**: Real-time content updates with live preview
- **TypeScript**: Full type safety with generated Sanity types
- **Tailwind CSS**: Utility-first styling
- **Vercel Deployment**: Optimized for Vercel hosting

## Key Technical Decisions

1. Next.js 15 with App Router

   - Server-side rendering
   - Static site generation
   - API routes
   - Incremental Static Regeneration

2. Sanity Studio
   - Headless CMS architecture
   - Real-time content updates
   - Custom schema definitions
   - Visual editing capabilities

## Design Patterns

1. Component Architecture

   - Modular components
   - Reusable UI elements
   - Component-based routing
   - Server and client components

2. Data Flow

   - Real-time content synchronization
   - Optimistic updates
   - Caching strategies
   - Data validation

3. State Management
   - React hooks
   - Context API
   - Server state management
   - Client-side state

## Component Relationships

1. Frontend Components

   - Page components
   - Layout components
   - UI components
   - Data fetching components

2. CMS Components
   - Schema definitions
   - Studio customizations
   - Preview components
   - Input components

## Integration Patterns

1. Content Integration

   - Sanity client integration
   - Real-time updates
   - Content preview
   - Media handling

2. API Integration
   - RESTful endpoints
   - GraphQL queries
   - WebSocket connections
   - Authentication flows

## Route Management

- Never create new routes directly
- All route creation must be approved and implemented by the project maintainer
- Route structure should be documented in the memory bank before implementation

## Content Management

- Content is managed through Sanity Studio
- All content types must be defined in the Sanity schema
- Content relationships should be clearly documented

### Document Recovery System (Recycling Bin)

The system implements a recycling bin functionality for document recovery using a singleton document type and webhook integration:

1. **Singleton Document Structure** (`deletedDocBinDocument.ts`)

   - Type: `deletedDocs.bin`
   - Stores deleted document information in two arrays:
     - `deletedDocLogs`: Detailed logs with document metadata
       - `docId`: Document identifier (required)
       - `deletedAt`: Timestamp of deletion (required)
       - `type`: Document type
       - `documentTitle`: Document title (required)
       - `deletedBy`: User who deleted the document
     - `deletedDocIds`: Simple array of deleted document IDs
   - Uses `liveEdit: true` to skip draft versions
   - Fields are read-only to prevent manual modifications
   - Custom components for enhanced UI:
     - `DeletionLogItemComponent`: Renders individual log entries
     - `DeletionLogInputComponent`: Manages the logs array
     - `DeletedDocIdInputComponent`: Displays document IDs

2. **Studio Structure Integration** (`structure/index.ts`)

   - Dedicated "Bin" section in the Studio navigation
   - Uses `TrashIcon` for visual identification
   - Configured as a singleton document editor
   - Placed after main content types and settings
   - Accessible via `deletedDocs.bin` document ID

3. **Custom Components**

   - `DeletionLogItemComponent`:
     - Displays document metadata (title, type, deletion date)
     - Shows user who deleted the document
     - Provides "Open to restore" button with intent routing
     - Formats dates for better readability
   - `DeletionLogInputComponent`:
     - Manages the logs array
     - Automatically cleans up restored documents
     - Uses GROQ queries to check document existence
     - Removes restored documents from the logs
   - `DeletedDocIdInputComponent`:
     - Simple display component for document IDs
     - Read-only interface
     - Clean, minimal design

4. **Recovery Process**

   - Documents can be restored using their `_id`
   - Uses Sanity's intent routing for seamless restoration
   - Maintains document history and metadata
   - Provides a dedicated view for managing deleted documents
   - Implements custom UI components for better user experience
   - Automatic cleanup of restored documents from logs

5. **Implementation Details**

   - Located in `studio/src/schemaTypes/singletons/deletedDocBinDocument.ts`
   - Custom components in `studio/src/schemaTypes/components/recycling-bin/`
   - Studio structure in `studio/src/structure/index.ts`
   - Uses Sanity's Component API for custom UI elements
   - Implements proper error handling and validation
   - Follows Sanity's best practices for document management

6. **User Interface**
   - Custom view for managing deleted documents
   - List view of all deleted documents with metadata
   - Restore functionality with one-click operation
   - Clear visual indication of deleted status
   - Easy navigation and document recovery

## Document Recovery System

### Webhook Management

- Webhooks are managed through the Sanity CLI (`sanity hook` commands)
- Key CLI commands:
  - `sanity hook create`: Create new webhooks
  - `sanity hook list`: List existing webhooks
  - `sanity hook delete`: Remove webhooks
  - `sanity hook logs`: Monitor webhook activity
- Webhook configuration:
  - Tracks document deletions
  - Updates `deletedDocs.bin` singleton
  - Maintains deletion logs and document IDs
  - Uses GROQ mutations for data updates

## Sanity CLI Webhook Creation Limitation

- The `sanity hook create` command opens the browser to the webhook creation form and does not support fully non-interactive/scriptable webhook creation as of now.
- This is a known limitation. If the CLI adds this feature in the future, update this documentation.

## Component Architecture

- Components should be reusable and modular
- Follow the atomic design pattern
- Maintain clear separation of concerns

### Image Handling (Using `next/image` and `urlForImage`)

- All Sanity images are rendered using the `next/image` component from `next/image`.
- The `src` for `next/image` is generated by the `urlForImage` utility function, typically located in `nextjs-app/sanity/lib/image.ts`.
- **`urlForImage` Utility**:
  - This function takes a Sanity image asset object as input and optional parameters like `width`, `height`, and `quality`.
  - It constructs the appropriate URL to fetch the image from the Sanity CDN, potentially with specified transformations.
  - It is designed to be client-safe, relying only on public `projectId` and `dataset`.
- **`next/image` Props & Behavior**:
  - **`src`**: Must be the URL string returned by `urlForImage`.
  - **`alt`**: Alt text for the image.
  - **`width`, `height`**: Required if `fill` is not `true`. These define the intrinsic dimensions of the image for layout purposes.
    - When calling `urlForImage`, if specific dimensions are required for the source image (e.g., cropping), provide them to `urlForImage`. Then, use these same dimensions for `next/image` `width` and `height` props.
    - If the original image dimensions from Sanity are desired, call `urlForImage` without `width`/`height` and use the image's natural dimensions (often obtained from `image.asset.metadata.dimensions`) for `next/image`.
  - **`fill`**: Boolean. If `true`, the image will fill its parent container. The parent container MUST have `position: relative` and defined dimensions.
    - When `fill={true}`, `width` and `height` props on `next/image` should typically be omitted (or set to `undefined`), as `next/image` uses these to determine aspect ratio. The `sizes` prop becomes crucial.
    - `urlForImage` can still be called with `width`/`height` if a specifically sized source from Sanity is needed before `next/image` fills the container.
  - **`sizes`**: String. Crucial for responsive images, especially when `fill={true}` or when using fixed-width images with different device pixel ratios. Defines how large the image will be at different viewport widths.
  - **`priority`**: Boolean. For images critical to LCP.
  - **`loading`**: String (e.g., `"lazy"`, `"eager"`).
  - **`quality`**: Number (1-100). Passed to `next/image` and can also be passed to `urlForImage` to request a specific quality from Sanity.
  - **`className`**: Used for styling, including `object-fit` utilities (e.g., `object-cover`, `object-contain`) since the `objectFit` prop on `next/image` is deprecated.
    - If `fill={true}`, a common pattern is to have a wrapper `div` that is `relative` and sized, and apply `className` to the `next/image` component itself for `object-fit` and other styles.
- **`SanityImage.tsx` Component Wrapper**:
  - A component like `nextjs-app/app/components/SanityImage.tsx` may exist as a convenient wrapper around `next/image` and `urlForImage`.
  - This wrapper typically handles:
    - Calling `urlForImage` internally.
    - Conditionally rendering `next/image` if a valid URL is generated.
    - Mapping props to `next/image` and `urlForImage` appropriately, including `fill`, dimensions, `objectFit` (via Tailwind classes), etc.
    - Providing a placeholder if the image source is missing.
- **Client Safety**: The `urlForImage` utility must remain client-safe by not importing or using the main tokenized Sanity client. It should only use public project identifiers.

### Handling Steganography in Block Options

- When accessing string values from Sanity that are used for conditional logic or to determine CSS classes within block components (e.g., `textAlign`, `blockTheme`, `columns` from an `options` object), these strings might be encoded with steganography data if Sanity Visual Editing is active.
- To get the clean string value for such options, use the `stegaClean()` function from `@sanity/client/stega`.
  - Example: `const cleanTheme = block.options?.blockTheme ? stegaClean(block.options.blockTheme) : null;`
- This ensures that your component logic uses the actual intended value (e.g., "primary", "center", "three") rather than a steganography-encoded string, while still allowing the Sanity Visual Editing tools to function correctly if those options were to be directly rendered or part of a visual editing overlay.
- The `stripChars.ts` utility was previously used for this but has been deprecated and replaced by `stegaClean`.

## State Management

- Use React's built-in state management where possible
- Consider context for global state
- Document state management patterns in the memory bank

## Data Fetching

- Use Sanity's data fetching utilities
- Implement proper error handling
- Cache responses where appropriate

## Styling

- Use Tailwind CSS for styling
- Follow the project's design system
- Maintain consistent spacing and typography

## Performance

- Implement proper image optimization
- Use Next.js's built-in performance features
- Monitor and optimize bundle size

## Testing

- Write tests for critical functionality
- Use appropriate testing tools
- Document testing strategies

## Documentation

- Keep the memory bank up to date
- Document all major decisions
- Maintain clear code comments

## Security

- Follow security best practices
- Implement proper authentication
- Protect sensitive data

## Deployment

- Use Vercel for deployment
- Implement proper CI/CD
- Monitor deployment status

## File Organization

**CRITICAL: Dual Workspace Structure**

The project is organized into two distinct top-level workspaces:

1.  **`nextjs-app/`**: This directory contains the entirety of the Next.js frontend application.

    - All Next.js application components: `nextjs-app/app/components/`
    - All Next.js application utilities and helpers: `nextjs-app/app/lib/`
    - All Next.js application types: `nextjs-app/types/`
    - All Next.js application pages/routes: `nextjs-app/app/` (following App Router conventions)
    - Sanity client libraries _for the Next.js app_ (e.g., for fetching data, image URL generation): `nextjs-app/sanity/lib/`
    - Shared Sanity configuration used by Next.js app: `nextjs-app/sanity/` (e.g. `api.ts` for `projectId`, `dataset`)

2.  **`studio/`**: This directory contains the entirety of the Sanity Studio CMS application.
    - All Sanity Studio schema definitions: `studio/schemas/`
    - Sanity Studio specific components (e.g., custom input components, previews within the Studio): `studio/components/`
    - Sanity Studio specific utilities: `studio/lib/`
    - Main Sanity configuration file for the Studio (e.g. `sanity.config.ts`): `studio/sanity.config.ts` (or similar)

**Implications for File Access:**

- When working on Next.js features, all file paths will be relative to or within `nextjs-app/`.
- When working on Sanity Studio features or schemas, all file paths will be relative to or within `studio/`.
- It is crucial to specify the correct workspace when searching for, reading, or editing files.
- **Cross-Workspace Operations**: If a task is focused on one workspace (e.g., `nextjs-app/`), I MUST NOT make changes to files in the other workspace (e.g., `studio/`) without your explicit permission, even if related issues are found. This rule is also documented in `.cursorrules`.

### Next.js Application Structure (`nextjs-app/`)

- All Next.js application components should be placed in `nextjs-app/app/components/`
- All Next.js application utilities and helpers should be placed in `nextjs-app/app/lib/`
- All Next.js application types should be placed in `nextjs-app/types/`
- All Next.js application pages should be placed in `nextjs-app/app/` following Next.js 13+ app directory conventions

### Sanity Studio Structure (`studio/`)

- All Sanity Studio components should be placed in `studio/components/` (Note: this refers to components _for the Studio UI_, not general purpose React components for the frontend).
- All Sanity Studio utilities and helpers should be placed in `studio/lib/`.
- All Sanity Studio schemas should be placed in `studio/schemas/`.

### General Rules

- **Respect the workspace boundaries.** Do not create, for example, Next.js page components inside the `studio/` directory, or Sanity schemas inside `nextjs-app/`.
- Keep Next.js and Sanity Studio code separate and organized in their respective workspace directories.
- Use relative imports within the same directory structure
- Use absolute imports (with @/ prefix) when importing across different parts of the application

## Architecture Patterns

1. Component Structure

   - Atomic design principles
   - Reusable UI components
   - Block-based content system
   - Modular architecture

2. Data Flow

   - Sanity CMS integration
   - Real-time content updates
   - Client-side state management
   - Server-side rendering

3. SEO Implementation
   - Structured data patterns
   - JSON-LD schema integration
   - Environment-based configuration
   - Next.js Script component usage

## Design Patterns

1. Component Patterns

   - Container/Presenter pattern
   - Higher-order components
   - Compound components
   - Render props

2. State Management

   - React hooks
   - Context API
   - Server components
   - Client components

3. Data Fetching
   - Server-side data fetching
   - Client-side data fetching
   - Real-time updates
   - Caching strategies

## Code Organization

1. Directory Structure

   - Feature-based organization
   - Shared components
   - Utility functions
   - Type definitions

2. File Naming

   - PascalCase for components
   - camelCase for utilities
   - kebab-case for routes
   - Consistent extensions

3. Import Patterns
   - Absolute imports
   - Barrel exports
   - Type imports
   - Dynamic imports

## Best Practices

1. Performance

   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

2. Accessibility

   - ARIA attributes
   - Semantic HTML
   - Keyboard navigation
   - Screen reader support

3. SEO
   - Structured data implementation
   - Meta tag management
   - URL structure
   - Content organization

## Testing Patterns

1. Unit Testing

   - Component testing
   - Utility testing
   - Hook testing
   - Integration testing

2. E2E Testing
   - User flows
   - Critical paths
   - Edge cases
   - Performance testing

## Documentation

1. Code Documentation

   - JSDoc comments
   - Type definitions
   - Component documentation
   - API documentation

2. Project Documentation
   - Architecture decisions
   - Setup instructions
   - Deployment guides
   - Maintenance procedures

## Backup System Patterns

### Automated Backup Architecture

- **API Route**: `nextjs-app/app/api/backup/route.ts` handles backup requests
- **Backup Types**:
  - Daily backups (retain 7 days)
  - Monthly backups (retain 6 months, created on 1st of month)
- **Data Sources**:
  - Dataset: Sanity export API (`/data/export/{dataset}`)
  - Media: Direct CDN URL downloads from asset queries
- **Storage**: Vercel Blob Storage with automatic cleanup
- **Scheduling**: Vercel cron job configuration in `vercel.json`
- **Security**: Secret token authentication via query parameter

### Media Backup Implementation

- **Asset Query**: `*[_type == "sanity.imageAsset" || _type == "sanity.fileAsset"]`
- **Field Selection**: Only essential fields (`_id`, `_type`, `url`, `originalFilename`, `mimeType`, `size`)
- **Download Process**: Direct fetch from Sanity CDN URLs
- **Error Handling**: Graceful failure for individual assets, continue with valid downloads
- **File Naming**: Uses `originalFilename` or falls back to `_id` with extension

### Retention and Cleanup

- **Daily Retention**: 7 days (deletes backups older than 7 days)
- **Monthly Retention**: 6 months (deletes backups older than 6 months)
- **Cleanup Process**: Lists all blobs, calculates cutoff dates, deletes expired backups
- **Naming Convention**: `{daily|monthly}_backup_YYYY-MM-DD.tar.gz` for dataset, `{daily|monthly}_media_backup_YYYY-MM-DD.tar.gz` for media

### Environment Configuration

- **Required Variables**: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, `BACKUP_SECRET`
- **Runtime**: Node.js runtime for API routes
- **Client Safety**: Media backup uses direct CDN URLs, no token exposure
