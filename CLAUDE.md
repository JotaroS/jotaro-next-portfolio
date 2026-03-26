# CLAUDE.md — AI Assistant Guide for jotaro-next-portfolio

## Project Overview

A static academic portfolio website for Dr. Jotaro Shigeyama, built with Next.js 15 and React 19 RC. The site showcases publications, teaching, and a markdown-driven blog with interactive widgets.

**Key characteristics:**
- Static site export (`output: "export"`) — no server-side runtime
- No backend, no API routes, no database
- No tests, no CI/CD pipelines

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| React | React 19 RC |
| Styling | Tailwind CSS 3 + CSS variables |
| Components | shadcn/ui (new-york style, zinc base) |
| Icons | Lucide React |
| Theming | next-themes (class-based dark mode) |
| Markdown | marked + gray-matter |
| Math | KaTeX (CDN, via marked-katex-extension) |
| Diagrams | Mermaid.js |
| Code highlighting | highlight.js |
| Deployment | Static export (Vercel or similar CDN) |

---

## Repository Structure

```
/
├── app/                        # Next.js App Router pages & layout
│   ├── components/             # Page-specific components (NOT shared)
│   │   ├── publication_item.tsx
│   │   ├── publication_link_tags.tsx
│   │   ├── publication-types.ts
│   │   ├── lectures.tsx
│   │   ├── past_works.tsx
│   │   └── general_list.tsx
│   ├── fonts/                  # Local Geist fonts
│   ├── posts/                  # Blog routes
│   │   ├── page.tsx            # Blog index (grid of posts)
│   │   └── [id]/page.tsx       # Blog post detail (dynamic)
│   ├── project/transcalibur/   # Project-specific page
│   ├── globals.css             # Global styles + CSS variable definitions
│   ├── layout.tsx              # Root layout (header, footer, ThemeProvider)
│   └── page.tsx                # Portfolio home page
├── components/                 # Shared/reusable components
│   ├── ui/                     # shadcn/ui components (card.tsx, etc.)
│   ├── widgets/                # Interactive blog widget system
│   │   ├── WidgetRenderer.tsx  # Routes widget types to components
│   │   ├── mdx.tsx             # MDX integration
│   │   ├── types.ts
│   │   ├── index.ts
│   │   └── widgets/            # Individual widget implementations
│   │       ├── DiceRollWidget.tsx
│   │       ├── DiceMatchWidget.tsx
│   │       ├── HeightDistributionWidget.tsx
│   │       └── MermaidWidget.tsx
│   └── themeprovider.tsx       # next-themes wrapper ("use client")
├── lib/                        # Utility functions
│   ├── posts.ts                # Markdown post reading & parsing
│   ├── markdown-widgets.ts     # Widget extraction from markdown
│   └── utils.ts                # cn() (clsx + tailwind-merge)
├── posts/                      # Markdown source files for blog posts
│   └── *.md
├── public/                     # Static assets served directly
│   ├── publications_dev.json   # Publication data
│   ├── lectures.json           # Teaching/lecture data
│   ├── past_works.json         # Past projects data
│   ├── img/
│   ├── posts/                  # Post thumbnails & images
│   └── projects/               # Project assets
├── scripts/
│   └── new-post.mjs            # CLI: generates new post template
├── content_manager.py          # Python tkinter GUI for managing publications
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json             # shadcn/ui configuration
└── pyproject.toml              # Python tooling config
```

---

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Static export build (outputs to /out)
npm run start        # Start production server (requires build)
npm run lint         # ESLint check
npm run new:post     # Generate a new blog post template
```

> **Note:** There is no test command. No testing framework is configured.

---

## Key Conventions

### Naming

- **Components:** PascalCase (`PublicationSection`, `BlogCard`)
- **Files:** Mix of kebab-case and snake_case depending on location:
  - `app/components/` uses snake_case (`publication_item.tsx`)
  - `components/widgets/` uses PascalCase (`DiceRollWidget.tsx`)
- **Utility functions:** camelCase (`getSortedPostsData`)
- **Types/Interfaces:** PascalCase with descriptive suffix (`PostFrontmatter`, `WidgetSpec`)

### Component Location Rules

- **`app/components/`** — Components used only in specific pages (e.g., homepage sections)
- **`components/ui/`** — shadcn/ui primitive components
- **`components/widgets/`** — Interactive blog widget system
- **`components/`** — Shared non-UI components (e.g., `themeprovider.tsx`)

### Server vs. Client Components

- Server components are the default (no directive needed)
- Add `"use client"` only when the component uses browser APIs, hooks, or interactivity
- Theme provider and all widgets are client components
- Page-level data fetching happens in server components using `fs.readFile()`

### Import Aliases

Use `@/` to reference the project root:
```typescript
import { cn } from "@/lib/utils"
import { getSortedPostsData } from "@/lib/posts"
import { Card } from "@/components/ui/card"
```

---

## Data Layer

### Blog Posts

- Source files: `/posts/*.md` (Markdown with YAML frontmatter)
- Frontmatter schema:
  ```yaml
  ---
  date: YYYY-MM-DD
  title: Post Title
  tags: [tag1, tag2]
  abstract: One-line summary shown on blog index
  thumbnail: /posts/thumb.webp
  ---
  ```
- Utility functions in `lib/posts.ts`:
  - `getSortedPostsData()` — returns all posts sorted by date (for blog index)
  - `getPostData(id)` — returns content + frontmatter for a specific post
  - `getAllPostIds()` — returns post slugs for `generateStaticParams()`
- Use `npm run new:post` to generate a new post template

### Static JSON Data (Homepage)

Stored in `public/` and read server-side in `app/page.tsx` with `fs.readFile()`:
- `publications_dev.json` — Academic publications
- `lectures.json` — Teaching history
- `past_works.json` — Past projects

To update publications, use the `content_manager.py` Python GUI tool.

---

## Blog Widget System

Posts can embed interactive widgets using a custom syntax.

### Widget Syntax in Markdown

```html
<!-- Custom widget tags -->
<widget type="dice-roll" rolls="100" faces="6" />
<widget type="dice-match" rolls="50" />
<widget type="height-fit" />

<!-- Mermaid diagrams via fenced code blocks -->
```mermaid
graph TD
  A --> B
```
```

### How It Works

1. `lib/markdown-widgets.ts` — Extracts `<widget>` tags and mermaid fences from raw markdown, replaces them with HTML comment placeholders
2. `marked` processes the remaining markdown to HTML
3. `app/posts/[id]/page.tsx` — Splits the HTML at placeholders
4. `components/widgets/WidgetRenderer.tsx` — Renders the appropriate widget component

### Adding a New Widget

1. Create `components/widgets/widgets/MyWidget.tsx` (client component)
2. Add widget type to `components/widgets/WidgetRenderer.tsx`
3. Add extraction logic to `lib/markdown-widgets.ts` if it needs special parsing

---

## Styling System

### Tailwind CSS with CSS Variables

Colors use HSL CSS variables defined in `app/globals.css`, following the shadcn/ui convention:
```css
/* Access via Tailwind utilities */
bg-background, text-foreground, bg-card, text-muted-foreground, etc.
```

### Dark Mode

Class-based dark mode via `next-themes`. Toggle adds/removes `.dark` on `<html>`. CSS variables have separate light/dark values in `globals.css`.

### Custom CSS Classes

- `.award` — Pink/blue gradient for award highlights on publications
- `.myMarkdown` — Prose styling for rendered blog post HTML
- `.gradBorder` — Gradient border effect

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components install to `components/ui/`. Configuration in `components.json`.

---

## Static Export Constraints

This project uses `output: "export"` in `next.config.ts`. This means:

- No `getServerSideProps` or server actions
- No dynamic routes without `generateStaticParams()`
- No Next.js Image Optimization (use `<img>` or configure `unoptimized`)
- No middleware
- All data must be available at build time

---

## TypeScript Configuration

- **Strict mode** is enabled — avoid `any`, use proper types
- **Path alias** `@/*` maps to the project root
- Target: ES2017, module resolution: bundler

---

## Adding New Sections to the Homepage

The homepage (`app/page.tsx`) reads JSON data and renders section components from `app/components/`. To add a new section:

1. Add JSON data to `public/` if needed
2. Create a component in `app/components/`
3. Import and render it in `app/page.tsx`

---

## What NOT to Do

- Do not add API routes — this is a static site
- Do not use `getServerSideProps` — use server components or `generateStaticParams`
- Do not add a testing framework without discussing it first
- Do not add state management libraries (Redux, Zustand) — data is static
- Do not modify `public/publications_dev.json` manually — use `content_manager.py`
- Do not introduce new dependencies without checking if existing utilities cover the need (`cn()` for classnames, `marked` for markdown, etc.)
