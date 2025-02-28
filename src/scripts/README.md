# Database Setup Scripts

This directory contains scripts to help you set up and manage your Taskie database with Supabase.

## Setting Up Row Level Security (RLS)

Row Level Security (RLS) is critical for securing your database by controlling which users can see and modify which rows of data.

### Instructions for Setting Up RLS:

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `setup_rls.sql` and paste it into the SQL Editor
4. Run the SQL commands to enable RLS and create the necessary policies

Alternatively, you can run the SQL commands directly from the command line using the Supabase CLI:

```bash
supabase db execute --file=./src/scripts/setup_rls.sql
```

## Populating the Database

The `populate_database.ts` script will create 3 test users, each with 10 tasks and 5 team members.

### Prerequisites:

1. Make sure you have the necessary environment variables set up:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (not the anon key)

2. You'll need to install these dependencies:
   ```bash
   npm install @supabase/supabase-js uuid
   ```

### Running the Script:

1. Compile the TypeScript file:
   ```bash
   npx tsc src/scripts/populate_database.ts --esModuleInterop
   ```

2. Run the compiled JavaScript:
   ```bash
   node src/scripts/populate_database.js
   ```

### Test User Credentials:

After running the script, you can log in with any of these test accounts:

| Email                     | Password      |
|---------------------------|---------------|
| john.doe@example.com      | Password123!  |
| jane.smith@example.com    | Password123!  |
| robert.johnson@example.com| Password123!  |

## Understanding RLS Policies

The RLS policies created by the script enforce these security rules:

1. Users can only view, create, update, and delete their own tasks
2. Users can only view, create, update, and delete their own team members

This ensures data isolation between different users of the application. 