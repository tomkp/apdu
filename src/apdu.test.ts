import { describe, it, expect } from 'vitest';
import Apdu from './apdu.js';

describe('Apdu', () => {
  describe('constructor', () => {
    it('should construct a basic APDU command (case 1 - no data, no le)', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
      });

      expect(apdu.cla).toBe(0x00);
      expect(apdu.ins).toBe(0xa4);
      expect(apdu.p1).toBe(0x04);
      expect(apdu.p2).toBe(0x00);
      expect(apdu.le).toBe(0);
    });

    it('should construct case 2 APDU (no data, with non-zero le)', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xca,
        p1: 0x00,
        p2: 0x00,
        le: 0x10,
      });

      expect(apdu.le).toBe(0x10);
      expect(apdu.toByteArray()).toEqual([0x00, 0xca, 0x00, 0x00, 0x10]);
    });

    it('should construct case 3 APDU (with data, no le)', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
        data: [0xa0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10],
      });

      expect(apdu.data).toEqual([0xa0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10]);
      expect(apdu.lc).toBe(7);
    });

    it('should construct case 4 APDU (with data and le)', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
        data: [0xa0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10],
        le: 0x00,
      });

      expect(apdu.data).toEqual([0xa0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10]);
      expect(apdu.lc).toBe(7);
      expect(apdu.le).toBe(0x00);
    });
  });

  describe('toString', () => {
    it('should return hex string representation', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
      });

      expect(apdu.toString()).toBe('00a4040000');
    });

    it('should return hex string with data', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
        data: [0xa0, 0x00],
        le: 0x00,
      });

      expect(apdu.toString()).toBe('00a4040002a00000');
    });
  });

  describe('toByteArray', () => {
    it('should return byte array', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
      });

      expect(apdu.toByteArray()).toEqual([0x00, 0xa4, 0x04, 0x00, 0x00]);
    });

    it('should return byte array with data', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
        data: [0x01, 0x02],
        le: 0x00,
      });

      expect(apdu.toByteArray()).toEqual([
        0x00, 0xa4, 0x04, 0x00, 0x02, 0x01, 0x02, 0x00,
      ]);
    });
  });

  describe('toBuffer', () => {
    it('should return a Buffer', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
      });

      const buffer = apdu.toBuffer();
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer).toEqual(Buffer.from([0x00, 0xa4, 0x04, 0x00, 0x00]));
    });
  });

  describe('immutability', () => {
    it('should not allow mutation of internal state via toByteArray', () => {
      const apdu = new Apdu({
        cla: 0x00,
        ins: 0xa4,
        p1: 0x04,
        p2: 0x00,
      });

      const bytes1 = apdu.toByteArray();
      bytes1[0] = 0xff; // Mutate the returned array

      const bytes2 = apdu.toByteArray();
      expect(bytes2[0]).toBe(0x00); // Internal state should be unchanged
    });
  });

  describe('validation', () => {
    it('should throw TypeError if options is not an object', () => {
      // @ts-expect-error Testing invalid input
      expect(() => new Apdu()).toThrow(TypeError);
      // @ts-expect-error Testing invalid input
      expect(() => new Apdu(null)).toThrow(TypeError);
      // @ts-expect-error Testing invalid input
      expect(() => new Apdu('string')).toThrow(TypeError);
    });

    it('should throw RangeError if cla is out of range', () => {
      expect(() => new Apdu({ cla: -1, ins: 0xa4, p1: 0, p2: 0 })).toThrow(
        RangeError
      );
      expect(() => new Apdu({ cla: 256, ins: 0xa4, p1: 0, p2: 0 })).toThrow(
        RangeError
      );
    });

    it('should throw RangeError if ins is out of range', () => {
      expect(() => new Apdu({ cla: 0, ins: -1, p1: 0, p2: 0 })).toThrow(
        RangeError
      );
      expect(() => new Apdu({ cla: 0, ins: 256, p1: 0, p2: 0 })).toThrow(
        RangeError
      );
    });

    it('should throw RangeError if p1 is out of range', () => {
      expect(() => new Apdu({ cla: 0, ins: 0xa4, p1: -1, p2: 0 })).toThrow(
        RangeError
      );
      expect(() => new Apdu({ cla: 0, ins: 0xa4, p1: 256, p2: 0 })).toThrow(
        RangeError
      );
    });

    it('should throw RangeError if p2 is out of range', () => {
      expect(() => new Apdu({ cla: 0, ins: 0xa4, p1: 0, p2: -1 })).toThrow(
        RangeError
      );
      expect(() => new Apdu({ cla: 0, ins: 0xa4, p1: 0, p2: 256 })).toThrow(
        RangeError
      );
    });

    it('should throw TypeError if data is not an array', () => {
      expect(
        // @ts-expect-error Testing invalid input
        () => new Apdu({ cla: 0, ins: 0xa4, p1: 0, p2: 0, data: 'string' })
      ).toThrow(TypeError);
    });

    it('should throw RangeError if data contains invalid byte values', () => {
      expect(
        () => new Apdu({ cla: 0, ins: 0xa4, p1: 0, p2: 0, data: [256] })
      ).toThrow(RangeError);
      expect(
        () => new Apdu({ cla: 0, ins: 0xa4, p1: 0, p2: 0, data: [-1] })
      ).toThrow(RangeError);
    });
  });
});
