'use strict';

import hexify from 'hexify';

function isValidByte(value) {
  return typeof value === 'number' && value >= 0 && value <= 255;
}

function Apdu(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('Options object is required');
  }

  const { cla, ins, p1, p2, data, le = 0, size } = obj;

  if (!isValidByte(cla)) {
    throw new RangeError('cla must be a byte value (0-255)');
  }
  if (!isValidByte(ins)) {
    throw new RangeError('ins must be a byte value (0-255)');
  }
  if (!isValidByte(p1)) {
    throw new RangeError('p1 must be a byte value (0-255)');
  }
  if (!isValidByte(p2)) {
    throw new RangeError('p2 must be a byte value (0-255)');
  }

  if (data !== undefined) {
    if (!Array.isArray(data)) {
      throw new TypeError('data must be an array of bytes');
    }
    if (data.some((b) => !isValidByte(b))) {
      throw new RangeError('All data values must be bytes (0-255)');
    }
  }

  this.size = size;
  this.cla = cla;
  this.ins = ins;
  this.p1 = p1;
  this.p2 = p2;
  this.data = data;
  this.le = le;

  // Case 1: No data, no Le
  if (!this.size && !this.data && !this.le) {
    this.size = 4;
  }
  // Case 2: No data, with Le
  else if (!this.size && !this.data) {
    this.size = 4 + 2;
  }
  // Case 3: With data, no Le
  else if (!this.size && !this.le) {
    this.size = this.data.length + 5 + 4;
  }
  // Case 4: With data and Le
  else if (!this.size) {
    this.size = this.data.length + 5 + 4;
  }

  if (this.data) {
    this.lc = this.data.length;
  }

  this.bytes = [];
  this.bytes.push(this.cla);
  this.bytes.push(this.ins);
  this.bytes.push(this.p1);
  this.bytes.push(this.p2);

  if (this.data) {
    this.bytes.push(this.lc);
    this.bytes = this.bytes.concat(this.data);
  }
  this.bytes.push(this.le);
}

Apdu.prototype.toString = function () {
  return hexify.toHexString(this.bytes);
};

Apdu.prototype.toByteArray = function () {
  return this.bytes;
};

Apdu.prototype.toBuffer = function () {
  return Buffer.from(this.bytes);
};

export default Apdu;
