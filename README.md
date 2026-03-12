# Hour Tracking

A lightweight utility for tracking and reporting work hours.

## Features

- Log time entries with start/end timestamps
- Calculate total hours per day or week
- Export summaries as plain text

## Getting Started

```bash
npm install
npm test
```

## Usage

```js
const { logEntry, getTotalHours } = require('./src/tracker');

logEntry({ date: '2026-03-11', hours: 8, description: 'Feature development' });
console.log(getTotalHours('2026-03-11')); // 8
```

## License

MIT
