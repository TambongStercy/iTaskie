// Follow this pattern to use Supabase project secrets:
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface EmailRequest {
    to: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: {
        filename: string;
        content: string; // base64 encoded
        encoding: string;
        contentType: string;
    }[];
}

serve(async (req) => {
    try {
        // CORS headers
        if (req.method === 'OPTIONS') {
            return new Response('ok', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
                }
            })
        }

        // Get the request data
        const { to, subject, text, html, attachments } = await req.json() as EmailRequest

        // Get the email service credentials from env vars
        const SMTP_HOST = Deno.env.get('SMTP_HOST')
        const SMTP_PORT = Number(Deno.env.get('SMTP_PORT') || 587)
        const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME')
        const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD')
        const FROM_EMAIL = Deno.env.get('FROM_EMAIL')

        if (!SMTP_HOST || !SMTP_USERNAME || !SMTP_PASSWORD || !FROM_EMAIL) {
            throw new Error('Missing email configuration')
        }

        // Configure SMTP client
        const client = new SmtpClient();
        await client.connectTLS({
            hostname: SMTP_HOST,
            port: SMTP_PORT,
            username: SMTP_USERNAME,
            password: SMTP_PASSWORD,
        });

        // Prepare email with optional PDF attachment
        const emailOptions: any = {
            from: FROM_EMAIL,
            to: to,
            subject: subject,
            content: html || text,
            html: !!html,
        };

        // Add attachments if any
        if (attachments && attachments.length > 0) {
            emailOptions.attachments = attachments.map(attachment => ({
                filename: attachment.filename,
                content: Uint8Array.from(atob(attachment.content), c => c.charCodeAt(0)),
                contentType: attachment.contentType,
            }));
        }

        // Send the email
        await client.send(emailOptions);
        await client.close();

        return new Response(JSON.stringify({
            success: true,
            message: 'Email sent successfully'
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Unknown error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}) 