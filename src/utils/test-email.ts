import { sendEmailWithEmailJS } from '../api/email';

/**
 * Simple function to test EmailJS configuration
 * Run this from a component or page to test if EmailJS is working properly
 */
export const testEmailJS = async () => {
    try {
        const result = await sendEmailWithEmailJS(
            'your-test-email@example.com', // Replace with your email address
            'Test Email from Taskie',
            'This is a test email from Taskie app using EmailJS. If you receive this, your EmailJS configuration is working correctly.',
            'test-attachment.txt',
            'VGhpcyBpcyBhIHRlc3QgYXR0YWNobWVudA==', // Base64 encoded "This is a test attachment"
            {
                data_recipient_name: 'Test User',
                data_recipient_role: 'Tester',
                data_total_tasks: 10,
                data_completed_tasks: 5,
                data_pending_tasks: 5,
                data_generated_date: new Date().toLocaleDateString()
            }
        );

        console.log('EmailJS test successful:', result);
        return { success: true, result };
    } catch (error) {
        console.error('EmailJS test failed:', error);
        return { success: false, error };
    }
}; 