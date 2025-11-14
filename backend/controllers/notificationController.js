import { sendEmail } from '../services/emailService.js';

export const sendNotification = async (req, res) => {
  const { to, subject, text } = req.body;
  const ok = await sendEmail({ to, subject, text });
  res.json({ success: ok });
};
