"use strict";
/* initializations */
//memory stores everything as 8 bit integers
let memory = new Array(4096);
//stack also stores integers, it only used for storing the program counter 
let stack = new Array(256);

//these registers use integer values
let pc = 0;
let ir = 0;
let sp = -1;
let dt = 0;
let st = 0;

// all Vx registers have value in bit strings
let registers = {};
//fonts to store in memory
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
];




/*  functions */
function toHex(no) {
    return no.toString(16);
}

function toInt(no) {
    return parseInt(no, 16);
}

function setAllRegisters(value) {
    for (let i = 0; i <= 15; i++) {
        registers['V' + toHex(i)] = value;
    }
}

function SetAllMemory(value) {
    for(let i = 0; i<4096;i++) {
        memory[i] = value;
    }  
}

function clearOutMemoryRegToZero() {
    setAllRegisters(0);
    SetAllMemory(0);
}



/* start of emulation*/ 


clearOutMemoryRegToZero();

let fontStart = toInt("0x050");
let fontEnd = toInt("0x09F");

for (let i = fontStart, j = 0; i <= fontEnd; i++, j++) {
    memory[i] = toInt(fonts[j]);
    console.log("index at "+i+" font at : "+memory[i])
}





