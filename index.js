const express = require('express');
const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const dotenv = require('dotenv');

dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3030;

// Redis configuration
const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  }
};
// Create queue
const transactionsQueue = new Queue('transactions', redisConfig);

// Bull Board setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(transactionsQueue, { readOnlyMode: false }),
  ],
  serverAdapter,
  options: {
    uiConfig: {
      boardTitle: 'Bull Board Monitor',
    },
  },
});

// Mount Bull Board without auth
app.use('/admin/queues', serverAdapter.getRouter());

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bull Board Monitor Server running on port ${PORT}`);
  console.log(`📊 Bull Board UI available at: http://localhost:${PORT}/admin/queues`);
  console.log(`🏠 API endpoints at: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await transactionsQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await transactionsQueue.close();
  process.exit(0);
}); 