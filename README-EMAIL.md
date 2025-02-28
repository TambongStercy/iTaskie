# Setting Up Email Functionality for Taskie

This document provides instructions for setting up email functionality in the Taskie application using either Supabase Edge Functions or EmailJS.

## Option 1: Supabase Edge Functions (Recommended)

Supabase Edge Functions are serverless functions that run on Supabase's infrastructure. They're ideal for server-side operations like sending emails.

### Prerequisites

- A Supabase account with access to your project
- An SMTP server (like Gmail, Outlook, SendGrid, etc.)

### Setup Steps

#### 1. Deploy the Edge Function

There are two ways to deploy the Edge Function:

**A. Using Supabase CLI (if you have Docker installed and working)**

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Navigate to the function directory
cd src/scripts/supabase

# Deploy the function
supabase functions deploy send-email --project-ref your_project_reference
```

**B. Using Supabase Dashboard (if CLI/Docker isn't working)**

1. Create a ZIP file containing your function:
   ```bash
   cd src/scripts/supabase/functions/send-email
   zip -r send-email.zip index.ts
   ```

2. Go to the [Supabase Dashboard](https://app.supabase.com)
3. Navigate to your project
4. Click on "Edge Functions" in the left sidebar
5. Click "Create a new function"
6. Name it "send-email"
7. Upload the ZIP file
8. Click "Deploy"

#### 2. Set Environment Variables

In the Supabase Dashboard:

1. Go to your Edge Function
2. Click the "Settings" tab
3. Add these environment variables:
   - `SMTP_HOST` (e.g., smtp.gmail.com)
   - `SMTP_PORT` (e.g., 587)
   - `SMTP_USERNAME` (your email account)
   - `SMTP_PASSWORD` (your email password or app password)
   - `FROM_EMAIL` (the sender email address)

**Note about Gmail:** If you're using Gmail, you'll need to:
1. Enable 2-factor authentication on your Google account
2. Create an "App Password" to use instead of your regular password
3. Use that App Password as your `SMTP_PASSWORD`

## Option 2: EmailJS (Fallback)

If you can't deploy Supabase Edge Functions, EmailJS provides an alternative that works directly from the browser.

### Prerequisites

- An [EmailJS](https://www.emailjs.com/) account (they have a free tier)

### Setup Steps

#### 1. Create an EmailJS Account

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Verify your account

#### 2. Connect an Email Service

1. In the EmailJS Dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps

#### 3. Create an Email Template

1. Go to "Email Templates"
2. Click "Create New Template"
3. Design your template using these parameters:
   - `{{to_email}}` - Recipient email
   - `{{subject}}` - Email subject
   - `{{message}}` - Email message content
   - `{{attachment_data}}` - Base64 PDF data
   - `{{attachment_name}}` - Name of the attachment
   
   Additionally, our code supports these custom variables for the task report:
   - `{{data_recipient_name}}` - Name of the recipient
   - `{{data_recipient_role}}` - Role of the recipient
   - `{{data_total_tasks}}` - Total number of tasks
   - `{{data_completed_tasks}}` - Number of completed tasks
   - `{{data_pending_tasks}}` - Number of pending tasks
   - `{{data_generated_date}}` - Date the report was generated

#### 4. Getting Your EmailJS Credentials

1. For your **User ID**:
   - Click on your account name in the top-right corner
   - Select "Account"
   - Under "API Keys", copy your "Public Key"

2. For your **Service ID**:
   - Go to "Email Services"
   - Click on your service
   - Copy the "Service ID" at the top

3. For your **Template ID**:
   - Go to "Email Templates"
   - Click on your template
   - Copy the "Template ID" at the top

#### 5. Configure Taskie with EmailJS

1. Add your EmailJS credentials to your `.env` file:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_USER_ID=your_user_id
   ```

## Testing Your Email Setup

1. Log in to your Taskie application
2. Navigate to the Tasks page
3. Click "Send Report" to a team member
4. Check if the email is sent successfully

## Troubleshooting

### Supabase Edge Functions

- Check the function logs in Supabase Dashboard
- Verify your SMTP credentials are correct
- Make sure your SMTP provider allows third-party access

### EmailJS

- Check browser console for errors
- Verify your EmailJS credentials in the .env file
- Make sure your email template parameters match the expected format
- Check EmailJS dashboard logs for error details

## Security Considerations

- Keep your SMTP and EmailJS credentials secure
- Never expose your service role key in client-side code
- Consider rate limiting to prevent abuse 