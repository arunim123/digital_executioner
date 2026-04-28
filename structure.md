# Digital Executor - Detailed Project Structure

```text
/digital-executor
  ├── /frontend                     # Next.js 14 App Router
  │   ├── /src
  │   │   ├── /app
  │   │   │   ├── /vault
  │   │   │   │   └── /create       # Vault Creation Flow 
  │   │   │   │       └── page.tsx  # Altruistic Reframing Boilerplate
  │   │   │   ├── layout.tsx
  │   │   │   └── page.tsx
  │   │   ├── /components
  │   │   │   ├── /ui               # Atomic UI components
  │   │   │   └── /vault            # Complex Vault components
  │   │   ├── /utils
  │   │   │   └── encryption.ts     # Client-side AES-256-GCM Web Crypto API
  │   │   └── /hooks
  │   │       └── useVault.ts       # State management for Zero-Knowledge pipeline
  │   ├── package.json
  │   ├── tailwind.config.ts
  │   └── tsconfig.json
  │
  ├── /backend                      # Node.js / Express API
  │   ├── /src
  │   │   ├── /api
  │   │   │   ├── /routes           # Express route definitions
  │   │   │   └── /controllers      # Request handlers
  │   │   ├── /engine
  │   │   │   └── dmsEngine.ts      # Cron jobs & escalation ladder logic
  │   │   ├── /services
  │   │   │   ├── kmsService.ts     # AWS KMS integration
  │   │   │   ├── s3Service.ts      # AWS S3 Vault Storage
  │   │   │   └── redisClient.ts    # Redis client for state/timing lookups
  │   │   ├── /utils
  │   │   │   └── auth.ts           # JWT & Auth logic
  │   │   └── server.ts             # Express App entry point
  │   ├── /prisma
  │   │   └── schema.prisma         # Prisma Schema (VaultMetadata, Logs)
  │   ├── package.json
  │   └── tsconfig.json
  │
  ├── docker-compose.yml            # Local Redis & Postgres setup
  ├── .env.example
  └── README.md
```
