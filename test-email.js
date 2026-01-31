
const http = require('http');

const data = JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    interest: "Web Development",
    message: "This is a test message from the verification script."
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/send-email',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Response:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
