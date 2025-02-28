import React, { useEffect } from 'react';
import { init } from '@emailjs/browser';

/**
 * This file provides configuration for EmailJS as an alternative to Supabase Edge Functions
 * 
 * Setup instructions:
 * 1. Sign up for EmailJS at https://www.emailjs.com/ (they have a free tier)
 * 2. Create an email service connecting to your email provider (Gmail, Outlook, etc.)
 * 3. Create an email template with these parameters:
 *    - {{to_email}} - Recipient email
 *    - {{subject}} - Email subject
 *    - {{message}} - Email message (will contain our styled HTML)
 *    - {{attachment_data}} - Base64 PDF data
 *    - {{attachment_name}} - Name of the attachment
 * 4. Get your EmailJS service ID, template ID, and user ID
 * 5. Add these to your .env file:
 *    - VITE_EMAILJS_SERVICE_ID=your_service_id
 *    - VITE_EMAILJS_TEMPLATE_ID=your_template_id 
 *    - VITE_EMAILJS_USER_ID=your_user_id
 */

// Initialize EmailJS
export const initEmailJS = () => {
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;
    if (userId) {
        init(userId);
        console.log('EmailJS initialized successfully');
    } else {
        console.warn('EmailJS user ID not found. Email functionality may not work properly.');
    }
};

/**
 * Formats data for the EmailJS template with custom data_ prefixed variables
 * Use this if your EmailJS template uses variables like {{data_recipient_name}} instead of {{recipientName}}
 * 
 * @param data The task report data with standard variable names
 * @returns An object with data_ prefixed variable names for EmailJS
 */
export const formatForEmailJSTemplate = (data: {
    recipientName: string;
    recipientRole: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    generatedDate: string;
}) => {
    return {
        data_recipient_name: data.recipientName,
        data_recipient_role: data.recipientRole,
        data_total_tasks: data.totalTasks,
        data_completed_tasks: data.completedTasks,
        data_pending_tasks: data.pendingTasks,
        data_generated_date: data.generatedDate
    };
};

// React component to initialize EmailJS
export const EmailJSInitializer: React.FC = () => {
    useEffect(() => {
        initEmailJS();
    }, []);

    return null;
};

// Configuration status checker
export const isEmailJSConfigured = (): boolean => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;

    return Boolean(serviceId && templateId && userId);
}; 