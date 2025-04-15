# 🐾 Puppy Spa - Waiting List Management

A modern, user-friendly application designed to replace the physical logbook system used by Puppy Spa. Built with Next.js and TypeScript, it provides a seamless digital solution for managing pet grooming appointments.

## ✨ Features

- 📋 Daily waiting list management
- 🔄 Drag-and-drop appointment reordering
- ✅ Status tracking (Waiting/Completed)
- 📅 Calendar view for appointment scheduling
- 🔍 Real-time search functionality
- 📱 Responsive design for all devices
- ⚡ Real-time updates

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js (TypeScript)
- **Backend**: NestJS (TypeScript)
- **Database**: MySQL/PostgreSQL
- **Deployment**:
  - Frontend: Vercel
  - Backend: Docker & DigitalOcean
- **Infrastructure**:
  - Nginx reverse proxy
  - Cloudflare DNS/CDN
  - Docker containerization



## 🔄 Core Use Cases

### Home Page (Daily View)
1. Browser requests today's waiting list
2. Creates new list if none exists
3. Displays existing list data

### Appointment Management
1. **Create Entry**:
   - Submit puppy/owner information
   - Set arrival time
   - Backend assigns queue position

2. **List Management**:
   - Drag-and-drop reordering
   - Mark appointments as completed
   - Preserve completed entries with visual indication

3. **Calendar Features**:
   - Monthly overview of waiting lists
   - Historical entry access
   - Past queue review

## 🚀 Deployment Flow

- Automated Vercel deployment on main branch updates
- Automatic preview deployments for pull requests


## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git
- Docker (for backend development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/puppy-spa-fe--.git
cd puppy-spa-fe--
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=https://puppy.ccdev.space
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 📡 API Integration

### Endpoints
```typescript
POST /api/waiting-lists           // Create new waiting list
GET  /api/entries/list           // Get current waiting list
POST /api/entries                // Add new puppy entry
PUT  /api/entries/:id/status     // Update entry status
PUT  /api/entries/:id/position   // Reorder entries
GET  /api/entries/list?q=:query  // Search entries
```

Base URL: `https://puppy.ccdev.space/api`

## 🏗️ Project Structure

```
puppy-spa-fe--/
├── app/
│   ├── actions/         # Server actions for API calls
│   ├── components/      # React components
│   ├── types/          # TypeScript type definitions
│   ├── calendar/       # Calendar page
│   ├── search/         # Search page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── public/             # Static files
└── package.json        # Project dependencies
```

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI
  - Shadcn UI
- **Date Handling**: date-fns
- **State Management**: React Hooks + Server Actions
- **Notifications**: Sonner
