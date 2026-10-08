const crypto = require("crypto");
const redis = require("../config/redis");

const VERIFY_PREFIX = 'email:verify:token:';
const USER_PREFIX = 'email:verify:user:';
const EXPIRES_IN_SEC = 30;

const generateVerificationToken = async (userId) => {
    // Delete any existing token for the user
    const oldToken = await redis.get(`${USER_PREFIX}${userId}`);
    if (oldToken) {
        await redis.del(`${VERIFY_PREFIX}${oldToken}`);
        await redis.del(`${USER_PREFIX}${userId}`);
    }

    // Generate random Token
    const token = crypto.randomBytes(32).toString('hex');

    await redis.setex(`${VERIFY_PREFIX}${token}`, EXPIRES_IN_SEC, userId.toString());
    await redis.setex(`${USER_PREFIX}${userId}`, EXPIRES_IN_SEC, token);
    return token;

};

const VerifyEmailToken = async (token) => {
    const userId = await redis.get(`${VERIFY_PREFIX}${token}`);
    return userId || null;
};

const DeleteToken = async (userId, Token) => {
    await redis.del(`${VERIFY_PREFIX}${Token}`);
    await redis.del(`${USER_PREFIX}${userId}`);
};

const hasPendingToken = async (userId) => {
    const token = await redis.get(`${USER_PREFIX}${userId}`);
    return !!token;
}

module.exports = {
    generateVerificationToken,
    VerifyEmailToken,
    DeleteToken,
    hasPendingToken,
};