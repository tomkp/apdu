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
      expect(apdu.size).toBe(4);
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
      expect(apdu.size).toBe(6);
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
      expect(apdu.size).toBe(16);
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
});
