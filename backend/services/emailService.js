export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return false;
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';

  if (!apiKey) {
    console.log('EMAIL (dev fallback):', { to, subject, text });
    return true;
  }

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [{ type: 'text/plain', value: text || '' }].concat(html ? [{ type: 'text/html', value: html }] : [])
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('SendGrid error:', res.status, errText);
      return false;
    }
    return true;
  } catch (e) {
    console.error('SendGrid request failed:', e.message);
    return false;
  }
};
