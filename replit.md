# VideoGrab - Video Downloader Application

## Overview

VideoGrab is a web-based video downloader utility that allows users to download videos from multiple platforms (YouTube, Vimeo, Dailymotion, Facebook, Twitter) in various formats and quality settings. The application features a clean, Material Design-inspired interface with a focus on clarity and immediate visual feedback throughout the download process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured with HMR support
- **Wouter** for lightweight client-side routing
- File-based routing with a primary home page and 404 fallback

**UI Component System**
- **shadcn/ui** component library (New York variant) with Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- Custom theming system supporting light/dark modes with localStorage persistence
- Material Design 3 principles with Linear-inspired typography using Inter font
- Responsive design with mobile-first breakpoint at 768px

**State Management**
- **TanStack Query (React Query)** for server state management and API calls
- **React Hook Form** with Zod validation for form handling
- Custom hooks pattern for reusable logic (theme toggle, mobile detection, toast notifications)

**Design System Decisions**
- Chose Material Design 3 over alternatives for its structured component patterns and familiar interactions
- Generous spacing units (2, 4, 6, 8) for reduced cognitive load
- Consistent elevation system using custom CSS properties for hover and active states
- Fixed aspect ratio (16:9) for video thumbnails to maintain visual consistency

### Backend Architecture

**Runtime & Framework**
- **Node.js** with **Express.js** for HTTP server
- **TypeScript** with ES Modules for type safety and modern JavaScript features
- Custom build process using esbuild for server bundling with selective dependency bundling

**API Design**
- RESTful API structure under `/api` namespace
- Sample data implementation for video metadata from multiple platforms
- Request/response validation using Zod schemas
- Type-safe API client with centralized error handling

**Server Configuration**
- Development mode with tsx for hot reloading
- Production bundling with external dependencies (selective allowlist for faster cold starts)
- Request logging middleware with timing metrics
- Raw body preservation for webhook compatibility

### Data Storage Solutions

**Database Configuration**
- **PostgreSQL** configured as the primary database (via DATABASE_URL environment variable)
- **Drizzle ORM** for type-safe database operations with schema-first design
- Schema definitions in `shared/schema.ts` for isomorphic type sharing
- Migration system using drizzle-kit with output to `./migrations` directory

**Database Design Rationale**
- PostgreSQL chosen for ACID compliance and robust feature set
- Drizzle ORM selected over alternatives (Prisma, TypeORM) for:
  - Lightweight runtime overhead
  - SQL-like query builder maintaining transparency
  - Better TypeScript inference
  - Direct schema-to-Zod integration via drizzle-zod

**Session Management**
- Prepared for session storage with connect-pg-simple (PostgreSQL session store)
- Infrastructure ready for user authentication and persistent sessions

### External Dependencies

**Third-Party UI Libraries**
- **@radix-ui/** family - Unstyled, accessible component primitives
- **lucide-react** - Icon system
- **embla-carousel-react** - Carousel/slider functionality
- **cmdk** - Command palette component
- **class-variance-authority** - Type-safe variant styling
- **tailwind-merge** & **clsx** - Conditional className utilities

**Development Tools**
- **@replit/vite-plugin-*** - Replit-specific development enhancements (cartographer, dev banner, runtime error overlay)
- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation for cache busting and entity IDs

**Validation & Type Safety**
- **Zod** - Runtime schema validation
- **zod-validation-error** - User-friendly validation error messages
- **@hookform/resolvers** - React Hook Form + Zod integration
- Shared schemas between client/server via `@shared` path alias

**Build & Deployment**
- Custom build script compiling both Vite frontend and esbuild backend
- Selective dependency bundling (allowlist) to reduce syscalls and improve cold start
- Static file serving in production with SPA fallback
- TypeScript path aliases (@, @shared, @assets) for clean imports

**Monitoring & Quality**
- Request timing and logging middleware
- Source map support via @jridgewell/trace-mapping
- Type checking separate from build process

### Integration Points

**Platform Support (Prepared)**
- Architecture supports YouTube, Vimeo, Dailymotion, Facebook, Twitter
- Currently uses sample data; real integration would require:
  - Platform-specific API clients or scraping libraries
  - Rate limiting per platform
  - OAuth or API key management

**Download Flow Architecture**
1. URL parsing and platform detection
2. Video metadata extraction (title, thumbnail, available formats/qualities)
3. Format and quality selection by user
4. Download request with progress tracking
5. File delivery or stream handling

**WebSocket Ready**
- `ws` package included for real-time download progress updates
- Server configured with HTTP server instance (createServer) for WebSocket upgrade capability