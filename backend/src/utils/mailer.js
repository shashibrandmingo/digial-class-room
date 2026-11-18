import nodemailer from 'nodemailer';

const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass },
  });
};

export const sendBookingConfirmationEmail = async ({
  clientName,
  clientEmail,
  clientPhone,
  bookingId,
  bookingDate,
  slotName,
  slotTime,
  amount,
  paymentId,
}) => {
  const studioName = process.env.STUDIO_NAME || 'Digital Classroom Recording Studio';
  const studioPhone = process.env.STUDIO_PHONE || '+91 98765 43210';
  const studioAddress = process.env.STUDIO_ADDRESS || 'Studio 402, 4th Floor, Creator Hub';

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
      .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
      .badge { display: inline-block; background: #10b981; color: white; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-top: 14px; }
      .content { padding: 32px 24px; }
      .booking-box { background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; }
      .row:last-child { border-bottom: none; font-weight: 700; color: #0f172a; font-size: 16px; }
      .row-label { color: #64748b; }
      .row-val { font-weight: 600; text-align: right; }
      .instructions { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 4px; font-size: 13px; color: #1e40af; margin-top: 24px; }
      .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Slot Booking Confirmed!</h1>
        <p>${studioName}</p>
        <span class="badge">Payment Verified • ₹${amount}</span>
      </div>

      <div class="content">
        <p>Dear <strong>${clientName}</strong>,</p>
        <p>Thank you for choosing our Digital Classroom setup! Your recording session slot has been reserved successfully.</p>

        <div class="booking-box">
          <div class="row">
            <span class="row-label">Booking ID:</span>
            <span class="row-val" style="color:#4f46e5;">${bookingId}</span>
          </div>
          <div class="row">
            <span class="row-label">Recording Date:</span>
            <span class="row-val">${bookingDate}</span>
          </div>
          <div class="row">
            <span class="row-label">Selected Slot:</span>
            <span class="row-val">${slotName}</span>
          </div>
          <div class="row">
            <span class="row-label">Timing:</span>
            <span class="row-val">${slotTime}</span>
          </div>
          <div class="row">
            <span class="row-label">Payment ID:</span>
            <span class="row-val" style="font-family: monospace;">${paymentId}</span>
          </div>
          <div class="row">
            <span class="row-label">Total Amount Paid:</span>
            <span class="row-val">₹${amount} (All Inclusive)</span>
          </div>
        </div>

        <div class="instructions">
          <strong>📌 Important Studio Guidelines:</strong>
          <ul style="margin: 6px 0 0; padding-left: 18px;">
            <li>Please arrive 15 minutes before your slot timing.</li>
            <li>Carry a high-speed SSD / Pen Drive (min 64GB) to take your raw/rendered footage.</li>
            <li>Digital Smartboard, 4K Studio Cameras, Teleprompter & Wireless Collar Mics will be pre-configured.</li>
            <li>For support or studio directions, call us at <strong>${studioPhone}</strong>.</li>
          </ul>
        </div>

        <div style="margin-top: 24px; padding: 14px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px;">
          <strong style="color:#6b21a8;">📍 Studio Address:</strong>
          <p style="margin: 4px 0 0; font-size: 13px; color: #581c87;">${studioAddress}</p>
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} ${studioName}. All rights reserved.<br>
        Have queries? Reply directly to this email or call ${studioPhone}.
      </div>
    </div>
  </body>
  </html>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n================== [EMAIL SIMULATION] ==================`);
    console.log(`To: ${clientEmail} (${clientName})`);
    console.log(`Subject: ✅ Booking Confirmed - ${bookingId} (${slotName})`);
    console.log(`Date: ${bookingDate} | Timing: ${slotTime} | Amount: ₹${amount}`);
    console.log(`Note: Configure SMTP_USER and SMTP_PASS in backend/.env to send actual live emails.`);
    console.log(`=========================================================\n`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"${studioName}" <no-reply@digitalclassroom.com>`,
      to: clientEmail,
      subject: `✅ Booking Confirmed: ${slotName} on ${bookingDate} [${bookingId}]`,
      html: htmlContent,
    });
    console.log(`📧 Confirmation email delivered to ${clientEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email delivery failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};
