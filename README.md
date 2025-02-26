# iTaskie - Task Management Application

A modern task management application built with React, TypeScript, and Supabase.

## Features

- User authentication (signup, login, password reset)
- Create, read, update, and delete tasks
- Set task priorities and due dates
- Real-time updates with Supabase
- Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend & Authentication**: Supabase
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/itaskie.git
cd itaskie
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with your Supabase credentials
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

1. Create a new project in Supabase
2. Run the SQL migration in `supabase/migrations/20240101000000_create_tasks_table.sql`

## Project Structure

```
src/
├── api/
│   └── supabase.ts       # Supabase client configuration
├── components/
│   ├── TaskForm.tsx      # Form for creating/editing tasks
│   └── TaskList.tsx      # List of tasks
├── contexts/
│   └── AuthContext.tsx   # Authentication context
├── hooks/
│   └── useTasks.ts       # Custom hook for task operations
├── pages/
│   ├── auth/
│   │   ├── ForgotPassword.tsx
│   │   ├── Login.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── Signup.tsx
│   │   └── index.ts
│   └── Dashboard.tsx     # Main dashboard page
├── utils/
│   └── store.ts          # Zustand store for state management
├── App.tsx               # Main application component
├── main.tsx              # Entry point
└── router.tsx            # Router configuration
```

## License

MIT
