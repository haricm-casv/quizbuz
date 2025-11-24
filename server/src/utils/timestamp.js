/**
 * Returns the current high-resolution timestamp in nanoseconds.
 * Uses process.hrtime.bigint() for microsecond/nanosecond precision.
 * @returns {bigint}
 */
function getHighResTimestamp() {
  return process.hrtime.bigint();
}

/**
 * Formats a high-res timestamp difference into seconds (string).
 * @param {bigint} start 
 * @param {bigint} end 
 * @returns {string} e.g. "0.123s"
 */
function formatDuration(start, end) {
  const diff = end - start;
  // Convert nanoseconds to seconds (1e9 ns = 1 s)
  const seconds = Number(diff) / 1e9;
  return `${seconds.toFixed(3)}s`;
}

module.exports = {
  getHighResTimestamp,
  formatDuration
};
