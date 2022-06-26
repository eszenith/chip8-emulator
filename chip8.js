"use strict";

//string of hex values 
let memory = new Array(4095);

function toHex(no) {
    return "0x" + no.toString(16);
}

function toInt(no) {
    return parseInt(no, 16);
}

let fonts = [
    "0xF0", "0x90", "0x90", "0x90", "0xF0", // 0
    "0x20", "0x60", "0x20", "0x20", "0x70", // 1
    "0xF0", "0x10", "0xF0", "0x80", "0xF0", // 2
    "0xF0", "0x10", "0xF0", "0x10", "0xF0", // 3
    "0x90", "0x90", "0xF0", "0x10", "0x10", // 4
    "0xF0", "0x80", "0xF0", "0x10", "0xF0", // 5
    "0xF0", "0x80", "0xF0", "0x90", "0xF0", // 6
    "0xF0", "0x10", "0x20", "0x40", "0x40", // 7
    "0xF0", "0x90", "0xF0", "0x90", "0xF0", // 8
    "0xF0", "0x90", "0xF0", "0x10", "0xF0", // 9
    "0xF0", "0x90", "0xF0", "0x90", "0x90", // A
    "0xE0", "0x90", "0xE0", "0x90", "0xE0", // B
    "0xF0", "0x80", "0x80", "0x80", "0xF0", // C
    "0xE0", "0x90", "0x90", "0x90", "0xE0", // D
    "0xF0", "0x80", "0xF0", "0x80", "0xF0", // E
    "0xF0", "0x80", "0xF0", "0x80", "0x80"  // F
]

let fontStart = toInt("0x050");
let fontEnd = toInt("0x09F");
for (let i = fontStart, j = 0; i < fontEnd; i++, j++) {
    memory[i] = fonts[j];
}
//console.log(memory[toInt("0x050")]+"  "+toInt("0x050").toString());

let pc = "0x00";
let ir = '0'.repeat(16);
let sp = '0'.repeat(8);
let dt = '0'.repeat(8);
let st = '0'.repeat(8);
let registers = {};

for (let i = 0; i <= 15; i++) {
    registers['V' + toHex(i).slice(2)] = '0'.repeat(8);
}
console.log(registers);







/*
let fonts = {
    '0' : ["0xF0", "0x90", "0x90", "0x90", "0xF0"], // 0
    '1' : ["0x20", "0x60", "0x20", "0x20", "0x70"], // 1
    '2' : ["0xF0", "0x10", "0xF0", "0x80", "0xF0"], // 2
    '3' : ["0xF0", "0x10", "0xF0", "0x10", "0xF0"], // 3
    '4' : ["0x90", "0x90", "0xF0", "0x10", "0x10"], // 4
    '5' : ["0xF0", "0x80", "0xF0", "0x10", "0xF0"], // 5
    '6' : ["0xF0", "0x80", "0xF0", "0x90", "0xF0"], // 6
    '7' : ["0xF0", "0x10", "0x20", "0x40", "0x40"], // 7
    '8' : ["0xF0", "0x90", "0xF0", "0x90", "0xF0"], // 8
    '9' : ["0xF0", "0x90", "0xF0", "0x10", "0xF0"], // 9
    'A' : ["0xF0", "0x90", "0xF0", "0x90", "0x90"], // A
    'B' : ["0xE0", "0x90", "0xE0", "0x90", "0xE0"], // B
    'C' : ["0xF0", "0x80", "0x80", "0x80", "0xF0"], // C
    'D' : ["0xE0", "0x90", "0x90", "0x90", "0xE0"], // D
    'E' : ["0xF0", "0x80", "0xF0", "0x80", "0xF0"], // E
    'F' : ["0xF0", "0x80", "0xF0", "0x80", "0x80"]  // F
}*/