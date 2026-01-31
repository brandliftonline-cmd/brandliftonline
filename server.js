require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, interest, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const data = await resend.emails.send({
            from: 'Brandlift Contact Form <onboarding@resend.dev>', // Use the testing domain for now
            to: ['brandliftonline@gmail.com'], // Reverted to verified email for testing domain
            subject: `New Inquiry: ${interest} - ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Interest:</strong> ${interest}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        if (data.error) {
            console.error('Resend Error:', data.error);
            return res.status(500).json({ error: data.error.message });
        }

        console.log('Email sent successfully:', data);
        res.status(200).json({ message: 'Email sent successfully', data });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const data = await resend.emails.send({
            from: 'Brandlift Newsletter <onboarding@resend.dev>',
            to: ['brandliftonline@gmail.com'],
            subject: 'New Newsletter Subscriber',
            html: `
                <h2>New Subscriber</h2>
                <p><strong>Email:</strong> ${email}</p>
            `
        });

        if (data.error) {
            console.error('Resend Subscribe Error:', data.error);
            return res.status(500).json({ error: data.error.message });
        }

        console.log('New subscriber:', data);
        res.status(200).json({ message: 'Subscribed successfully', data });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Fallback for SPA or just catch-all to index.html if needed (optional for static sites)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Run properly on local development, export for Netlify
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;
