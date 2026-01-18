// Simple utility to trim input to Discord's 2000 char limit
function sanitizeInput(input) {
  if (!input) return "";
  return input.trim().substring(0, 2000);
}

module.exports = { sanitizeInput };
