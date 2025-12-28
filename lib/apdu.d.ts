export interface ApduOptions {
    /** Class byte (0x00-0xFF) */
    cla: number;
    /** Instruction byte */
    ins: number;
    /** Parameter 1 */
    p1: number;
    /** Parameter 2 */
    p2: number;
    /** Command data bytes */
    data?: number[];
    /** Expected response length */
    le?: number;
}
declare class Apdu {
    /** Class byte */
    readonly cla: number;
    /** Instruction byte */
    readonly ins: number;
    /** Parameter 1 */
    readonly p1: number;
    /** Parameter 2 */
    readonly p2: number;
    /** Command data bytes */
    readonly data?: number[];
    /** Expected response length */
    readonly le: number;
    /** Length of command data (Lc) */
    readonly lc?: number;
    /** Raw byte array of the APDU command */
    private readonly bytes;
    constructor(options: ApduOptions);
    /**
     * Returns the APDU command as a lowercase hex string
     */
    toString(): string;
    /**
     * Returns the APDU command as an array of bytes
     */
    toByteArray(): number[];
    /**
     * Returns the APDU command as a Node.js Buffer
     */
    toBuffer(): Buffer;
}
export default Apdu;
export { Apdu };
//# sourceMappingURL=apdu.d.ts.map