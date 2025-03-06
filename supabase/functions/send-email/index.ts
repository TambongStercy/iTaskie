// Follow this pattern to use Supabase project secrets:
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

interface EmailResponse {
    success: boolean;
    message?: string;
    error?: string;
}

console.log('Email service initialized');

serve(async (req: Request) => {
    try {
        console.log('req', req)
        console.log('req.method', req.method)

        // CORS headers
        if (req.method === 'OPTIONS') {
            return new Response('ok', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
                }
            });
        }

        // Validate request method
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({
                success: false,
                error: 'Method not allowed'
            }), {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // Get the request data
        const { to, subject, text, html, attachments } = await req.json() as EmailRequest;

        // Validate required fields
        if (!to || !subject || (!text && !html)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing required fields: to, subject, and either text or html'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // Get the email service credentials from env vars
        const SMTP_HOST = Deno.env.get('SMTP_HOST');
        const SMTP_PORT = Number(Deno.env.get('SMTP_PORT') || 587);
        const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME');
        const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD');
        const FROM_EMAIL = Deno.env.get('FROM_EMAIL');

        console.log('SMTP_HOST', SMTP_HOST)
        console.log('SMTP_PORT', SMTP_PORT)
        console.log('SMTP_USERNAME', SMTP_USERNAME)
        console.log('SMTP_PASSWORD', SMTP_PASSWORD)
        console.log('FROM_EMAIL', FROM_EMAIL)

        // Check for required environment variables
        if (!SMTP_HOST || !SMTP_USERNAME || !SMTP_PASSWORD || !FROM_EMAIL) {
            console.error('Missing email configuration');
            return new Response(JSON.stringify({
                success: false,
                error: 'Server configuration error: Missing email settings'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // Configure SMTP client (using denomailer instead of the older smtp library)
        const client = new SMTPClient({
            connection: {
                hostname: SMTP_HOST,
                port: SMTP_PORT,
                tls: true,
                auth: {
                    username: SMTP_USERNAME,
                    password: SMTP_PASSWORD,
                }
            }
        });

        // Prepare email with optional HTML content
        const emailOptions: {
            from: string;
            to: string;
            subject: string;
            content?: string;
            html?: string;
            attachments?: Array<{
                filename: string;
                content: Uint8Array;
                contentType: string;
            }>;
        } = {
            from: FROM_EMAIL,
            to: to,
            subject: subject,
            content: html ? undefined : text,
            html: html,
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

        const response: EmailResponse = {
            success: true,
            message: 'Email sent successfully'
        };

        return new Response(JSON.stringify(response), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error sending email:', error);

        const response: EmailResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };

        return new Response(JSON.stringify(response), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}); 