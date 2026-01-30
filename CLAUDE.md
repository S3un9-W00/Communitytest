# CLAUDE.md

## Project Overview

- **Project Name**: test-project
- **Level**: Dynamic
- **Tech Stack**: Next.js 16+, TypeScript, Tailwind CSS, Prisma, NextAuth.js
- **Created**: 2026-01-30

## Development Guidelines

### Level: Dynamic

This is a **Dynamic** level project with:
- User authentication (login/register)
- Database (SQLite via Prisma)
- Community features (posts, comments, likes)

### Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16+ | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Prisma | Database ORM (SQLite) |
| NextAuth.js | Authentication |
| bcryptjs | Password hashing |

### Project Structure

```
test-project/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth.js
│   │   │   ├── posts/        # Posts CRUD
│   │   │   ├── comments/     # Comments
│   │   │   ├── likes/        # Likes
│   │   │   └── users/        # Users
│   │   ├── posts/            # Post pages
│   │   ├── profile/          # Profile pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # UI components
│   ├── lib/                  # Utilities (prisma, auth)
│   └── types/                # TypeScript types
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── dev.db               # SQLite database
├── public/
├── docs/
└── CLAUDE.md
```

### Database Schema

- **User**: id, email, name, password, bio
- **Post**: id, title, content, authorId
- **Comment**: id, content, authorId, postId
- **Like**: id, userId, postId (unique constraint)

### Commands

```bash
npm run dev                    # Start development server
npm run build                  # Build for production
npx prisma studio              # Open Prisma Studio (DB GUI)
npx prisma migrate dev         # Run migrations
npx prisma generate            # Generate Prisma Client
```

### Environment Variables

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Features

- [x] User registration/login
- [x] Post CRUD (create, read, update, delete)
- [x] Comments on posts
- [x] Like/unlike posts
- [x] User profile page
- [x] Profile editing

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| GET/POST | /api/auth/[...nextauth] | NextAuth.js |
| GET/POST | /api/posts | List/create posts |
| GET/PUT/DELETE | /api/posts/[id] | Single post operations |
| POST/DELETE | /api/comments | Create/delete comments |
| POST | /api/likes | Toggle like |
| GET/PUT | /api/users/[id] | Get/update user |
