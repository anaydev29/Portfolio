// Contact details and form setup.
//
// To receive messages from the form:
//   1. Make a free form at https://formspree.io (it emails you each message).
//   2. Copy its endpoint, which looks like https://formspree.io/f/abcdwxyz
//   3. Paste it below, replacing YOUR_FORM_ID (or set VITE_FORM_ENDPOINT in a .env file).
// Until then, the form opens the visitor's email app with the message ready to send.

export const contact = {
  email: 'shivhareanay2908@gmail.com',
  github: 'https://github.com/anaydev29',
  linkedin: 'https://www.linkedin.com/in/anay-shivhare-7385a8380',
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID',
}

export const formConfigured = !contact.formEndpoint.includes('YOUR_FORM_ID')
