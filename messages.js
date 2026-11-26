const express = require('express');
const db = require('../config/db');

const router = express.Router();

// عرض رسائل مقايضة معينة
router.get('/swap/:swapId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM messages WHERE swap_id = ? ORDER BY id ASC',
      [req.params.swapId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إرسال رسالة جديدة
router.post('/', async (req, res) => {
  try {
    const { swap_id, sender_id, content } = req.body;

    if (!swap_id || !sender_id || !content) {
      return res.status(400).json({ message: 'رقم المقايضة والمرسل ونص الرسالة مطلوبة' });
    }

    const [result] = await db.query(
      `INSERT INTO messages (swap_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [swap_id, sender_id, content]
    );

    res.status(201).json({
      message: 'تم إرسال الرسالة بنجاح',
      messageId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;