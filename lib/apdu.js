function isValidByte(value) {
    return typeof value === 'number' && value >= 0 && value <= 255;
}
class Apdu {
    /** Class byte */
    cla;
    /** Instruction byte */
    ins;
    /** Parameter 1 */
    p1;
    /** Parameter 2 */
    p2;
    /** Command data bytes */
    data;
    /** Expected response length */
    le;
    /** Length of command data (Lc) */
    lc;
    /** Raw byte array of the APDU command */
    bytes;
    constructor(options) {
        if (!options || typeof options !== 'object') {
            throw new TypeError('Options object is required');
        }
        const { cla, ins, p1, p2, data, le = 0 } = options;
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
        this.cla = cla;
        this.ins = ins;
        this.p1 = p1;
        this.p2 = p2;
        this.data = data;
        this.le = le;
        if (this.data) {
            this.lc = this.data.length;
        }
        this.bytes = [this.cla, this.ins, this.p1, this.p2];
        if (this.data) {
            this.bytes.push(this.lc);
            this.bytes = this.bytes.concat(this.data);
        }
        this.bytes.push(this.le);
    }
    /**
     * Returns the APDU command as a lowercase hex string
     */
    toString() {
        return this.bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    /**
     * Returns the APDU command as an array of bytes
     */
    toByteArray() {
        return [...this.bytes];
    }
    /**
     * Returns the APDU command as a Node.js Buffer
     */
    toBuffer() {
        return Buffer.from(this.bytes);
    }
}
export default Apdu;
export { Apdu };
//# sourceMappingURL=apdu.js.map