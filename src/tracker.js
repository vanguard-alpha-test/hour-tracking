'use strict';

/**
 * In-memory store for time entries.
 * Each entry: { date: string (YYYY-MM-DD), hours: number, description: string }
 */
const entries = [];

/**
 * Log a new time entry.
 * @param {object} entry
 * @param {string} entry.date - Date in YYYY-MM-DD format
 * @param {number} entry.hours - Hours worked (must be > 0 and <= 24)
 * @param {string} entry.description - Brief description of work done
 * @returns {object} The stored entry
 */
function logEntry({ date, hours, description }) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('date must be a valid string in YYYY-MM-DD format');
  }
  if (typeof hours !== 'number' || hours <= 0 || hours > 24) {
    throw new Error('hours must be a number between 0 (exclusive) and 24 (inclusive)');
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    throw new Error('description must be a non-empty string');
  }

  const entry = { date, hours, description: description.trim() };
  entries.push(entry);
  return entry;
}

/**
 * Get total hours logged for a given date.
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {number} Total hours for that date
 */
function getTotalHours(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('date must be a valid string in YYYY-MM-DD format');
  }
  return entries
    .filter((e) => e.date === date)
    .reduce((sum, e) => sum + e.hours, 0);
}

/**
 * Get all entries for a given date.
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {object[]} Array of entries
 */
function getEntriesForDate(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('date must be a valid string in YYYY-MM-DD format');
  }
  return entries.filter((e) => e.date === date);
}

/**
 * Clear all stored entries. Useful for testing.
 */
function clearEntries() {
  entries.length = 0;
}

module.exports = { logEntry, getTotalHours, getEntriesForDate, clearEntries };
