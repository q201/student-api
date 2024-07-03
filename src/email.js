/* eslint-disable prettier/prettier */
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Create a transporter
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: '202qasim202@gmail.com', // your Gmail address
      pass: 'icef vinn vehm sowu' // your Gmail password or app password
  },
});

app.get('/send-email', (req, res) => {
    let mailOptions = {
        from: '"Qasim ali" <202qasim202@gmail.com>',
        to: '202qasim202@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email',
        html: '<b>This is a test email from my side . Have a nice day Baby!</b>',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:');
            console.log(error.message);
            return res.status(500).send('Failed to send email.');
        }
        console.log('Message sent successfully to tarannum!');
        console.log('Server responded with "%s"', info.response);
        res.send('Email sent successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
