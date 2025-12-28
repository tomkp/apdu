'use strict';

import hexify from 'hexify';


function Apdu(obj) {

    this.size = obj.size;
    this.cla = obj.cla;
    this.ins = obj.ins;
    this.p1 = obj.p1;
    this.p2 = obj.p2;
    this.data = obj.data;
    this.le = obj.le || 0;

    // case 1
    if (!this.size && !this.data && !this.le) {
        //this.le = -1;
        //console.info('case 1');
        this.size = 4;
    }
    // case 2
    else if (!this.size && !this.data) {
        //console.info('case 2');
        this.size = 4 + 2;
    }

    // case 3
    else if (!this.size && !this.le) {
        //console.info('case 3');
        this.size = this.data.length + 5 + 4;
        //this.le = -1;
    }

    // case 4
    else if (!this.size) {
        //console.info('case 4');
        this.size = this.data.length + 5 + 4;
    }

    // set data
    if (this.data) {
        this.lc = this.data.length;
    } else {
        //this.lc = 0;
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

Apdu.prototype.toString = function() {
    return hexify.toHexString(this.bytes);
};

Apdu.prototype.toByteArray = function() {
    return this.bytes;
};

Apdu.prototype.toBuffer = function() {
    return Buffer.from(this.bytes);
};

module.exports = Apdu;
