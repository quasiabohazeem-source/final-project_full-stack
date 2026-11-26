const express = require('express');
const db = require('../config/db');

const router = express.Router();

// عرض جميع الخدمات
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT services.*, users.full_name AS provider_name
       FROM services
       JOIN users ON services.user_id = users.id
       ORDER BY services.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إضافة خدمة جديدة
router.post('/', async (req, res) => {
  try {
    const { user_id, title, description, category } = req.body;

    if (!user_id || !title) {
      return res.status(400).json({ message: 'رقم المستخدم وعنوان الخدمة مطلوبين' });
    }

    const [result] = await db.query(
      `INSERT INTO services (user_id, title, description, category)
       VALUES (?, ?, ?, ?)`,
      [user_id, title, description || '', category || 'General']
    );

    res.status(201).json({
      message: 'تمت إضافة الخدمة بنجاح',
      serviceId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;