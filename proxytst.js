const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Webshare Proxy settings
const proxyUrl = 'http://user-sp1v2wmc2y-sessionduration-60:fOl7bCyk_4e1NEv9ey@in.smartproxy.com:10003';
const proxyAgent = new HttpsProxyAgent(proxyUrl);

// Function to send OTP using the first API
async function sendOtpFirstApi(phoneNumber) {
    const url = 'https://api.jobhai.com/auth/jobseeker/v3/send_otp';
    const data = { phone: phoneNumber };
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
         'Origin': 'https://www.jobhai.com',
         'Priority': 'u=0',
        'source': 'WEB',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0', 
    };

    try {
        const response = await axios.post(url, data, { headers, httpAgent: proxyAgent });
        return response.data;
    } catch (error) {
        throw new Error('Error sending OTP from first API: ' + (error.response ? error.response.data : error.message));
    }
}

// API endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const otpResponse = await sendOtpFirstApi(phoneNumber);
        return res.status(200).json({ message: 'OTP sent successfully', data: otpResponse });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
