const nodemailer = require('nodemailer');

// Create transporter once — reused for all emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email service error:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    // Check credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email credentials are missing in .env');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `FlowMind <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} — ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmail;