# Quick Start Guide

Get your Kanban Board up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher (or use Docker)
- npm or yarn

## Option 1: Quick Start with Docker (Recommended)

The fastest way to get started:

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd kanban-board

# Start everything with Docker
docker-compose up -d

# The app will be available at http://localhost:3000
\`\`\`

That's it! The database and app are now running.

### Stop the services:
\`\`\`bash
docker-compose down
\`\`\`

## Option 2: Manual Setup

### Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 2: Setup Database

**Option A: Use local PostgreSQL**

1. Create a database:
\`\`\`sql
createdb kanban_board
\`\`\`

2. Copy environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update \`.env\` with your database URL:
\`\`\`env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/kanban_board?schema=public"
\`\`\`

**Option B: Use Docker for PostgreSQL only**

\`\`\`bash
docker run -d \
  --name kanban-postgres \
  -e POSTGRES_PASSWORD=kanban_password \
  -e POSTGRES_USER=kanban_user \
  -e POSTGRES_DB=kanban_board \
  -p 5432:5432 \
  postgres:16-alpine
\`\`\`

Then update \`.env\`:
\`\`\`env
DATABASE_URL="postgresql://kanban_user:kanban_password@localhost:5432/kanban_board?schema=public"
\`\`\`

### Step 3: Run Migrations

\`\`\`bash
npx prisma migrate dev
npx prisma generate
\`\`\`

### Step 4: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## First Steps

### 1. Create Your First Board

1. Click "Create Board"
2. Enter a name (e.g., "My First Project")
3. Add a description (optional)
4. Click "Create"

### 2. Create Tasks

1. Click the "+" button in any column
2. Fill in task details:
   - Title (required)
   - Description
   - Priority
   - Due date
   - Time estimate
3. Click "Create Task"

### 3. Organize with Drag & Drop

- **Single drag:** Click and drag a task
- **Multi-select:** Hold Ctrl/Cmd and click multiple tasks, then drag
- **Keyboard:** Use Tab and Arrow keys to navigate

### 4. Manage Task Details

Click on any task to:
- Edit title and description
- Add comments
- Upload attachments
- Create checklists
- Assign team members
- Add labels
- Set dependencies

## Common Commands

\`\`\`bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npm run prisma:migrate  # Create migration
npm run prisma:studio   # Open Prisma Studio (DB GUI)

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Docker
npm run docker:up       # Start with Docker
npm run docker:down     # Stop Docker containers
\`\`\`

## Authentication Setup (Optional)

### Email/Password (Default)

Works out of the box - just create an account!

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth credentials
3. Add to \`.env\`:
   \`\`\`env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   \`\`\`

### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Add to \`.env\`:
   \`\`\`env
   GITHUB_ID="your-github-id"
   GITHUB_SECRET="your-github-secret"
   \`\`\`

## Production Deployment

### Quick Deploy to Vercel

\`\`\`bash
npx vercel
\`\`\`

### Deploy with Docker

\`\`\`bash
docker build -t kanban-board .
docker run -p 3000:3000 kanban-board
\`\`\`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guides.

## Troubleshooting

### Database connection failed
- Check PostgreSQL is running: \`pg_isready\`
- Verify \`DATABASE_URL\` in \`.env\`
- Check firewall settings

### Port 3000 already in use
\`\`\`bash
# Change port
PORT=3001 npm run dev
\`\`\`

### Prisma Client errors
\`\`\`bash
# Regenerate Prisma Client
npx prisma generate
\`\`\`

### Build errors
\`\`\`bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
\`\`\`

## Next Steps

- 📖 Read the [README](README.md) for detailed features
- 🔧 Check [API Documentation](API.md) for API usage
- 🚀 See [Deployment Guide](DEPLOYMENT.md) for production setup
- 🤝 Read [Contributing Guide](CONTRIBUTING.md) to contribute

## Need Help?

- 📧 Email: support@kanbanboard.com
- 💬 GitHub Discussions
- 🐛 Report bugs in GitHub Issues
- 📚 Full documentation in README.md

## Default Credentials (Development Only)

For quick testing, you can use:
- Email: demo@example.com
- Password: (any password will work in dev mode)

**⚠️ Change authentication in production!**

---

Happy task managing! 🎉


