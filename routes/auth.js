const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [];

function isValidEmail(email){
  return email.includes('@') && email.includes('.');
}

router.post('/register', async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase().trim();
  if (!isValidEmail(email)) return res.status(400).json({ msg: "Enter valid email with @ and ." });
  if (users.find(u => u.email === email)) return res.status(400).json({ msg: "User exists" });
  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });
  res.json({ msg: "User registered" });
});

router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase().trim();
  if (!isValidEmail(email)) return res.status(400).json({ msg: "Enter valid email with @ and ." });
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ msg: "Invalid credentials" });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 3600000 });
  res.json({ msg: "Logged in" });
});

router.get('/profile', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ msg: `Welcome ${decoded.email}`, email: decoded.email });
  } catch { res.status(401).json({ msg: "Invalid token" }); }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ msg: "Logged out" });
});

module.exports = router;