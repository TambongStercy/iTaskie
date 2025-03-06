// This script loads environment variables and runs the population script
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
    console.error('Required variables are:');
    console.error('  - VITE_SUPABASE_URL: Your Supabase project URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key (not the anon key)');
    process.exit(1);
}

// Create Supabase admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock users to create
const MOCK_USERS = [
    {
        email: 'john.doe@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        department: 'Engineering',
        role: 'Software Developer'
    },
    {
        email: 'jane.smith@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Smith',
        department: 'Design',
        role: 'UX Designer'
    },
    {
        email: 'robert.johnson@example.com',
        password: 'Password123!',
        firstName: 'Robert',
        lastName: 'Johnson',
        department: 'Product',
        role: 'Product Manager'
    }
];

// Categories for tasks
const CATEGORIES = ['VASCLOUD', 'RBT', 'IT', 'MM'];

// Priorities for tasks
const PRIORITIES = ['low', 'medium', 'high'];

// Status options
const STATUS_OPTIONS = ['to_do', 'ongoing', 'completed'];

// Role options for team members
const ROLES = [
    'Technical Director, TD',
    'Product Manager, PM',
    'Mentor',
    'Developer',
    'Designer',
    'Tester',
    'Team Lead, TL',
    'Spare Part Manager, SPM'
];

/**
 * Create a user and return their UUID
 */
async function createUser(userData: typeof MOCK_USERS[0]) {
    try {
        // Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true // Auto-confirm email
        });


        if (authError && authError.message !== undefined) {
            console.error('Error creating user:', authError.message);
            return null;
        }

        const userId = authData.user?.id;

        // Create user profile in the profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                email: userData.email,
                first_name: userData.firstName,
                last_name: userData.lastName,
                department: userData.department,
                role: userData.role,
                created_at: new Date().toISOString()
            });

        if (profileError && profileError.message !== undefined) {
            console.error('Error creating profile:', profileError.message);
            return null;
        }

        console.log(`Created user: ${userData.email} with ID: ${userId}`);
        return userId;
    } catch (error) {
        console.error('Unexpected error:', error);
        return null;
    }
}

/**
 * Create random tasks for a user
 */
async function createTasksForUser(userId: string) {
    try {
        const tasks = [];

        // Create 10 tasks for this user
        for (let i = 1; i <= 10; i++) {
            const now = new Date();

            // Random due date between now and 30 days in the future
            const dueDate = new Date();
            dueDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);

            // Random priority
            const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];

            // Random completion status (30% chance of being completed)
            const isCompleted = Math.random() < 0.3;

            // Random status
            const status = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];

            // Random category
            const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

            tasks.push({
                id: uuidv4(),
                title: `Task ${i} for User ${userId.substring(0, 6)}`,
                description: `This is the description for task ${i}. It contains details about what needs to be done.`,
                is_completed: isCompleted,
                priority,
                due_date: dueDate.toISOString(),
                created_at: now.toISOString(),
                user_id: userId,
                category,
                status,
                is_on_track: Math.random() > 0.2, // 80% chance of being on track
                is_at_risk: Math.random() < 0.2 // 20% chance of being at risk
            });
        }

        // Insert all tasks for this user
        const { error } = await supabase.from('tasks').insert(tasks);

        if (error) {
            console.error('Error creating tasks:', error.message);
            return false;
        }

        console.log(`Created 10 tasks for user: ${userId}`);
        return true;
    } catch (error) {
        console.error('Unexpected error creating tasks:', error);
        return false;
    }
}

/**
 * Create random team members for a user
 */
async function createTeamMembersForUser(userId: string) {
    try {
        const teamMembers = [];

        // Create 5 team members for this user
        for (let i = 1; i <= 5; i++) {
            // Random role
            const role = ROLES[Math.floor(Math.random() * ROLES.length)];

            teamMembers.push({
                name: `Team Member ${i}`,
                email: `member${i}_${userId.substring(0, 6)}@example.com`,
                role,
                user_id: userId
            });
        }

        // Insert all team members for this user
        const { error } = await supabase.from('team_members').insert(teamMembers);

        if (error) {
            console.error('Error creating team members:', error.message);
            return false;
        }

        console.log(`Created 5 team members for user: ${userId}`);
        return true;
    } catch (error) {
        console.error('Unexpected error creating team members:', error);
        return false;
    }
}

/**
 * Main function to populate the database
 */
async function populateDatabase() {
    console.log('Starting database population...');

    // Create each user and their associated data
    for (const userData of MOCK_USERS) {
        const userId = await createUser(userData);

        if (userId) {
            // Create tasks for this user
            await createTasksForUser(userId);

            // Create team members for this user
            await createTeamMembersForUser(userId);

            console.log(`Completed setup for user: ${userData.email}`);
        }
    }

    console.log('Database population completed!');
}

// Run the script
console.log('Database population script running...');
populateDatabase().catch(error => {
    console.error('Script failed:', error);
}); 