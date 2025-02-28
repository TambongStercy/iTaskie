import { supabase } from './supabase';
import { generateTaskReportEmailHtml, generateTaskReportEmailText } from '../utils/emailTemplates';
import emailjs from '@emailjs/browser';
import { formatForEmailJSTemplate } from '../utils/emailjs-config';

interface SendEmailOptions {
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

/**
 * Sends an email using the Supabase Edge Function
 * @param options Email options including recipient, subject, content, and attachments
 * @returns Response from the email service
 */
export const sendEmail = async (options: SendEmailOptions) => {
    try {
        // Call the Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('send-email', {
            body: options,
        });

        if (error) {
            console.error('Error calling send-email function:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Sends an email using EmailJS as a fallback option
 * @param to Recipient email address
 * @param subject Email subject
 * @param text Email body text
 * @param attachmentName Name of the attachment file
 * @param pdfBase64 Base64 encoded PDF document
 * @returns Response from the email service
 */
export const sendEmailWithEmailJS = async (
    to: string,
    subject: string,
    text: string,
    attachmentName: string = 'task-report.pdf',
    pdfBase64: string,
    emailData?: any // Additional data for the template
) => {
    try {
        console.log(`Preparing to send email to: ${to}`);
        console.log(`PDF attachment: ${attachmentName} (${Math.round(pdfBase64.length / 1024)} KB)`);

        // Make sure your EmailJS service is set up to handle these template parameters
        const templateParams = {
            to_email: to,
            subject: subject,
            message: text,
            // PDF must be properly formatted as a base64 string without the data URI prefix
            attachment_data: pdfBase64.startsWith('data:')
                ? pdfBase64.split(',')[1]
                : pdfBase64,
            attachment_name: attachmentName,
            // Include all the formatted data_ variables if provided
            ...(emailData || {})
        };

        // Replace these IDs with your actual EmailJS service, template, and user IDs
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
        const userId = import.meta.env.VITE_EMAILJS_USER_ID || '';

        if (!serviceId || !templateId || !userId) {
            throw new Error('Missing EmailJS configuration. Please set the required environment variables.');
        }

        console.log('Sending email via EmailJS...');
        const response = await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            userId
        );

        console.log('Email sent via EmailJS successfully!', response);
        return {
            success: true,
            message: 'Email sent successfully',
            response
        };
    } catch (error) {
        console.error('Error sending email with EmailJS:', error);
        throw error;
    }
};

/**
 * Sends a PDF report to a team member with beautiful styling
 * @param to Recipient email address
 * @param recipientName Name of the recipient
 * @param recipientRole Role of the recipient
 * @param subject Email subject
 * @param totalTasks Total number of tasks
 * @param completedTasks Number of completed tasks
 * @param pendingTasks Number of pending tasks
 * @param pdfBase64 Base64 encoded PDF document
 * @returns Response from the email service
 */
export const sendPdfReport = async (
    to: string,
    recipientName: string,
    recipientRole: string,
    subject: string,
    totalTasks: number,
    completedTasks: number,
    pendingTasks: number,
    pdfBase64: string
) => {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const emailData = {
        recipientName,
        recipientRole,
        totalTasks,
        completedTasks,
        pendingTasks,
        generatedDate: today
    };

    // Generate the HTML and plain text versions of the email
    const htmlContent = generateTaskReportEmailHtml(emailData);
    const textContent = generateTaskReportEmailText(emailData);

    // Format the data for EmailJS template with data_ prefix
    const formattedEmailData = formatForEmailJSTemplate(emailData);

    try {
        // First try using EmailJS as primary method
        console.log('Sending email with EmailJS as primary method');
        return await sendEmailWithEmailJS(
            to,
            subject,
            textContent, // Plain text is sent as the message
            'task-report.pdf',
            pdfBase64,
            formattedEmailData // Pass the formatted data with data_ prefixes
        );
    } catch (error) {
        console.log('EmailJS failed, falling back to Supabase Edge Function:', error);

        // If EmailJS fails, fall back to Supabase Edge Function
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