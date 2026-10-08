const Redis = require('ioredis');

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

if (!REDIS_HOST || !REDIS_PORT || !REDIS_PASSWORD || REDIS_PASSWORD === 'replace_with_upstash_redis_password') {
  throw new Error('Configure REDIS_HOST, REDIS_PORT, and REDIS_PASSWORD in Backend/.env.');
}

const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
  tls: {},
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