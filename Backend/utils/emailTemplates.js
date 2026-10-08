const verificationEmailTemplate = (name, verifyUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: #6366f1; padding: 30px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .body { padding: 32px; }
    .body p { color: #444; font-size: 15px; line-height: 1.6; }
    .btn { display: block; width: fit-content; margin: 24px auto; background: #6366f1; color: #fff;
           text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 15px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
    .expire { background: #fef9ec; border: 1px solid #fde68a; border-radius: 8px;
              padding: 10px 16px; color: #92400e; font-size: 13px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>FlowMind ✦</h1></div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thanks for signing up! Please verify your email address to activate your account.</p>
      <a class="btn" href="${verifyUrl}">Verify Email Address</a>
      <div class="expire">⏳ This link expires in <strong>24 hours</strong>.</div>
      <p style="margin-top:24px; color:#999; font-size:13px;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">© 2025 FlowMind. All rights reserved.</div>
  </div>
</body>
</html>
`;

module.exports = { verificationEmailTemplate };