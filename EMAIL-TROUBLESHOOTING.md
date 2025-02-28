# Email Functionality Troubleshooting Guide

This guide helps you troubleshoot issues with the email functionality in the Taskie application.

## Current Setup

The Taskie app uses a dual email system:
1. **Primary Method**: Supabase Edge Function (`send-email`)
2. **Fallback Method**: EmailJS (browser-based)

If you see errors like `Edge Function returned a non-2xx status code` followed by `falling back to EmailJS`, it means the primary method failed but the fallback should be working.

## Troubleshooting Supabase Edge Function

### Common Issues

1. **Edge Function Not Deployed**
   - Make sure the Edge Function is properly deployed to your Supabase project
   - Deploy using: `supabase functions deploy send-email`

2. **Missing Environment Variables**
   - The Edge Function requires these env variables:
     - `SMTP_HOST` (e.g., smtp.gmail.com)
     - `SMTP_PORT` (typically 587)
     - `SMTP_USERNAME` (email address)
     - `SMTP_PASSWORD` (email password/app password)
     - `FROM_EMAIL` (sender email)
   
   - Set them using:
     ```bash
     supabase secrets set SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USERNAME=your@email.com SMTP_PASSWORD=yourpassword FROM_EMAIL=your@email.com
     ```
   
   - Or set them in the Supabase Dashboard:
     1. Go to your project
     2. Navigate to Edge Functions
     3. Select the `send-email` function
     4. Go to "Environment variables" tab
     5. Add each variable

3. **Authentication Issues**
   - If using Gmail, you need an "App Password" instead of your regular password
   - Create one at: https://myaccount.google.com/apppasswords
   
4. **Function Timing Out**
   - Edge functions have execution time limits (typically 2 seconds)
   - Check if your email provider is slow to respond
   
5. **CORS Issues**
   - Make sure the function is allowing requests from your app's domain

### Testing the Edge Function

Test directly using the Supabase CLI:

```bash
supabase functions serve send-email
```

Then send a test request:

```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{"to":"your-email@example.com","subject":"Test Email","text":"This is a test email from the Supabase Edge Function"}'
```

## Troubleshooting EmailJS

### Common Issues

1. **Missing Environment Variables**
   - Check if these variables are set in your `.env` file:
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_USER_ID`

2. **Incorrect Template Setup**
   - Your EmailJS template should include these parameters:
     - `{{to_email}}`
     - `{{subject}}`
     - `{{message}}`
     - `{{attachment_data}}`
     - `{{attachment_name}}`
     - And any custom data parameters (`{{data_recipient_name}}`, etc.)

3. **Service Quota Limits**
   - EmailJS free tier has limits (200 emails/month)
   - Check your usage in the EmailJS dashboard

### Testing EmailJS

Use the test script we created:

```typescript
import { testEmailJS } from './src/utils/test-email';

// Call this from a component to test
await testEmailJS();
```

You can also use the new testing component we've added:

```typescript
import EmailTester from './src/components/EmailTester';

// Add this component to any page to test email functionality
<EmailTester />
```

## PDF Attachment Issues

If you're specifically having problems with PDF attachments:

1. **Template Configuration**
   
   Make sure your EmailJS template has this exact code for attachments:
   
   ```
   <attachment>
     {
       "filename": "{{attachment_name}}",
       "data": "{{attachment_data}}"
     }
   </attachment>
   ```

2. **Base64 Encoding**
   
   PDF files must be encoded properly. Make sure:
   - PDF is converted to base64 correctly
   - The data URI prefix (`data:application/pdf;base64,`) is removed before sending

3. **PDF Size Limits**
   
   - EmailJS has attachment size limits (typically 5-10MB)
   - If your PDF is too large, try reducing its quality or size
   - Add compression to the PDF generation step if needed

4. **Testing PDF Attachments**
   
   Use our dedicated PDF attachment test:
   
   ```typescript
   import { testPdfAttachment } from './src/utils/test-email';
   
   // Send a test email with PDF attachment
   await testPdfAttachment('your@email.com');
   ```

5. **Provider Restrictions**
   
   Some email providers (Gmail, Outlook) may filter or block emails with PDF attachments from services like EmailJS. Try:
   - Using a different recipient email address
   - Checking spam/junk folders
   - Verifying with your email provider about attachment policies

## Choosing a Primary Method

If you continue having trouble with the Supabase Edge Function:

1. **Option A**: Fix the Edge Function issues (recommended for production)
   - More reliable for high volume
   - Better security (credentials not exposed to browser)
   - Better deliverability
   
2. **Option B**: Use EmailJS as primary method
   - Easier to set up
   - No server-side deployment needed
   - Works well for low volume
   
To use EmailJS as your primary method, modify `src/api/email.ts`:

```typescript
export const sendPdfReport = async (...) => {
    // Format data for EmailJS
    const formattedEmailData = formatForEmailJSTemplate(emailData);
    
    try {
        // Use EmailJS as primary method
        return await sendEmailWithEmailJS(
            to,
            subject,
            textContent,
            'task-report.pdf',
            pdfBase64,
            formattedEmailData
        );
    } catch (error) {
        console.error('EmailJS failed:', error);
        
        // Optionally try Supabase as fallback
        return await sendEmail({
            to,
            subject,
            text: textContent,
            html: htmlContent,
            attachments: [
                {
                    filename: 'task-report.pdf',
                    content: pdfBase64,
                    encoding: 'base64',
                    contentType: 'application/pdf',
                }
            ]
        });
    }
};
```

## Still Having Issues?

If you're still encountering problems:

1. Check browser console for detailed error messages
2. Verify your email service is working (Gmail, Outlook, etc.)
3. Try sending a plain text email without attachments first
4. Verify your Supabase project is on a plan that supports Edge Functions
5. Check if your email service is blocking programmatic sending 