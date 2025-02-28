/**
 * Email templates for the Taskie application
 */

interface TaskReportData {
    recipientName: string;
    recipientRole: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    generatedDate: string;
}

/**
 * Generates a beautifully styled HTML email for task reports
 */
export const generateTaskReportEmailHtml = (data: TaskReportData): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Taskie Task Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9fafb;">
  <!-- Header -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4f46e5" style="margin-bottom: 20px;">
    <tr>
      <td align="center" style="padding: 30px 0;">
        <h1 style="color: white; margin: 0; font-weight: 700; font-size: 28px; letter-spacing: -0.025em;">Taskie</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 16px; margin-top: 4px;">Task Management System</p>
      </td>
    </tr>
  </table>

  <!-- Main Content -->
  <table width="100%" max-width="600px" border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 40px;">
    <tr>
      <td style="padding: 0 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin-top: 0; color: #111827; font-weight: 700; font-size: 20px; margin-bottom: 16px;">Task Report</h2>
              
              <p style="margin-bottom: 16px; line-height: 1.5; color: #4b5563;">
                Dear <span style="font-weight: 600;">${data.recipientName}</span>,
              </p>
              
              <p style="margin-bottom: 24px; line-height: 1.5; color: #4b5563;">
                Attached is your task report generated from the Taskie application on <span style="font-weight: 500;">${data.generatedDate}</span>. 
                This report provides an overview of all tasks and their current status.
              </p>
              
              <!-- Report Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f4f6" style="border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin-top: 0; margin-bottom: 16px; color: #111827; font-size: 16px; font-weight: 600;">Report Summary</h3>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 14px;">Recipient:</td>
                              <td align="right" style="font-weight: 500; color: #111827; font-size: 14px;">${data.recipientName} (${data.recipientRole})</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 14px;">Total Tasks:</td>
                              <td align="right" style="font-weight: 500; color: #111827; font-size: 14px;">${data.totalTasks}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 14px;">Completed Tasks:</td>
                              <td align="right" style="font-weight: 500; color: #10b981; font-size: 14px;">${data.completedTasks}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 14px;">Pending Tasks:</td>
                              <td align="right" style="font-weight: 500; color: #f97316; font-size: 14px;">${data.pendingTasks}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin-bottom: 16px; line-height: 1.5; color: #4b5563;">
                The detailed information about each task is available in the attached PDF report. Please review it at your convenience.
              </p>
              
              <p style="margin-bottom: 24px; line-height: 1.5; color: #4b5563;">
                If you have any questions or need further information, please don't hesitate to reach out to your project manager.
              </p>
              
              <p style="margin-bottom: 8px; line-height: 1.5; color: #4b5563;">
                Best regards,
              </p>
              <p style="margin-top: 0; line-height: 1.5; color: #4b5563; font-weight: 600;">
                The Taskie Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f4f6">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          This is an automated message, please do not reply.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          © ${new Date().getFullYear()} Taskie. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Generates plain text version of the email for clients that don't support HTML
 */
export const generateTaskReportEmailText = (data: TaskReportData): string => {
    return `
Dear ${data.recipientName},

Attached is your task report generated from the Taskie application on ${data.generatedDate}.

REPORT SUMMARY:
---------------------------------
Recipient: ${data.recipientName} (${data.recipientRole})
Total Tasks: ${data.totalTasks}
Completed Tasks: ${data.completedTasks}
Pending Tasks: ${data.pendingTasks}
---------------------------------

The detailed information about each task is available in the attached PDF report.
Please review it at your convenience.

If you have any questions or need further information, please don't hesitate to 
reach out to your project manager.

Best regards,
The Taskie Team

---
This is an automated message, please do not reply.
© ${new Date().getFullYear()} Taskie. All rights reserved.
  `;
}; 