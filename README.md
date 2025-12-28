# apdu

Lightweight Node.js library for constructing APDU (Application Protocol Data Unit) commands for smart card communication (ISO 7816-4).

## Installation

```bash
npm install apdu
```

## Usage

```javascript
import Apdu from 'apdu';

// Case 1: No data, no response expected (4 bytes)
const case1 = new Apdu({
  cla: 0x00,
  ins: 0xa4,
  p1: 0x04,
  p2: 0x00,
});
console.log(case1.toString()); // "00a40400"

// Case 4: SELECT command with data and response expected
const selectCommand = new Apdu({
  cla: 0x00,
  ins: 0xa4,
  p1: 0x04,
  p2: 0x00,
  data: [0xa0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10],
  le: 0x00, // Expect response (Le=0x00 means up to 256 bytes)
});
console.log(selectCommand.toString()); // "00a4040007a000000004101000"
console.log(selectCommand.toByteArray()); // Byte array
console.log(selectCommand.toBuffer()); // Node.js Buffer
```

## API

### `new Apdu(options)`

Creates a new APDU command.

| Option | Type     | Required | Description                                                        |
| ------ | -------- | -------- | ------------------------------------------------------------------ |
| `cla`  | number   | Yes      | Class byte (0x00-0xFF)                                             |
| `ins`  | number   | Yes      | Instruction byte (0x00-0xFF)                                       |
| `p1`   | number   | Yes      | Parameter 1 (0x00-0xFF)                                            |
| `p2`   | number   | Yes      | Parameter 2 (0x00-0xFF)                                            |
| `data` | number[] | No       | Command data bytes                                                 |
| `le`   | number   | No       | Expected response length (0x00-0xFF). Only included when provided. |

### Methods

#### `toString()`

Returns the APDU command as a lowercase hex string.

#### `toByteArray()`

Returns the APDU command as an array of bytes.

#### `toBuffer()`

Returns the APDU command as a Node.js Buffer.

## APDU Cases

The library correctly handles all four APDU cases defined in ISO 7816-4:

- **Case 1**: No data, no Le → `CLA INS P1 P2` (4 bytes)
- **Case 2**: No data, with Le → `CLA INS P1 P2 Le` (5 bytes)
- **Case 3**: With data, no Le → `CLA INS P1 P2 Lc Data`
- **Case 4**: With data, with Le → `CLA INS P1 P2 Lc Data Le`

**Note:** Le is only included in the output when explicitly provided. This ensures correct Case 1/3 handling where no response is expected.

## License

MIT
