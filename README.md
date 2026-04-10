# ContentPilot — Social Media Autoposter

A full-stack content calendar and autonomous social media posting app. Schedule posts, manage content across platforms, and let the autoposter handle publishing to Twitter/X, LinkedIn, Facebook, and Instagram.

## Features

- 📅 **Visual Calendar** — Drag-and-drop content calendar with monthly view
- ✍️ **Post Editor** — Rich editor with character limit warnings per platform
- 🤖 **Auto-Publish** — Scheduled posts are automatically published via Supabase Edge Functions
- 📊 **Analytics Dashboard** — Track post performance across all platforms
- 🔗 **Multi-Platform** — Twitter/X, LinkedIn, Facebook, Instagram
- 🔒 **Secure Auth** — Supabase Auth with RLS policies
- 🌙 **Dark Mode** — Beautiful dark UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment**: Netlify (CI/CD)
- **Testing**: Playwright E2E tests

## Getting Started

```bash
npm install
cp .env.example .env
# Fill in your Supabase URL and anon key
npm run dev
```

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   React UI  │────▶│   Supabase   │────▶│  Edge Function  │
│  (Netlify)  │     │  (Database)  │     │ (Auto-Publish)  │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                  │
                                    ┌─────────────┼─────────────┐
                                    │             │             │
                               Twitter/X    LinkedIn    Facebook/IG
```

## License

MIT
