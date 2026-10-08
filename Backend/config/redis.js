const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    // Retry connection with increasing delay
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log(' Redis connected');
});

redis.on('error', (err) => {
  console.error(` Redis error: ${err.message}`);
});

redis.on('reconnecting', () => {
  console.warn(' Redis reconnecting...');
});

module.exports = redis;