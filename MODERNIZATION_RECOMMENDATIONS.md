# APDU Library - 2025 Modernization Recommendations

## Executive Summary

This document provides a comprehensive review of the `apdu` npm package and recommendations for updating it to align with 2025 JavaScript/Node.js best practices. The library constructs APDU (Application Protocol Data Unit) commands for smart card communication (ISO 7816-4).

**Last Updated:** December 2025
**Current Version:** 0.0.5 (published February 2021)
**Repository:** https://github.com/tomkp/apdu

---

## Current State Assessment

| Area                  | Status                          | Priority |
| --------------------- | ------------------------------- | -------- |
| Node.js Compatibility | Critical Issue (deprecated API) | P0       |
| Module System         | Inconsistent (mixed ES6/CJS)    | P1       |
| Build Tooling         | Outdated (Babel 7.12, Feb 2021) | P1       |
| Testing               | None                            | P1       |
| Documentation         | Empty README                    | P1       |
| Type Safety           | None                            | P2       |
| Linting/Formatting    | None                            | P2       |
| CI/CD                 | None                            | P2       |

---

## Critical Issues (P0)

### 1. Deprecated Buffer Constructor

**Location:** `src/apdu.js:70`

```javascript
// Current (DEPRECATED - triggers runtime warning)
return new Buffer(this.bytes);

// Fix
return Buffer.from(this.bytes);
```

The `Buffer()` constructor has been deprecated since Node.js v6.0.0 and causes `DeprecationWarning: Buffer() is deprecated`. This should be fixed immediately as it affects all Node.js users.

---

## High Priority Issues (P1)

### 2. Module System Inconsistency

**Location:** `src/apdu.js:3` and `src/apdu.js:73`

The file mixes ES6 imports with CommonJS exports:

```javascript
// Line 3: ES6 import
import hexify from 'hexify';

// Line 73: CommonJS export
module.exports = Apdu;
```

**Recommendation:** Choose one module system. For 2025, prefer ES Modules (ESM):

```javascript
// Option A: Full ESM (recommended for 2025)
import hexify from 'hexify';
export default Apdu;
export { Apdu };

// package.json addition:
"type": "module"
```

Or provide dual ESM/CJS support via package.json exports field.

### 3. Outdated Build Dependencies

**Current versions (from February 2021):**

- `@babel/cli@^7.12.16`
- `@babel/core@^7.12.16`
- `@babel/preset-env@^7.12.16`

**Recommended updates:**

```json
{
  "devDependencies": {
    "@babel/cli": "^7.24.0",
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0"
  }
}
```

**Alternative - Consider dropping Babel entirely:** Modern Node.js (v18+) has excellent ES Module support. If targeting Node.js 18+ only, you may not need Babel at all. Use native ESM instead.

### 4. No Test Suite

**Current state:** No tests exist.

**Recommendation:** Add Vitest (the modern test runner for 2025):

```bash
npm install -D vitest @vitest/coverage-v8
```

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

```javascript
// src/apdu.test.js
import { describe, it, expect } from 'vitest';
import Apdu from './apdu.js';

describe('Apdu', () => {
  it('should construct a basic APDU command', () => {
    const apdu = new Apdu({
      cla: 0x00,
      ins: 0xa4,
      p1: 0x04,
      p2: 0x00,
    });
    expect(apdu.toByteArray()).toEqual([0x00, 0xa4, 0x04, 0x00, 0x00]);
  });

  it('should convert to hex string', () => {
    const apdu = new Apdu({
      cla: 0x00,
      ins: 0xa4,
      p1: 0x04,
      p2: 0x00,
    });
    expect(apdu.toString()).toBe('00A4040000');
  });

  it('should handle data field correctly', () => {
    const apdu = new Apdu({
      cla: 0x00,
      ins: 0xa4,
      p1: 0x04,
      p2: 0x00,
      data: [0x01, 0x02, 0x03],
    });
    expect(apdu.lc).toBe(3);
  });
});
```

### 5. Empty Documentation

**Current state:** README.md is empty.

**Recommendation:** Add comprehensive documentation:

````markdown
# apdu

Lightweight Node.js library for constructing APDU (Application Protocol Data Unit) commands for smart card communication (ISO 7816-4).

## Installation

```bash
npm install apdu
```
````

## Usage

```javascript
import Apdu from 'apdu';

// SELECT command example
const selectCommand = new Apdu({
  cla: 0x00, // Class byte
  ins: 0xa4, // Instruction: SELECT
  p1: 0x04, // P1: Select by DF name
  p2: 0x00, // P2: First or only occurrence
  data: [0xa0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10], // AID
  le: 0x00, // Expected response length
});

console.log(selectCommand.toString()); // Hex string
console.log(selectCommand.toByteArray()); // Byte array
console.log(selectCommand.toBuffer()); // Node.js Buffer
```

## API

### `new Apdu(options)`

| Option | Type     | Description              |
| ------ | -------- | ------------------------ |
| `cla`  | number   | Class byte (0x00-0xFF)   |
| `ins`  | number   | Instruction byte         |
| `p1`   | number   | Parameter 1              |
| `p2`   | number   | Parameter 2              |
| `data` | number[] | Optional command data    |
| `le`   | number   | Expected response length |

### Methods

- `toString()` - Returns hex string representation
- `toByteArray()` - Returns raw byte array
- `toBuffer()` - Returns Node.js Buffer

## License

MIT

````

---

## Medium Priority Issues (P2)

### 6. Add TypeScript Support

For 2025, TypeScript (or at minimum JSDoc types) is expected for library code.

**Option A: Full TypeScript migration**

```typescript
// src/apdu.ts
import hexify from 'hexify';

export interface ApduOptions {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  data?: number[];
  le?: number;
  size?: number;
}

export class Apdu {
  readonly bytes: number[];
  readonly size: number;
  readonly cla: number;
  readonly ins: number;
  readonly p1: number;
  readonly p2: number;
  readonly data?: number[];
  readonly le: number;
  readonly lc?: number;

  constructor(options: ApduOptions) {
    // ... implementation
  }

  toString(): string {
    return hexify.toHexString(this.bytes);
  }

  toByteArray(): number[] {
    return this.bytes;
  }

  toBuffer(): Buffer {
    return Buffer.from(this.bytes);
  }
}

export default Apdu;
````

**Option B: JSDoc types (no build step required)**

```javascript
/**
 * @typedef {Object} ApduOptions
 * @property {number} cla - Class byte
 * @property {number} ins - Instruction byte
 * @property {number} p1 - Parameter 1
 * @property {number} p2 - Parameter 2
 * @property {number[]} [data] - Command data
 * @property {number} [le] - Expected response length
 * @property {number} [size] - Override size calculation
 */

/**
 * Constructs an APDU command
 * @param {ApduOptions} options
 */
function Apdu(options) {
  // ...
}
```

**Option C: Separate type definitions**

Create `types/apdu.d.ts` for TypeScript consumers without migrating source.

### 7. Add ESLint and Prettier

```bash
npm install -D eslint @eslint/js prettier eslint-config-prettier
```

```javascript
// eslint.config.js (flat config - ESLint 9+)
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'error',
      'no-buffer-constructor': 'error', // Would catch the Buffer issue
    },
  },
];
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 8. Add CI/CD with GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  publish:
    needs: test
    if: github.ref == 'refs/heads/master'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 9. Update package.json for Modern Standards

```json
{
  "name": "apdu",
  "version": "1.0.0",
  "description": "Lightweight library for constructing APDU commands for smart card communication (ISO 7816-4)",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/apdu.js",
      "require": "./dist/apdu.cjs",
      "types": "./dist/apdu.d.ts"
    }
  },
  "main": "./dist/apdu.cjs",
  "module": "./dist/apdu.js",
  "types": "./dist/apdu.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/apdu.ts --format cjs,esm --dts",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/",
    "format": "prettier --write .",
    "prepublishOnly": "npm run build && npm test",
    "release": "npm run build && npm version patch && git push --follow-tags && npm publish"
  },
  "engines": {
    "node": ">=18"
  },
  "keywords": ["apdu", "smart-card", "iso-7816", "nfc", "pcsc"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tomkp/apdu.git"
  },
  "author": "tom@tomkp.com",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/tomkp/apdu/issues"
  },
  "homepage": "https://github.com/tomkp/apdu#readme",
  "dependencies": {
    "hexify": "^1.0.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.0",
    "tsup": "^8.0.0",
    "typescript": "^5.4.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0"
  }
}
```

### 10. Add Input Validation

Current code has no validation. Recommended additions:

```javascript
function Apdu(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Options object is required');
  }

  const { cla, ins, p1, p2, data, le = 0, size } = options;

  // Validate required fields
  if (typeof cla !== 'number' || cla < 0 || cla > 255) {
    throw new RangeError('cla must be a byte value (0-255)');
  }
  if (typeof ins !== 'number' || ins < 0 || ins > 255) {
    throw new RangeError('ins must be a byte value (0-255)');
  }
  if (typeof p1 !== 'number' || p1 < 0 || p1 > 255) {
    throw new RangeError('p1 must be a byte value (0-255)');
  }
  if (typeof p2 !== 'number' || p2 < 0 || p2 > 255) {
    throw new RangeError('p2 must be a byte value (0-255)');
  }

  if (data !== undefined) {
    if (!Array.isArray(data)) {
      throw new TypeError('data must be an array of bytes');
    }
    if (data.some((b) => typeof b !== 'number' || b < 0 || b > 255)) {
      throw new RangeError('All data values must be bytes (0-255)');
    }
    if (data.length > 255) {
      throw new RangeError('data length cannot exceed 255 bytes (short APDU)');
    }
  }

  // ... rest of implementation
}
```

---

## Lower Priority Improvements (P3)

### 11. Consider Removing hexify Dependency

The `hexify` package hasn't been updated since 2014. Consider inlining the hex conversion:

```javascript
toHexString(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
```

### 12. Add Extended APDU Support

Current implementation only supports short APDUs (Lc/Le ≤ 255). Consider adding extended APDU support for ISO 7816-4 compliance:

```javascript
// Extended APDU: Lc can be up to 65535 bytes
if (this.data && this.data.length > 255) {
  // Use 3-byte Lc encoding
  this.bytes.push(0x00); // Extended length indicator
  this.bytes.push((this.lc >> 8) & 0xff);
  this.bytes.push(this.lc & 0xff);
}
```

### 13. Modern Class Syntax

Convert from constructor function to ES6 class:

```javascript
export class Apdu {
  #bytes;

  constructor(options) {
    // validation...
    this.#bytes = [];
    // build command...
  }

  toString() {
    return this.#bytes
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  toByteArray() {
    return [...this.#bytes]; // Return copy to prevent mutation
  }

  toBuffer() {
    return Buffer.from(this.#bytes);
  }
}
```

### 14. Add .nvmrc for Node Version

```
22
```

### 15. Clean Up Commented Code

Remove debug comments at lines 18, 24, 30, 37, 45 in `src/apdu.js`.

---

## Migration Path

### Phase 1: Critical Fixes (Immediate)

1. Fix `new Buffer()` deprecation
2. Clean up commented code
3. Add basic README documentation

### Phase 2: Modernization (Short-term)

1. Update Babel dependencies or migrate to native ESM
2. Add Vitest test suite with basic coverage
3. Add ESLint and Prettier
4. Fix module system (consistent ESM)
5. Update package.json scripts

### Phase 3: Enhancement (Medium-term)

1. Add TypeScript types (either migration or .d.ts)
2. Set up GitHub Actions CI/CD
3. Add input validation
4. Bump major version to 1.0.0

### Phase 4: Polish (Long-term)

1. Consider dropping hexify dependency
2. Add extended APDU support
3. Add more comprehensive documentation
4. Consider adding browser build (if needed)

---

## Summary

The `apdu` library is a focused, useful utility for smart card development but has not been updated in nearly 4 years. The most urgent issue is the deprecated `Buffer()` constructor which will cause warnings for all users. Beyond that, adopting modern tooling (ESM, TypeScript, Vitest, ESLint) would bring the library up to 2025 standards and make it more maintainable.

The recommended minimal viable update would be:

1. Fix the Buffer deprecation
2. Add a proper README
3. Add basic tests
4. Update to latest Babel or switch to native ESM
5. Add ESLint to catch future issues

This would address the critical issues and put the library on a solid foundation for future development.
