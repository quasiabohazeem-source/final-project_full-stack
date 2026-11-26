const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const authRoutes = require('./auth');
const serviceRoutes = require('./services');
const swapRoutes = require('./swaps');
const messageRoutes = require('./messages');
const reviewRoutes = require('./reviews');

const app = express();
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

// فحص الاتصال بقاعدة البيانات
app.get('/api/db-check', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS test');
    res.json({ ok: true, message: 'Connected to MySQL skillswap_db!', result: rows[0].test });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// مسارات التطبيق
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
