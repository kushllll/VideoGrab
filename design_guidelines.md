# Video Downloader Interface - Design Guidelines

## Design Approach

**Selected System:** Material Design 3 principles with Linear-inspired refinement  
**Rationale:** This utility-focused tool demands clarity, efficiency, and visual feedback. Material's structured component system provides familiar interaction patterns while Linear's clean typography and spacing create a professional, uncluttered interface.

**Core Principles:**
- Clarity over decoration
- Immediate visual feedback for all interactions
- Logical information hierarchy guiding users through the download process
- Generous whitespace for reduced cognitive load

## Typography

**Primary Font:** Inter (via Google Fonts CDN)  
**Hierarchy:**
- Page Title: 32px, semibold (font-semibold)
- Section Headers: 20px, semibold
- Input Labels: 14px, medium (font-medium)
- Body Text: 16px, regular
- Metadata/Secondary: 14px, regular
- Button Text: 15px, medium

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: p-6 or p-8
- Section gaps: gap-6 or gap-8
- Element margins: mb-2, mb-4, mt-8
- Container padding: px-4 md:px-8

**Container Structure:**
- Max width: max-w-4xl for main content area
- Centered layout: mx-auto
- Responsive padding: px-4 on mobile, px-8 on desktop

## Component Library

### URL Input Section
- Large, prominent text input with rounded corners (rounded-lg)
- Height: h-14 for easy targeting
- Placeholder text guides supported platforms
- Submit/Parse button positioned inline or adjacent
- Input validation indicator (icon feedback)

### Video Preview Card
- Grid layout displaying thumbnail + metadata side-by-side on desktop, stacked on mobile
- Thumbnail: Fixed aspect ratio 16:9, rounded corners (rounded-md)
- Metadata display: Video title (18px, semibold), duration, file size estimate
- Card elevation: subtle shadow (shadow-md)
- Padding: p-6

### Format & Quality Selectors
- Segmented control or dropdown pattern
- Format options: MP4, WebM, Audio (MP3)
- Quality grid: 1080p, 720p, 480p, 360p as selectable chips/buttons
- Selected state clearly distinguished
- Group spacing: gap-4 between selector groups

### Download Progress Indicator
- Linear progress bar: h-2, full width, rounded ends
- Percentage display: 18px, medium weight, positioned above bar
- Status text: "Preparing download...", "Downloading...", "Complete!" 
- Smooth animation transition (use CSS transforms)
- Container: p-6 with background treatment

### Primary Action Button
- Height: h-12 or h-14 for prominence
- Width: Full width on mobile, auto with px-12 on desktop
- Rounded corners: rounded-lg
- Text: 15px, medium weight
- States: Default, Hover, Active, Disabled (reduced opacity)

### Error/Success Messages
- Toast-style notifications or inline alerts
- Icon + message layout
- Padding: p-4, rounded-md
- Position: Fixed bottom-right for toasts, inline for validation

## Layout Structure

**Single-Column Flow:**
1. Header with app title and brief description
2. URL input section (hero-style prominence)
3. Video preview card (appears after URL parsing)
4. Format/quality selection (grid layout, 2 columns on desktop)
5. Download button (centered, prominent)
6. Progress indicator (appears during download)

**Spacing:**
- Vertical rhythm: space-y-8 between major sections
- Responsive: Increase to space-y-12 on larger screens

## Images

**Video Thumbnails:**
- Display fetched thumbnail from video URL
- Fallback: Generic video placeholder icon (from Heroicons)
- Aspect ratio: 16:9 maintained with object-cover
- Size: Full width in preview card (mobile), 320px width (desktop)
- Treatment: Rounded corners (rounded-md), subtle border

**No Hero Image:** This is a utility tool - lead directly with functionality (URL input) rather than visual storytelling.

## Icon Library

**Selected Library:** Heroicons (via CDN)
**Usage:**
- Download icon for primary button
- Play icon for video preview
- Check/X icons for validation feedback
- Information icon for tooltips/help text
- Size: 20px (w-5 h-5) or 24px (w-6 h-6) depending on context

## Accessibility

- All form inputs have associated labels
- ARIA labels for icon-only buttons
- Keyboard navigation support for all interactive elements
- Focus states clearly visible (outline with offset)
- Color is never the only means of conveying information

## Responsive Behavior

**Mobile (< 768px):**
- Single column layout throughout
- Full-width components
- Stacked format/quality selectors
- Bottom-sheet pattern for advanced options

**Desktop (≥ 768px):**
- Two-column layout for selectors
- Side-by-side thumbnail + metadata
- Inline button positioning
- Fixed max-width container for optimal reading

**Interactions:**
- Minimal animations: Focus on functional feedback only
- Progress bar smooth fill animation
- Success state subtle scale/fade effect
- No decorative scroll animations