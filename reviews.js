const express = require('express');
const db = require('./db');

const router = express.Router();

// عرض التقييمات لمستخدم معين
router.get('/user/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM reviews WHERE reviewed_user_id = ? ORDER BY id DESC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إضافة تقييم جديد
router.post('/', async (req, res) => {
  try {
    const { swap_id, reviewer_id, reviewed_user_id, rating, comment } = req.body;

    if (!swap_id || !reviewer_id || !reviewed_user_id || !rating) {
      return res.status(400).json({ message: 'المقايضة والمقيّم والمقيَّم والتقييم مطلوبة' });
    }

    const [result] = await db.query(
      `INSERT INTO reviews (swap_id, reviewer_id, reviewed_user_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [swap_id, reviewer_id, reviewed_user_id, rating, comment || '']
    );

    res.status(201).json({
      message: 'تم إضافة التقييم بنجاح',
      reviewId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
