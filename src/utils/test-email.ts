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

/**
 * Test function for PDF attachments specifically
 * This function generates a small PDF and sends it via EmailJS
 */
export const testPdfAttachment = async (email: string) => {
    try {
        // Generate a simple PDF as base64 (this is a minimal PDF structure)
        const minimalPdf = 'JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDM4Cj4+CnN0cmVhbQp4nCvkMlAwMDDgMjIxMTIBEgZcRl5eXEGJjjpGXCGlXCGpAAlcBlwGAJjRBfoKZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKPj4KL0NvbnRlbnRzIDUgMCBSCi9QYXJlbnQgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9wcm9kdWNlciAoUERGVG9vbHMuanMgaHR0cHM6Ly9naXRodWIuY29tL2Npbm9mbGVjaC9wZGZ0b29scy1kaXN0L3RyZWUvbWFzdGVyL2RpcyNyZWFkbWUpCi9jcmVhdGlvbkRhdGUgKEQ6MjAyMzA2MDYxMjAwMDBaKQovbW9kRGF0ZSAoRDoyMDIzMDYwNjEyMDAwMFopCi90aXRsZSAoVGVzdCBQREYgZm9yIEVtYWlsSlMpCi9zdWJqZWN0IChUZXN0IFBERikKL2NyZWF0b3IgKFRhc2tpZSBBcHApCi9hdXRob3IgKFRhc2tpZSBBcHApCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyODEgMDAwMDAgbiAKMDAwMDAwMDIzNCAwMDAwMCBuIAowMDAwMDAwMzMwIDAwMDAwIG4gCjAwMDAwMDAxMTQgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKL0luZm8gMyAwIFIKPj4Kc3RhcnR4cmVmCjU2OAolJUVPRg==';

        const result = await sendEmailWithEmailJS(
            email, // Use the provided email address
            'Test PDF Attachment from Taskie',
            `This is a test email with a PDF attachment. 
            The PDF should be attached to this email.
            If you see the attachment, the EmailJS configuration for PDF attachments is working correctly.`,
            'test-document.pdf', // PDF filename
            minimalPdf, // Base64 PDF content
            {
                data_recipient_name: 'Test User',
                data_recipient_role: 'Tester',
                data_total_tasks: 10,
                data_completed_tasks: 5,
                data_pending_tasks: 5,
                data_generated_date: new Date().toLocaleDateString()
            }
        );

        console.log('PDF attachment test successful:', result);
        return { success: true, result };
    } catch (error) {
        console.error('PDF attachment test failed:', error);
        return { success: false, error };
    }
}; 