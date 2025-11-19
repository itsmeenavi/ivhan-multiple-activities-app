# Multiple Activities App - Ivhan Salazar

A comprehensive full-stack web application built with Next.js featuring five distinct activities with full CRUD operations, authentication, and real-time data management.

## 🎯 Project Overview

This application demonstrates proficiency in modern web development by implementing multiple interactive features including todo management, photo uploads, review systems, and markdown notes - all with a clean, professional UI using a modern green color palette.

## ✨ Features

### Activity 1: Todo List
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Toggle completion status with responsive checkboxes
- ✅ Loading state indicators during updates
- ✅ Inline editing functionality
- ✅ Persistent data storage with Supabase
- ✅ Real-time statistics (total, completed, pending)

### Activity 2: Photo Management (Google Drive Lite)
- 📸 Upload photos to Supabase Storage
- 🔍 Search photos by name
- 🔄 Sort by name (A-Z, Z-A) or date (Newest/Oldest)
- ✏️ Rename photos
- 🗑️ Delete photos
- 📊 Photo count and size tracking

### Activity 3: Food Review App
- 🍕 Upload food photos with preview/submit flow
- 👥 View ALL food photos from ALL users
- ⭐ Star rating system (1-5 stars)
- 💬 Write and manage reviews on any food photo
- 👤 Reviewer names displayed on all reviews
- 🔄 Full CRUD on both photos and reviews
- 📱 Dual-panel interface (photos + reviews)
- 🔄 Sort by name or upload date

### Activity 4: Pokemon Review App
- 🔍 Search Pokemon using PokeAPI
- 📋 View Pokemon details (sprite, types)
- ⭐ Rate and review Pokemon
- 👤 Reviewer names displayed on all reviews
- 📝 Track your reviewed Pokemon
- 🔄 Sort reviews by name or date

### Activity 5: Markdown Notes App
- 📝 Create and edit notes with Markdown support
- 👁️ Toggle between raw markdown and preview
- ✏️ View-only mode with dedicated edit button
- 💾 Auto-save functionality
- 📚 Notes list with timestamps and visual selection
- 🎨 Rich markdown rendering with react-markdown

## 🔐 Authentication & Security

- User authentication via Supabase Auth
- User profiles with display names
- Profile settings page for account management
- Row-Level Security (RLS) policies
- User-specific data isolation for personal data
- Shared viewing of community content (food photos, Pokemon reviews)
- Protected routes and API endpoints
- Full account deletion (auth + database records) via secure API route

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.0.3](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.0](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives

### State Management & Data Fetching
- **[TanStack Query (React Query) 5.62.7](https://tanstack.com/query/latest)** - Server state management
- **[Axios 1.7.9](https://axios-http.com/)** - HTTP client

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage (for photos)
  - Row Level Security (RLS)

### UI Components & Icons
- **[Lucide React 0.462.0](https://lucide.dev/)** - Beautiful icon library
- **[Sonner 1.7.1](https://sonner.emilkowal.ski/)** - Toast notifications
- **[react-markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering

### External APIs
- **[PokeAPI](https://pokeapi.co/)** - Pokemon data for Activity 4

### Utilities
- **[clsx 2.1.1](https://github.com/lukeed/clsx)** - Class name utilities
- **[class-variance-authority 0.7.1](https://cva.style/)** - Variant management
- **[tailwind-merge 2.5.5](https://github.com/dcastil/tailwind-merge)** - Tailwind class merging

## 🎨 Design System

- **Primary Color**: `#347a24` (Dark Green)
- **Secondary Color**: `#66a777` (Light Green)
- **Background**: Pure White
- **Font**: Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Theme**: Light mode only (professional, clean aesthetic)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd ivhan-multiple-activities-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Note**: The `SUPABASE_SERVICE_ROLE_KEY` is required for account deletion functionality (used in API routes).

4. **Set up Supabase Database**

Run the SQL schema in your Supabase SQL Editor (see `Database Schema` section below)

5. **Create Storage Buckets**

In Supabase Storage, create two public buckets:
- `photos`
- `food-photos`

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### Tables

**profiles**
```sql
- id (uuid, primary key, foreign key → auth.users)
- display_name (text)
- email (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**todos**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- title (text)
- completed (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

**photos**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- name (text)
- url (text)
- size (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

**food_photos**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- name (text)
- url (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**food_reviews**
```sql
- id (uuid, primary key)
- food_photo_id (uuid, foreign key → food_photos)
- user_id (uuid, foreign key → auth.users)
- rating (integer, 1-5)
- comment (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**pokemon_reviews**
```sql
- id (uuid, primary key)
- pokemon_id (integer)
- pokemon_name (text)
- user_id (uuid, foreign key → auth.users)
- rating (integer, 1-5)
- comment (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**notes**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- title (text)
- content (text)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🚀 Build & Deploy

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Run linter
```bash
npm run lint
```

## 📁 Project Structure

```
ivhan-multiple-activities-app/
├── src/
│   ├── app/
│   │   ├── activity-1/         # Todo List
│   │   ├── activity-2/         # Photo Management
│   │   ├── activity-3/         # Food Review
│   │   ├── activity-4/         # Pokemon Review
│   │   ├── activity-5/         # Markdown Notes
│   │   ├── profile/            # Profile settings page
│   │   ├── api/
│   │   │   └── delete-account/ # Account deletion API route
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   └── nav-bar.tsx         # Navigation bar
│   ├── contexts/
│   │   └── auth-context.tsx    # Authentication context
│   ├── hooks/
│   │   ├── use-todos.ts
│   │   ├── use-photos.ts
│   │   ├── use-food.ts
│   │   ├── use-pokemon.ts
│   │   ├── use-notes.ts
│   │   └── use-profiles.ts     # Profile data fetching
│   ├── services/
│   │   ├── todo.service.ts
│   │   ├── photo.service.ts
│   │   ├── food.service.ts
│   │   ├── pokemon.service.ts
│   │   ├── note.service.ts
│   │   └── profile.service.ts  # Profile management
│   ├── types/
│   │   ├── database.types.ts
│   │   └── profile.types.ts    # Profile type definitions
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── client.ts       # Supabase client
│   │   └── utils.ts            # Utility functions
│   └── providers/
│       └── query-provider.tsx  # TanStack Query provider
├── public/                     # Static assets
├── .env.local                  # Environment variables (not in repo)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🔑 Key Features Implementation

### Real-time Updates
- Automatic query invalidation and refetching after mutations
- Optimistic UI updates for better UX
- Instant feedback with loading states

### User Experience
- Modern modal dialogs for confirmations (delete, sign out)
- Enhanced AlertDialog components with themed styling
- Preview/submit flow for image uploads
- Loading spinners during async operations
- Toast notifications for all actions

### File Upload
- Direct upload to Supabase Storage
- Image preview before submission
- Image optimization with Next.js Image component
- File size tracking and display
- Support for remote images (PokeAPI)

### Row-Level Security (RLS)
- User-specific data isolation (todos, photos, notes)
- Shared community content (food photos, Pokemon reviews)
- Secure API endpoints with Supabase RLS policies
- Admin-level operations via service role key

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interfaces
- Dual-panel layouts on larger screens

## 👨‍💻 Developer

**Ivhan Salazar**

Built as an assessment project for Sta Clara International Corporation, demonstrating full-stack development capabilities with modern web technologies.

## 📝 License

This is an assessment project. All rights reserved.

---

Built with ❤️ using Next.js and Supabase
