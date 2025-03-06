-- Enable Row Level Security on tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if needed (uncomment if needed when updating policies)
-- DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
-- DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
-- DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
-- DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
-- DROP POLICY IF EXISTS "Users can view their team members" ON team_members;
-- DROP POLICY IF EXISTS "Users can manage their team members" ON team_members;

-- Create RLS policies for tasks table
CREATE POLICY "Users can view their own tasks"
ON tasks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
ON tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON tasks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for team_members table
CREATE POLICY "Users can view their team members"
ON team_members
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their team members"
ON team_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their team members"
ON team_members
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their team members"
ON team_members
FOR DELETE
USING (auth.uid() = user_id);

-- Optional: Create a policy for admins to see all data
-- Uncomment and configure if you have an admin role system
-- CREATE POLICY "Admins can see all tasks"
-- ON tasks
-- FOR ALL
-- USING (auth.uid() IN (SELECT user_id FROM admin_users)); 