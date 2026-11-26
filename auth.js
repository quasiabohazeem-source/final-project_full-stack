const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// 1. تسجيل حساب جديد
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, bio, skills_offered, skills_wanted } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'الاسم والإيميل وكلمة المرور مطلوبة' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'هذا الإيميل مسجل مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, bio, skills_offered, skills_wanted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        hashedPassword,
        bio || '',
        skills_offered || '',
        skills_wanted || ''
      ]
    );

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      userId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'الإيميل أو كلمة المرور غلط' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'الإيميل أو كلمة المرور غلط' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        points: user.points
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;