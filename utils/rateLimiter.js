/**
 * Rate limiter utility to prevent abuse
 */
const userCooldowns = new Map();

const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000");
const RATE_LIMIT_COMMANDS = parseInt(process.env.RATE_LIMIT_COMMANDS || "5");

/**
 * Check if user is rate limited
 * @param {string} userId - Discord user ID
 * @returns {object} { isLimited: boolean, remaining: number, resetTime: number }
 */
function checkRateLimit(userId) {
  const now = Date.now();

  if (!userCooldowns.has(userId)) {
    userCooldowns.set(userId, {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  }

  const userData = userCooldowns.get(userId);

  // Reset if window has passed
  if (now > userData.resetTime) {
    userData.count = 0;
    userData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  const isLimited = userData.count >= RATE_LIMIT_COMMANDS;
  const remaining = Math.max(0, RATE_LIMIT_COMMANDS - userData.count);

  // Increment after check
  if (!isLimited) {
    userData.count++;
  }

  return {
    isLimited,
    remaining,
    resetTime: userData.resetTime - now, // ms until reset
  };
}

/**
 * Clean up old entries periodically
 */
function cleanupCooldowns() {
  const now = Date.now();
  for (const [userId, data] of userCooldowns.entries()) {
    if (now > data.resetTime + 60000) {
      // Remove after 1 min of expiry
      userCooldowns.delete(userId);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupCooldowns, 5 * 60 * 1000);

module.exports = {
  checkRateLimit,
  cleanupCooldowns,
};
