//fde = fetch decode execute

let instructionPerSecond = 10000;
let fdeIntervalID;
let soundDelayID;
let debugFlag = 1;
let debugStopFlag = 0;

// this code records all key down at the moment, used for some instruction later
let someKeyIsDown = 0;
let keyDownDict = {};

function debugPrint(...args) {
    if (debugFlag === 1) {
        let str = '';
        //need to take arbitary strings in args and then combine and then print them 
        for (let arg of args) {
            str += arg
        }
        console.log(str)
    }
}

function debugPrintRegister() {
    for(let reg in registers) {
        debugPrint(`${reg} : ${binToInt(registers[reg])}`)
    }
}

//how to implement key listeners ? should store info of all keys pressed till now like below
// or store only the latest key

// document.addEventListener('keydown', function (event) {
//     someKeyIsDown = 1;
//     keyDownDict[event.code] = 1;
// });
// document.addEventListener('keyup', function (event) {
//     if (event.code in keyDownDict) {
//         delete keyDownDict[event.code];
//     }
//     if (Object.keys(keyDownDict).length === 0) {
//         someKeyIsDown = 0;
//     }

// });

//implementation for storing only one key and block until that key is no longer pressed
document.addEventListener('keydown', function (event) {

    //for debugging 
    
    if (event.code === "KeyC") {
        debugStopFlag = 0;
    }
    
    console.log("some key pressed");
    if (Object.keys(keyDownDict).length === 0) {
        //check: convert array search to hashmap
        if (event.code in {"Digit1" : 1,"Digit2" : 1,"Digit3" : 1,"KeyQ" : 1, "KeyW" : 1, "KeyE" : 1, "KeyA" : 1, "KeyS" : 1, "KeyD" : 1}) {
            console.log("dict updated with key pressed");
            someKeyIsDown = 1;
            keyDownDict[event.code] = 1;
        }
        
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code in keyDownDict) {
        delete keyDownDict[event.code];
    }
    if (Object.keys(keyDownDict).length === 0) {
        someKeyIsDown = 0;
    }

});

function twoCompelment(bin) {
    bin = ("00000000" + bin).substr(-8);
    let twoCompBin = "";
    let flag = 0;
    for (let i = bin.length - 1; i >= 0; i--) {
        if (flag === 1) {
            if (bin[i] === "0")
                twoCompBin += "1";
            else
                twoCompBin += "0";
        }
        else {
            twoCompBin += bin[i];
        }
        if ((flag === 0) && (bin[i] === "1"))
            flag = 1;
    }
    return twoCompBin.split("").reverse().join("");
}

//-----
function intToBin(inte) {
    //return inte.toString(2);
    let bin;
    try {
        bin = inte.toString(2);

        if (inte >= 0)
            return ("00000000" + bin).substr(-8);

        bin = bin.slice(1);
    }
    catch (err) {
        console.log("-----err start-----");
        console.log(err);
        console.log(bin);
        console.log("--------------");
    }


    //if negative binary returns the 2's complement of binary
    return twoCompelment(bin);
    //return "1"+("00000000" + bin).substr(-7);
}

function binToInt(bin) {
    return parseInt(bin, 2);
}

function hex2bin(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

function bin2hex(bin) {
    return parseInt(bin, 2).toString(16);
}

function incremenetPC() {
    pc += 1;
}

function loadProgramToMemory(view8bit) {
    let i = toInt("0x200");
    console.log("memory contents : ")
    for (let byte of view8bit) {
        memory[i] = byte;
        i++;
    }
}

function SeperateBits(instruction) {
    this.opcode = instruction.slice(0, 4);
    this.X = instruction.slice(4, 8);
    this.Y = instruction.slice(8, 12);
    this.N = instruction.slice(12);
    this.NN = instruction.slice(8);
    this.NNN = instruction.slice(4);

}

document.getElementById('inputfile')
    .addEventListener('change', function () {

        var fr = new FileReader();
        fr.onload = function () {
            let view = new Uint8Array(fr.result);
            loadProgramToMemory(view);
            //initialize pc, program counter

            pc = toInt("0x200");

            soundDelayID = setInterval(() => {
                if (dt > 0)
                    dt--;
                if (st > 0)
                    st--;
            }, 1000 / 60); //check time calculation

            fdeIntervalID = setInterval(() => {
                fdeCycle();

            }, 1000 / 400);


        }

        fr.readAsArrayBuffer(this.files[0]);
    });

document.getElementById('stop').addEventListener("click", function () {
    clearInterval(fdeIntervalID);
});

let keyDownInstFlag = 0;
let keyInstFlag0a = 0;

function fdeCycle() {

    let instruction = intToBin(memory[pc]) + intToBin(memory[pc + 1]);
    
    if(debugFlag === 1)
        debugStopFlag = 1;

    pc += 2

    //let instruction = memory[toInt(pc)].slice(2)+memory[toInt(pc)+1].slice(2);

    bitInfo = new SeperateBits(instruction);


    function checkInputDown(keyValueInReg) {

        if ('Digit1' in keyDownDict && keyValueInReg === "0") {
            return '0';
        }
        if ('Digit2' in keyDownDict && keyValueInReg === "1") {
            return '1';
        }
        if ('Digit3' in keyDownDict && keyValueInReg === "2") {
            return '2';
        }
        if ('Digit4' in keyDownDict && keyValueInReg === "3") {
            return '3';
        }
        if ('KeyQ' in keyDownDict && keyValueInReg === "4") {
            return '4';
        }
        if ('KeyW' in keyDownDict && keyValueInReg === "5") {
            return '5';
        }
        if ('KeyE' in keyDownDict && keyValueInReg === "6") {
            return '6';
        }
        if ('KeyR' in keyDownDict && keyValueInReg === "7") {
            return '7';
        }
        if ('KeyA' in keyDownDict && keyValueInReg === "8") {
            return '8';
        }
        if ('KeyS' in keyDownDict && keyValueInReg === "9") {
            return '9';
        }
        if ('KeyD' in keyDownDict && keyValueInReg === "a") {
            return 'a';
        }
        if ('KeyF' in keyDownDict && keyValueInReg === "b") {
            return 'b';
        }
        if ('KeyZ' in keyDownDict && keyValueInReg === "c") {
            return 'c';
        }
        if ('KeyX' in keyDownDict && keyValueInReg === "d") {
            return 'd';
        }
        if ('KeyC' in keyDownDict && keyValueInReg === "e") {
            return 'e';
        }
        if ('KeyV' in keyDownDict && keyValueInReg === "f") {
            return 'f';
        }

        return '';
    }

    function getKeyDown() {

        if ('Digit1' in keyDownDict) {
            return '0';
        }
        if ('Digit2' in keyDownDict) {
            return '1';
        }
        if ('Digit3' in keyDownDict) {
            return '2';
        }
        if ('Digit4' in keyDownDict) {
            return '3';
        }
        if ('KeyQ' in keyDownDict) {
            return '4';
        }
        if ('KeyW' in keyDownDict) {
            return '5';
        }
        if ('KeyE' in keyDownDict) {
            return '6';
        }
        if ('KeyR' in keyDownDict) {
            return '7';
        }
        if ('KeyA' in keyDownDict) {
            return '8';
        }
        if ('KeyS' in keyDownDict) {
            return '9';
        }
        if ('KeyD' in keyDownDict) {
            return 'a';
        }
        if ('KeyF' in keyDownDict) {
            return 'b';
        }
        if ('KeyZ' in keyDownDict) {
            return 'c';
        }
        if ('KeyX' in keyDownDict) {
            return 'd';
        }
        if ('KeyC' in keyDownDict) {
            return 'e';
        }
        if ('KeyV' in keyDownDict) {
            return 'f';
        }

        return '';
    }
    //------

    switch (bin2hex(bitInfo.opcode)) {
        case '0':
            if (bin2hex(bitInfo.X) + bin2hex(bitInfo.NN) === "0e0") {
                debugPrint("opcode 0e0 ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN));
                for (let i = 0; i < displayHeight; i++) {
                    for (let j = 0; j < displayWidth; j++) {
                        clearPixel(i, j);
                    }
                }
            }
            else if (bin2hex(bitInfo.X) + bin2hex(bitInfo.NN) === "0ee") {
                
                if (stack.length !== 0)
                    pc = stack.pop();
                else
                    console.log("stack:  underflow")
                debugPrint("opcode 0ee ", " X : ", binToInt(bitInfo.X), " PC : ", pc, "stack ", JSON.stringify(stack.slice(Math.max(stack.length - 5, 1))));
            }
            break;
        case '1':
            pc = binToInt(bitInfo.NNN);
            debugPrint("opcode 1nnn ", " NNN : ", binToInt(bitInfo.NNN), " pc : ", pc);
            break;

        case '2':
            stack.push(pc);
            pc = binToInt(bitInfo.NNN);
            debugPrint("opcode 1nnn ", " NNN : ", binToInt(bitInfo.NNN), " pc : ", pc, "stack ", JSON.stringify(stack.slice(Math.max(stack.length - 5, 1))));
            break;

        case '3':
            // console.log("register : "+registers["V" + bin2hex(bitInfo.X)]);
            // console.log(bitInfo.NN);
            // console.log(registers["V" + bin2hex(bitInfo.X)] === bitInfo.NN);
            //checkCode: how are values stored in registers
            debugPrint("opcode 3XNN  ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN));
            if (registers["V" + bin2hex(bitInfo.X)] === bitInfo.NN) {
                pc += 2;
                debugPrint("opcode 3XNN skip since X === NN, pc : ", pc);
            }
            break;
        case '4':
            debugPrint("opcode 4XNN  ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN));
            if (registers["V" + bin2hex(bitInfo.X)] !== bitInfo.NN) {
                pc += 2;
                debugPrint("opcode 4XNN skip since X !== NN, pc : ", pc);
            }
        case '5':
            debugPrint("opcode 5XY0  ", " X : ", binToInt(bitInfo.X), " Y : ", binToInt(bitInfo.Y));
            if (registers["V" + bin2hex(bitInfo.X)] === registers["V" + bin2hex(bitInfo.Y)]) {
                pc += 2;
                debugPrint("opcode 5XY0 skip since X === Y, pc : ", pc);
            }
            break;

        case '6':
            
            registers["V" + bin2hex(bitInfo.X)] = bitInfo.NN;
            debugPrint("opcode 6XNN  ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN),"  V" + bin2hex(bitInfo.X)," : ", binToInt(registers["V" + bin2hex(bitInfo.X)]));
            break;

        case '7':
            // console.log("instruction 7 : ");
            let generalRegister = "V" + bin2hex(bitInfo.X);
            let currentVxValue = binToInt(registers[generalRegister]);

            // console.log("x curr value bin : "+registers["V" + bin2hex(bitInfo.X)]+" converted :  "+currentVxValue);
            // console.log("NN value bin : "+bitInfo.NN+" converted : "+binToInt(bitInfo.NN));
            debugPrint("opcode 7XNN  before addition : ", generalRegister," : ", binToInt(registers[generalRegister]));
            //check: adding may lead to overflow
            registers[generalRegister] = intToBin(currentVxValue + binToInt(bitInfo.NN));

            if (registers[generalRegister].length > 8) {
                registers[generalRegister] = registers[generalRegister].slice(registers[generalRegister].length - 8);
                registers["Vf"] = intToBin(1);
            }
            debugPrint("opcode 7XNN  ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN), "  ", generalRegister + " : ", binToInt(registers[generalRegister]), "  VF : ", binToInt(registers['Vf']));
            break;

        case '8':
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            let generalRegister2 = "V" + bin2hex(bitInfo.Y);
            switch (bin2hex(bitInfo.N)) {
                case '0':
                    registers[generalRegister1] = registers[generalRegister2];
                    debugPrint("8xy0 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));
                    break;
                case '1':
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) | binToInt(registers[generalRegister2]));
                    debugPrint("8xy1 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));

                    break;
                case '2':
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) & binToInt(registers[generalRegister2]));
                    debugPrint("8xy2 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));

                    break;
                case '3':
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) ^ binToInt(registers[generalRegister2]));
                    debugPrint("8xy3 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));

                    break;
                case '4':
                    debugPrint("before add 8xy0 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) + binToInt(registers[generalRegister2]));
                    if (registers[generalRegister1].length > 8) {
                        registers[generalRegister1] = registers[generalRegister1].slice(registers[generalRegister1].length - 8);
                        registers["Vf"] = intToBin(1);
                    }
                    debugPrint("8xy0 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "Vf", binToInt(registers['Vf']));

                    break;
                case '5':
                case '7':
                    let minuend;
                    let subtrahend;

                    debugPrint("before sub 8xy5 or 777 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));

                    if (bin2hex(bitInfo.N) === '5') {
                        minuend = binToInt(registers[generalRegister1]);
                        subtrahend = binToInt(registers[generalRegister2]);
                    }
                    else {
                        minuend = binToInt(registers[generalRegister2]);
                        subtrahend = binToInt(registers[generalRegister1]);
                    }

                    console.log("min : " + minuend);
                    console.log("sub : " + subtrahend);
                    registers[generalRegister1] = intToBin(minuend - subtrahend);
                    console.log(binToInt(registers[generalRegister1]) + "  " + intToBin(minuend - subtrahend));
                    if (minuend > subtrahend) {
                        registers["Vf"] = intToBin(1);
                    }
                    else {
                        registers["Vf"] = intToBin(0);
                    }
                    debugPrint("8xy5 or 777 : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "Vf", binToInt(registers['Vf']));

                    break;
                case '6':
                case 'e':
                    //registers[generalRegister1] = registers[generalRegister2];

                    debugPrint("8xy6 or eee: ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));

                    if (bin2hex(bitInfo.N) === '6') {
                        //check if possible for register to be not 8 bits
                        debugPrint("instr 6")
                        registers["Vf"] = registers[generalRegister1][7];
                        registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) >>> 1);
                    }
                    else {
                        debugPrint("instr e")
                        registers["Vf"] = registers[generalRegister1][0];
                        registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) << 1);
                    }
                    debugPrint("8xy6 or eee : ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "Vf", binToInt(registers['Vf']));

                    break;
            }
            break;
        case '9':
            {
                let generalRegister1 = "V" + bin2hex(bitInfo.X);
                let generalRegister2 = "V" + bin2hex(bitInfo.Y);

                debugPrint("9xy0 ", generalRegister1 + " : ", binToInt(registers[generalRegister1]), "  ", generalRegister2 + " : ", binToInt(registers[generalRegister2]));

                if (registers[generalRegister1] !== registers[generalRegister2]) {
                    pc += 2;
                }
                break;
            }

        case 'a':

            ir = binToInt(bitInfo.NNN);
            debugPrint("Annn : NNN : ", binToInt(bitInfo.NNN), "IR : ", ir);
            break;

        case 'b':
            //check : did not check for overflow
            pc = binToInt(bitInfo.NNN) + binToInt(registers["V0"]);
            debugPrint("Bnnn : NNN : ", binToInt(bitInfo.NNN), "PC : ", pc);
            break;

        case 'c':

            let randomNumber = Math.floor(Math.random() * 256);
            registers["V" + bin2hex(bitInfo.X)] = intToBin(randomNumber & binToInt(bitInfo.NN));
            debugPrint("CXNN : NN : ", binToInt(bitInfo.NN), "V" + bin2hex(bitInfo.X), " : ", binToInt(registers["V" + bin2hex(bitInfo.X)]), " random : ", randomNumber);
            break;

        case 'd': {
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            let generalRegister2 = "V" + bin2hex(bitInfo.Y);
            let xCoord = binToInt(registers[generalRegister1]) % (displayWidth);
            let yCoord = binToInt(registers[generalRegister2]) % (displayHeight);
            registers["Vf"] = intToBin(0);
            debugPrint("draw : integer in register (" + binToInt(registers[generalRegister1]) + " , " + binToInt(registers[generalRegister2]))
            debugPrint(" draw instructions: (" + xCoord + " , " + yCoord + ")")
            //from memory access the sprite starting from the index register 

            let spriteIndex = ir;
            let limit = spriteIndex + binToInt(bitInfo.N);

            for (; spriteIndex < limit; spriteIndex++) {
                let xCoordIter = xCoord;
                let spriteRow = intToBin(memory[spriteIndex]);
                for (let j = 0; j < 8; j++) {
                    if (spriteRow[j] === '1') {
                        if (getPixel(yCoord, xCoordIter))
                            registers["Vf"] = intToBin(1);

                        togglePixel(yCoord, xCoordIter);
                    }
                    xCoordIter++;
                }
                yCoord++;
            }
            break;
        }
        case 'e': {
            let val = bin2hex(registers['V' + bin2hex(bitInfo.X)]);
            //console.log("e instrction val  : "+val+" typeof val : "+typeof(val));

            if (bin2hex(bitInfo.NN) === "9e") {
                debugPrint("ex9e :  X : ", bin2hex(registers['V' + bin2hex(bitInfo.X)]));
                if (someKeyIsDown === 1) {
                    console.log("somekey is down instruction e92 : " + JSON.stringify(keyDownDict));
                    if (checkInputDown(val)) {
                        pc += 2;
                    }
                }
            }

            else if (bin2hex(bitInfo.NN) === "a1") {
                debugPrint("exa1 :  X : ", bin2hex(registers['V' + bin2hex(bitInfo.X)]));
                if (someKeyIsDown === 1) {
                    console.log("somekey is down instruction ea1 : " + JSON.stringify(keyDownDict));
                    if (!checkInputDown(val)) {
                        pc += 2;
                    }
                }
            }
            break;
        }
        case 'f': {
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            // limit for 55 and 65 instruction
            //let limit = binToInt(registers[generalRegister1]) + 1;
            let limit = binToInt(bitInfo.X) + 1;

            switch (bin2hex(bitInfo.NN)) {
                case "7":
                    registers[generalRegister1] = intToBin(dt);
                    debugPrint("fx07  : ", generalRegister1, " : ", binToInt(registers[generalRegister1]), " DT : ", dt);
                    break;
                case "15":
                    dt = binToInt(registers[generalRegister1]);
                    debugPrint("fx15  : ", generalRegister1, " : ", binToInt(registers[generalRegister1]), " DT : ", dt);
                    break;
                case "18":
                    st = binToInt(registers[generalRegister1]);
                    debugPrint("fx18  : ", generalRegister1, " : ", binToInt(registers[generalRegister1]), " ST : ", st);
                    break;
                case "1e":
                    ir += binToInt(registers[generalRegister1]);
                    debugPrint("fx1e  : ", generalRegister1, " : ", binToInt(registers[generalRegister1]), " ir : ", ir);
                    break;
                case "a":
                    //do not move pc to until some key pressed
                    pc -= 2;
                    debugPrint("input fx0a  ");
                    if (someKeyIsDown === 1) {
                        
                        registers[generalRegister1] = hex2bin(getKeyDown());
                        debugPrint("fx0a someKey is down   key :", binToInt(registers[generalRegister1]));
                        //move program counter to next instruction sicne some key was pressed
                        pc +=2;
                    }
                    break;
                case "29":
                    //check how are values stored in registers
                    ir = 80 + binToInt(registers[generalRegister1]) * 5;
                    debugPrint("fx29   X : ", binToInt(registers[generalRegister1]) , " ir :  ", ir);
                    break;
                case "33":
                    let no = binToInt(registers[generalRegister1]).toString();
                    no = "0".repeat(3 - no.length) + no;
                    memory[ir] = parseInt(no[0]);
                    memory[ir + 1] = parseInt(no[1]);
                    memory[ir + 2] = parseInt(no[2]);
                    debugPrint("fx33 to store : ", no, " m[ir] : ", memory[ir], " m[ir+1] : ", memory[ir+1], " m[ir+2] : ", memory[ir+2])
                    break;
                case "55":
                    debugPrint("fx55  ir : ", ir, " till VX : ", binToInt(bitInfo.X));
                    for (let i = 0; i < limit; i++)
                        memory[ir + i] = binToInt(registers['V' + toHex(i)]);
                    break;
                case "65":
                    debugPrint("fx65  ir : ", ir, " till VX : ", binToInt(bitInfo.X));
                    for (let i = 0; i < limit; i++)
                    {
                        debugPrint("Accessing :  ir+i : ", (ir+i), " memory[ir + i] : ", memory[ir + i]);
                        registers['V' + toHex(i)] = intToBin(memory[ir + i]);
                    }
                        
                    
                    break;
            }
            break;
        }
    }

    //debugger
}