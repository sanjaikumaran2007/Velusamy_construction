/**
 * POST /api/contact
 * Validates an enquiry from the site's contact form and relays it by
 * email to the company inbox. Falls back to console logging if SMTP
 * credentials are not configured, so the form still works in local dev.
 */

const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email, and message are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
  }

  const enquiry = {
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: phone ? String(phone).slice(0, 40) : 'Not provided',
    message: String(message).slice(0, 4000),
    receivedAt: new Date().toISOString()
  };

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== 'false',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_TO_EMAIL || 'velusamyconstructionpvt@gmail.com',
        replyTo: enquiry.email,
        subject: `New project enquiry from ${enquiry.name}`,
        text: `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\n\n${enquiry.message}`
      });
    } else {
      // No SMTP configured yet — log so local/dev testing still shows the submission.
      console.log('[contact] New enquiry (SMTP not configured):', enquiry);
    }

    return res.status(200).json({ ok: true, message: 'Thanks — we will get back to you shortly.' });
  } catch (err) {
    console.error('[contact] Failed to send enquiry email:', err.message);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please call or DM us instead.' });
  }
});

module.exports = router;
