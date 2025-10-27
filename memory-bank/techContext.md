# Technical Context

## Technologies Used

1. Frontend

   - Next.js 14
   - React 18
   - TypeScript
   - Tailwind CSS
   - Shadcn UI

2. Backend

   - Sanity CMS
   - Sanity Studio
   - GROQ Query Language
   - Sanity Client
   - Sanity CLI
     - Installation: `npm install --global sanity@latest`
     - Usage: `npx sanity@latest [command]` or `sanity [command]`
     - Configuration: `sanity.cli.js` in project root
     - Key commands:
       - `sanity hook create`: Create webhooks
       - `sanity hook list`: List webhooks
       - `sanity hook delete`: Remove webhooks
       - `sanity hook logs`: Monitor webhook activity
       - `sanity dataset export`: Export dataset
       - `sanity dataset import`: Import dataset
       - `sanity documents query`: Query documents
       - `sanity documents create`: Create documents
       - `sanity documents delete`: Delete documents
       - `sanity documents patch`: Patch documents
       - `sanity deploy`: Deploy studio
       - `sanity start`: Start development server
       - `sanity build`: Build studio
       - `sanity init`: Initialize project
       - `sanity manage`: Open management interface

## Sanity CLI Webhook Creation Limitation

- As of now, the `sanity hook create` command opens the browser to the webhook creation form and does not support fully non-interactive/scriptable webhook creation directly from the command line.
- If this changes in the future, update this note.

3. SEO & Performance
   - JSON-LD Structured Data
   - Schema.org
   - Next.js Script Component
   - Environment Variables

## Development Setup

1. Environment Requirements

   - Node.js 18+
   - npm/yarn
   - Git
   - Sanity CLI

2. Environment Variables

   - NEXT_PUBLIC_SITE_URL
   - SANITY_API_READ_TOKEN
   - SANITY_API_WRITE_TOKEN
   - SANITY_PROJECT_ID
   - SANITY_DATASET

3. Development Tools

   - VS Code
   - Chrome DevTools
   - React Developer Tools
   - Sanity Studio

4. Next.js Configuration (`nextjs-app/next.config.mjs`)
   - Image optimization settings (`deviceSizes`, `imageSizes`)
   - Remote patterns for `cdn.sanity.io`
   - Other Next.js specific configurations (e.g., `reactStrictMode`, `swcMinify`)

## Technical Constraints

1. Performance

   - Server-side rendering
   - Image optimization
   - Code splitting
   - Caching strategies

2. SEO

   - Structured data requirements
   - Meta tag management
   - URL structure
   - Content organization

3. Accessibility
   - WCAG 2.1 compliance
   - ARIA attributes
   - Semantic HTML
   - Keyboard navigation

## Dependencies

1. Core Dependencies

   - next
   - react
   - react-dom
   - typescript
   - @sanity/client
   - @sanity/image-url

2. UI Dependencies

   - tailwindcss
   - @radix-ui/react-\*
   - lucide-react
   - class-variance-authority

3. Development Dependencies
   - @types/react
   - @types/node
   - eslint
   - prettier
   - typescript

## API Integration

1. Sanity Integration

   - Real-time updates
   - Image handling
   - Content querying
   - Schema validation
   - Document recovery system (recycling bin)
     - Webhook-based deletion tracking
       - Managed through Sanity CLI (`sanity hook` commands)
       - CLI provides commands for create, list, delete, and monitor webhooks
       - Webhooks configured to track document deletions
       - Mutations update the `deletedDocs.bin` singleton
     - Singleton document for recovery
     - Custom UI components
     - Document restoration capabilities
     - GROQ delta functions for operation filtering
     - Sanity Studio structure customization
     - Component API integration
     - Intent routing for document restoration
     - Custom input components:
       - `DeletionLogItemComponent`
       - `DeletionLogInputComponent`
       - `DeletedDocIdInputComponent`
     - User authentication integration
     - Automatic document cleanup
     - Date formatting utilities
     - GROQ query optimization

2. External APIs
   - Image optimization
   - Analytics
   - Search functionality
   - Social media integration

## Build & Deployment

1. Build Process

   - TypeScript compilation
   - CSS processing
   - Asset optimization
   - Environment configuration

2. Deployment
   - Vercel deployment
   - Sanity Studio deployment
   - Environment setup
   - Monitoring configuration
