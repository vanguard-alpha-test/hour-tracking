'use strict';

const { logEntry, getTotalHours, getEntriesForDate, clearEntries } = require('./tracker');

beforeEach(() => {
  clearEntries();
});

describe('logEntry', () => {
  test('stores a valid entry and returns it', () => {
    const entry = logEntry({ date: '2026-03-11', hours: 8, description: 'Feature work' });
    expect(entry).toEqual({ date: '2026-03-11', hours: 8, description: 'Feature work' });
  });

  test('throws on invalid date format', () => {
    expect(() => logEntry({ date: '11-03-2026', hours: 4, description: 'Bug fix' })).toThrow(
      /date must be/
    );
  });

  test('throws when hours is 0', () => {
    expect(() => logEntry({ date: '2026-03-11', hours: 0, description: 'Meeting' })).toThrow(
      /hours must be/
    );
  });

  test('throws when hours exceeds 24', () => {
    expect(() => logEntry({ date: '2026-03-11', hours: 25, description: 'Overtime' })).toThrow(
      /hours must be/
    );
  });

  test('throws on empty description', () => {
    expect(() => logEntry({ date: '2026-03-11', hours: 4, description: '   ' })).toThrow(
      /description must be/
    );
  });
});

describe('getTotalHours', () => {
  test('sums hours across multiple entries for the same date', () => {
    logEntry({ date: '2026-03-11', hours: 4, description: 'Morning session' });
    logEntry({ date: '2026-03-11', hours: 3.5, description: 'Afternoon session' });
    expect(getTotalHours('2026-03-11')).toBe(7.5);
  });

  test('returns 0 when no entries exist for a date', () => {
    expect(getTotalHours('2026-03-11')).toBe(0);
  });

  test('does not include entries from other dates', () => {
    logEntry({ date: '2026-03-10', hours: 8, description: 'Yesterday' });
    logEntry({ date: '2026-03-11', hours: 6, description: 'Today' });
    expect(getTotalHours('2026-03-11')).toBe(6);
  });

  test('throws on invalid date format', () => {
    expect(() => getTotalHours('2026/03/11')).toThrow(/date must be/);
  });
});

describe('getEntriesForDate', () => {
  test('returns only entries matching the given date', () => {
    logEntry({ date: '2026-03-11', hours: 2, description: 'Code review' });
    logEntry({ date: '2026-03-12', hours: 5, description: 'New feature' });
    const result = getEntriesForDate('2026-03-11');
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Code review');
  });

  test('returns empty array when no entries match', () => {
    expect(getEntriesForDate('2026-03-11')).toEqual([]);
  });
});
