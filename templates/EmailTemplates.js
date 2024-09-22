import dotenv from 'dotenv';

dotenv.config();

export const newTrainerMailTemplate = ( firstName, email, password ) => {
  return {
    from: {
      name: 'Department of Health',
      address: process.env.EMAIL,
    },
    to: email,
    subject: 'Welcome To Department of Health',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          /* Add any custom styles here */
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9f9f9;">
        <!-- Centering container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <!-- Content -->
              <table role="presentation" width="600" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Greeting -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                      <tr>
                        <td>
                          <h1>Welcome to Department of Health</h1>
                        </td>
                      </tr>
                    </table>
                    <!-- Content -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fff; padding: 20px; border-radius: 10px;">
                      <tr>
                        <td>
                          <p>Hi ${firstName},</p>
                          <p>Welcome to the Department of Health. Your account has been successfully created. Please find your login credentials below:</p>
                          <p>Email: ${email}</p>
                          <p>Password: ${password}</p>
                          <p>For security reasons, please change your password after logging in.</p>
                        </td>
                      </tr>
                    </table>
                    <!-- Footer -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                      <tr>
                        <td>
                          <p>If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `,
  }
};

export const changeTrainerEmailTemplate = (firstName, email, newEmail, password) => {
  return {
    from: {
      name: 'Department of Health',
      address: process.env.EMAIL,
    },
    to: newEmail,
    subject: 'Email Change Notification',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Change Notification</title>
        </head>
        <body>
          <table role="presentation" class="container" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <table role="presentation" class="content" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <h1>Email Change Notification</h1>
                      <p>Hi ${firstName},</p>
                      <p>We wanted to let you know that the email address associated with your account has been changed to ${newEmail}.</p>
                      <p>Your new login credentials are as follows:</p>
                      <p>Email: ${newEmail}</p>
                      <p>Password: ${password}</p>
                      <p>If you did not request this change, please contact our support team immediately.</p>
                      <p>Thank you,</p>
                      <p>Department of Health</p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" class="footer" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <p>If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
};

export const verifyLoginEmailTemplate = (firstName, email, otp, device) => {
  return {
    from: {
      name: 'Department of Health',
      address: process.env.EMAIL,
    },
    to: email,
    subject: 'Login Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Verification</title>
        </head>
        <body>
          <table role="presentation" class="container" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <table role="presentation" class="content" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <h1>Login Verification Code</h1>
                      <p>Hi ${firstName},</p>
                      <p>We received a login attempt to your account from a ${device}.</p>
                      <p>To complete the login process, please use the following verification code:</p>
                      <h2>${otp}</h2>
                      <p>If you did not initiate this login attempt, please secure your account by changing your password immediately.</p>
                      <p>Thank you,</p>
                      <p>Department of Health</p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" class="footer" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <p>If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
};


export const newTraineeMailTemplate = ( firstName, email, password ) => {
  return {
    from: {
      name: 'Department of Health',
      address: process.env.EMAIL,
    },
    to: email,
    subject: 'Welcome To Department of Health',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          /* Add any custom styles here */
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9f9f9;">
        <!-- Centering container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <!-- Content -->
              <table role="presentation" width="600" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Greeting -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                      <tr>
                        <td>
                          <h1>Welcome to Department of Health</h1>
                        </td>
                      </tr>
                    </table>
                    <!-- Content -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fff; padding: 20px; border-radius: 10px;">
                      <tr>
                        <td>
                          <p>Hi ${firstName},</p>
                          <p>Welcome to the Department of Health. Your Trainee Application has been successfully approved. Please find your login credentials below:</p>
                          <p>Email: ${email}</p>
                          <p>Password: ${password}</p>
                          <p>For security reasons, please change your password after logging in.</p>
                        </td>
                      </tr>
                    </table>
                    <!-- Footer -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                      <tr>
                        <td>
                          <p>If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `,
  }
};

export const declineTraineeMailTemplate = (firstName, email) => {
  return {
    from: {
      name: 'Department of Health',
      address: process.env.EMAIL,
    },
    to: email,
    subject: 'Welcome To Department of Health',
    html: `
      <html>
        <body>
          <h1>Application Status Update</h1>
          <p>Dear ${firstName},</p>
          <p>We regret to inform you that your application to our training program has been declined.</p>
          <p>If you have any questions or need further information, please feel free to contact us at ${email}.</p>
          <p>Thank you for your interest in our program.</p>
          <p>Best regards,</p>
          <p>The Training Team</p>
        </body>
      </html>
    `,
  }
}

export const resetPasswordTemplate = (firstName, email, password) => {
  return {
    from: {
      name: 'Department of Health',
      address: process.env.EMAIL,
    },
    to: email,
    subject: 'Password Reset Notification',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Notification</title>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Notification</h1>
            </div>
            <div class="content">
              <p>Dear ${firstName},</p>
              <p>Your password has been successfully reset. Here are your new login details:</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>New Password:</strong> ${password}</p>
              <p>Please make sure to change your password after logging in for security purposes.</p>
              <p>If you did not request a password reset, please contact our support team immediately.</p>
              <p>Best regards,</p>
              <p>Department of Health</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Department of Health. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};