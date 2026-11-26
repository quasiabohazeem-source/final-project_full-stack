const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const swapRoutes = require('./routes/swaps');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');

const app = express();
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