const express = require('express');
const db = require('./db');

const router = express.Router();

// عرض كل طلبات المقايضة
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM swaps ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إرسال طلب مقايضة جديد
router.post('/', async (req, res) => {
  try {
    const {
      target_service_id,
      offered_service_id,
      requester_id,
      provider_id,
      swap_type,
      notes
    } = req.body;

    if (!target_service_id || !requester_id || !provider_id) {
      return res.status(400).json({ message: 'الخدمة المطلوبة والمرسل والمستقبل مطلوبة' });
    }

    const [result] = await db.query(
      `INSERT INTO swaps (target_service_id, offered_service_id, requester_id, provider_id, swap_type, status, notes)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      [
        target_service_id,
        offered_service_id || null,
        requester_id,
        provider_id,
        swap_type || 'skill',
        notes || ''
      ]
    );

    res.status(201).json({
      message: 'تم إرسال طلب المقايضة بنجاح',
      swapId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// تحديث حالة المقايضة
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db.query('UPDATE swaps SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'تم تحديث حالة المقايضة بنجاح' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
