const express = require('express');
const router = express.Router();
const db = require('./../db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid username or password' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error comparing passwords' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid username or password' });
      res.json({ message: 'Login successful', role: user.role });
    });
  });
});

// register new account
router.post('/register', (req, res) => {
  const { username, password, role, email } = req.body;

  if (!['mentee', 'mentor', 'admin'].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'mentee', 'mentor', or 'admin'." });
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, role], (err) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// get all users
router.get('/users', (req, res) => {
  db.query('SELECT username, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const token = crypto.randomBytes(20).toString('hex'); // or use uuid
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // check if email exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) {
      console.error('Email not found:', err);
      return res.status(400).json({ error: 'Email not found' });
    }

    // save token in database
    db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?',
      [code, email],
      (err) => {
        if (err) {
          console.error('Failed to update reset token:', err);
          return res.status(500).json({error: 'Database error'});
        }

        // send email
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        console.log('Send this link via email:', resetLink);

        const transporter = nodemailer.createTransport({
          host: 'smtp.mail.me.com',
          port: 587,
          secure: false,
          auth: {
            user: 'zee.kazmi@icloud.com',
            pass: 'eigi-jxfk-ocuk-jjiv',
          },
          tls: {
            rejectUnauthorized: false,
          }
        });
        
        const mailOptions = {
          from: 'zee.kazmi@icloud.com',
          to: email,
          subject: 'Reset your password',
          text: `Your password reset code is: ${code}. It will expire in 10 minutes.`
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error('Email failed:', err);
            return res.status(500).json({ error: 'Failed to send email' });
          }
          console.log('Email sent:', info.response);
          return res.json({ message: 'Password reset link sent' });
        });
      }
    );
  });
});

// verification code
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expiry > NOW()',
    [String(email), String(code)],
    (err, users) => {
      if (err) {
        console.error('DB error (verify code):', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (users.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired code' });
      }

      return res.json({ message: 'Code verified' });
    }
  );
});


router.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    db.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?',
      [hashedPassword, email],
      (err) => {
        if (err) {
          console.error('DB error (reset password):', err);
          return res.status(500).json({ error: 'Database error' });
        }

        return res.json({ message: 'Password updated successfully' });
      }
    );
  });
});


module.exports = router;
