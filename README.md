# apdu

Lightweight Node.js library for constructing APDU (Application Protocol Data Unit) commands for smart card communication (ISO 7816-4).

## Installation

```bash
npm install apdu
```

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

console.log(selectCommand.toString()); // "00a4040007a000000004101000"
console.log(selectCommand.toByteArray()); // Byte array
console.log(selectCommand.toBuffer()); // Node.js Buffer
```

## API

### `new Apdu(options)`

Creates a new APDU command.

| Option | Type     | Required | Description                         |
| ------ | -------- | -------- | ----------------------------------- |
| `cla`  | number   | Yes      | Class byte (0x00-0xFF)              |
| `ins`  | number   | Yes      | Instruction byte                    |
| `p1`   | number   | Yes      | Parameter 1                         |
| `p2`   | number   | Yes      | Parameter 2                         |
| `data` | number[] | No       | Command data bytes                  |
| `le`   | number   | No       | Expected response length            |
| `size` | number   | No       | Override automatic size calculation |

### Methods

#### `toString()`

Returns the APDU command as a lowercase hex string.

#### `toByteArray()`

Returns the APDU command as an array of bytes.

#### `toBuffer()`

Returns the APDU command as a Node.js Buffer.

## APDU Cases

The library automatically handles all four APDU cases defined in ISO 7816-4:

- **Case 1**: No data field, no response data expected (CLA INS P1 P2)
- **Case 2**: No data field, response data expected (CLA INS P1 P2 Le)
- **Case 3**: Data field present, no response data expected (CLA INS P1 P2 Lc Data)
- **Case 4**: Data field present, response data expected (CLA INS P1 P2 Lc Data Le)

## License

MIT
