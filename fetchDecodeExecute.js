//fde = fetch decode execute

let instructionPerSecond = 10000;
let fdeIntervalID;
let soundDelayID;
let debugFlag = 1;
let debugStopFlag = 0;

let input0aData = {
    instr0aFlag: 0,
    keyCode: [],
}
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
    for (let reg in registers) {
        debugPrint(`${reg} : ${registers[reg]}`)
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
        if (event.code in { "Digit1": 1, "Digit2": 1, "Digit3": 1, "Digit4": 1, "KeyQ": 1, "KeyW": 1, "KeyE": 1, "KeyR": 1, "KeyA": 1, "KeyS": 1, "KeyD": 1, "KeyF": 1, "KeyZ": 1, "KeyX": 1, "KeyC": 1, "KeyV": 1 }) {
            console.log("dict updated with key pressed");
            someKeyIsDown = 1;
            keyDownDict[event.code] = 1;
        }

    }
});

document.addEventListener('keyup', function (event) {
    if (event.code in keyDownDict) {
        //fxo0a instruction change flag to 1 now changing to 2, so, that execution continues after key press and release
        if (input0aData.instr0aFlag === 1)
            input0aData.instr0aFlag = 2;

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
    bin = inte.toString(2);

    if (inte >= 0)
        return ("00000000" + bin).substr(-8);

    bin = bin.slice(1);


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

function int2hex(no) {
    return no.toString(16);
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

    if (debugFlag === 1)
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

                if (sp >= 0) {
                    pc = stack[sp];
                    sp--;
                }
                else
                    throw new error("stack : underflow")
                debugPrint("stack : opcode 0ee ", " X : ", binToInt(bitInfo.X), " sp : ", sp, " PC : ", pc, "  stack ", JSON.stringify(stack.slice(Math.max(stack.length - 5, 1))));
            }
            break;
        case '1':
            pc = binToInt(bitInfo.NNN);
            debugPrint("opcode 1nnn ", " NNN : ", binToInt(bitInfo.NNN), " pc : ", pc);
            break;

        case '2':
            sp++;
            stack[sp] = pc;
            pc = binToInt(bitInfo.NNN);
            debugPrint(" stack : opcode 2nnn ", " NNN : ", binToInt(bitInfo.NNN), " sp : ", sp, " pc : ", pc, "  stack ", JSON.stringify(stack.slice(Math.max(stack.length - 5, 1))));
            break;

        case '3':
            // console.log("register : "+registers["V" + bin2hex(bitInfo.X)]);
            // console.log(bitInfo.NN);
            // console.log(registers["V" + bin2hex(bitInfo.X)] === bitInfo.NN);
            //checkCode: how are values stored in registers
            debugPrint("opcode 3XNN  ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN));

            if (intToBin(registers["V" + bin2hex(bitInfo.X)]) === bitInfo.NN) {
                pc += 2;
                debugPrint("opcode 3XNN skip since X === NN, pc : ", "V" + bin2hex(bitInfo.X), " : ", registers["V" + bin2hex(bitInfo.X)], " NN : ", bitInfo.NN);
            }
            break;
        case '4':
            debugPrint("opcode 4XNN  ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN));
            if (intToBin(registers["V" + bin2hex(bitInfo.X)]) !== bitInfo.NN) {
                pc += 2;
                debugPrint("opcode 4XNN skip since X !== NN, pc : ", pc, "V" + bin2hex(bitInfo.X), " : ", registers["V" + bin2hex(bitInfo.X)], " NN : ", bitInfo.NN);
            }
            break;
        case '5':
            debugPrint("opcode 5XY0  ", " X : ", binToInt(bitInfo.X), " Y : ", binToInt(bitInfo.Y));
            if (registers["V" + bin2hex(bitInfo.X)] === registers["V" + bin2hex(bitInfo.Y)]) {
                pc += 2;
                debugPrint("opcode 5XY0 skip since X === Y, pc : ", pc, "V" + bin2hex(bitInfo.X), " : ", registers["V" + bin2hex(bitInfo.X)], " NN : ", bitInfo.NN);
            }
            break;

        case '6':

            registers["V" + bin2hex(bitInfo.X)] = binToInt(bitInfo.NN);
            debugPrint("opcode 6XNN  ", " X : ", binToInt(bitInfo.X), " NN : ", binToInt(bitInfo.NN), "  V" + bin2hex(bitInfo.X), " : ", binToInt(registers["V" + bin2hex(bitInfo.X)]));
            break;

        case '7':
            // console.log("instruction 7 : ");
            let generalRegister = "V" + bin2hex(bitInfo.X);
            let currentVxValue = registers[generalRegister];

            // console.log("x curr value bin : "+registers["V" + bin2hex(bitInfo.X)]+" converted :  "+currentVxValue);
            // console.log("NN value bin : "+bitInfo.NN+" converted : "+binToInt(bitInfo.NN));
            debugPrint("opcode 7XNN  before addition : ", generalRegister, " : ", registers[generalRegister]);
            //check: adding may lead to overflow
            registers[generalRegister] = currentVxValue + parseInt(bitInfo.NN, 2);

            if (registers[generalRegister] > 255) {
                // circle back to 8 bit value if greater than 256
                registers[generalRegister] = registers[generalRegister] % 256;
                // no need to set VF registers["Vf"] = intToBin(1);
            }

            debugPrint("opcode 7XNN  ", " X : ", parseInt(bitInfo.X, 2), " NN : ", parseInt(bitInfo.NN, 2), "  ", generalRegister + " : ", registers[generalRegister], "  VF : ", registers['Vf']);
            break;

        case '8':
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            let generalRegister2 = "V" + bin2hex(bitInfo.Y);
            switch (bin2hex(bitInfo.N)) {
                case '0':
                    registers[generalRegister1] = registers[generalRegister2];
                    debugPrint("8xy0 : ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);
                    break;
                case '1':
                    registers[generalRegister1] = registers[generalRegister1] | registers[generalRegister2];
                    registers["Vf"] = 0;
                    debugPrint("8xy1 : ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);

                    break;
                case '2':
                    registers[generalRegister1] = registers[generalRegister1] & registers[generalRegister2];
                    registers["Vf"] = 0;
                    debugPrint("8xy2 : ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);

                    break;
                case '3':
                    registers[generalRegister1] = registers[generalRegister1] ^ registers[generalRegister2];
                    registers["Vf"] = 0;
                    debugPrint("8xy3 : ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);

                    break;
                case '4':
                    debugPrint("before add 8xy0 : ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);

                    registers[generalRegister1] = registers[generalRegister1] + registers[generalRegister2];

                    if (registers[generalRegister1] > 255) {
                        registers[generalRegister1] = registers[generalRegister1] % 256;
                        registers["Vf"] = 1;
                    }
                    debugPrint("8xy0 : ", generalRegister1 + " : ", registers[generalRegister1], "Vf", registers['Vf']);

                    break;
                case '5':
                case '7':
                    let minuend;
                    let subtrahend;

                    debugPrint("before sub 8xy5 or 777 : ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);

                    if (bin2hex(bitInfo.N) === '5') {
                        debugPrint("----------8xy5--------");
                        minuend = registers[generalRegister1];
                        subtrahend = registers[generalRegister2];
                    }
                    else {
                        debugPrint("----------8xy7--------");
                        minuend = registers[generalRegister2];
                        subtrahend = registers[generalRegister1];
                    }

                    //console.log("min : " + minuend);
                    //console.log("sub : " + subtrahend);
                    registers[generalRegister1] = minuend - subtrahend;
                    //console.log(registers[generalRegister1] + "  " + minuend - subtrahend);
                    if (minuend > subtrahend) {
                        registers["Vf"] = 1;
                    }
                    else {
                        registers["Vf"] = 0;
                    }
                    debugPrint("8xy5 or 777 : ", generalRegister1 + " : ", registers[generalRegister1], " Vf : ", registers['Vf']);

                    break;
                case '6':
                case 'e':
                    //registers[generalRegister1] = registers[generalRegister2];

                    debugPrint("8xy6 or eee: ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);

                    if (bin2hex(bitInfo.N) === '6') {
                        //check if possible for register to be not 8 bits
                        debugPrint("instr 6")

                        if (registers[generalRegister1] > 255) {
                            throw new Error("overflow");
                        }

                        registers["Vf"] = registers[generalRegister1] & 1;
                        registers[generalRegister1] = registers[generalRegister1] >> 1;
                    }
                    else {
                        debugPrint("8xye : ", registers[generalRegister1]);
                        registers["Vf"] = (registers[generalRegister1] & 128) >>> 7;
                        registers[generalRegister1] = (registers[generalRegister1] << 1) & 255;
                    }
                    debugPrint("8xy6 or 8xye : ", generalRegister1 + " : ", registers[generalRegister1], " Vf : ", registers['Vf']);

                    break;
            }
            break;
        case '9':
            {
                let generalRegister1 = "V" + bin2hex(bitInfo.X);
                let generalRegister2 = "V" + bin2hex(bitInfo.Y);

                debugPrint("9xy0 ", generalRegister1 + " : ", registers[generalRegister1], "  ", generalRegister2 + " : ", registers[generalRegister2]);

                if (registers[generalRegister1] !== registers[generalRegister2]) {
                    pc += 2;
                }
                break;
            }

        case 'a':
            ir = parseInt(bitInfo.NNN, 2);
            debugPrint("Annn : NNN : ", parseInt(bitInfo.NNN), "IR : ", ir);
            break;

        case 'b':
            //check : did not check for overflow
            // to circle back to memery needed modulus
            pc = (parseInt(bitInfo.NNN, 2) + registers["V0"]) % 4096;
            debugPrint("Bnnn : NNN : ", parseInt(bitInfo.NNN, 2), "PC : ", pc);
            break;

        case 'c':

            let randomNumber = Math.floor(Math.random() * 256);
            registers["V" + bin2hex(bitInfo.X)] = randomNumber & parseInt(bitInfo.NN, 2);
            debugPrint("CXNN : NN : ", parseInt(bitInfo.NN, 2), "V" + bin2hex(bitInfo.X), " : ", registers["V" + bin2hex(bitInfo.X)], " random : ", randomNumber);
            break;

        case 'd': {
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            let generalRegister2 = "V" + bin2hex(bitInfo.Y);
            let xCoord = registers[generalRegister1] % (displayWidth);
            let yCoord = registers[generalRegister2] % (displayHeight);
            registers["Vf"] = 0;
            debugPrint("draw : integer in register (" + registers[generalRegister1] + " , " + registers[generalRegister2]);
            debugPrint(" draw instructions: (" + xCoord + " , " + yCoord + ")");
            //from memory access the sprite starting from the index register 

            let spriteIndex = ir;
            let limit = spriteIndex + parseInt(bitInfo.N, 2);

            for (; spriteIndex < limit; spriteIndex++) {
                let xCoordIter = xCoord;
                let spriteRow = intToBin(memory[spriteIndex]);
                for (let j = 0; j < 8; j++) {
                    if (spriteRow[j] === '1') {
                        if (getPixel(yCoord, xCoordIter))
                            registers["Vf"] = 1;

                        togglePixel(yCoord, xCoordIter);
                    }
                    // do not need to draw if x-coordinate goes out of bounds while drawing (clip if out of bounds while incrementing)
                    if (xCoordIter < displayWidth-1)
                        xCoordIter++;
                    else
                        break;
                }
                // do not need to draw if y-coordinate goes out of bounds while drawing
                if(yCoord < displayHeight-1)
                    yCoord++;
                else 
                    break;
            }
            break;
        }
        case 'e': {
            let val = int2hex(registers['V' + bin2hex(bitInfo.X)]);
            //console.log("e instrction val  : "+val+" typeof val : "+typeof(val));

            if (bin2hex(bitInfo.NN) === "9e") {
                debugPrint("ex9e :  X : ", int2hex(registers['V' + bin2hex(bitInfo.X)]));
                if (someKeyIsDown === 1) {
                    console.log("somekey is down instruction 9e : " + JSON.stringify(keyDownDict));
                    if (checkInputDown(val)) {
                        pc += 2;
                    }
                }
            }

            //regarding this instruction, we have to skip next instruction if the key with same value as in Vx is not pressed
            // before only checking above condition if there was infact a key being pressed that is
            // if a key is pressed then check if it not same as vx if that is true then skip instruction
            // above condition misses the case if there is no key being pressed at all on keyboard 
            // which should lead to a skip of instruction but that was not happening in previous commits
            // below code correctly does waht exa1 is supposed to do probably 

            else if (bin2hex(bitInfo.NN) === "a1") {
                debugPrint("exa1 :  input in VX : ", int2hex(registers['V' + bin2hex(bitInfo.X)]));
                console.log("somekey is down instruction ea1 : " + JSON.stringify(keyDownDict));
                if (!checkInputDown(val)) {
                    pc += 2;
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
                    registers[generalRegister1] = dt;
                    debugPrint("fx07  : ", generalRegister1, " : ", registers[generalRegister1], " DT : ", dt);
                    break;
                case "15":
                    dt = registers[generalRegister1];
                    debugPrint("fx15  : ", generalRegister1, " : ", registers[generalRegister1], " DT : ", dt);
                    break;
                case "18":
                    st = registers[generalRegister1];
                    debugPrint("fx18  : ", generalRegister1, " : ", registers[generalRegister1], " ST : ", st);
                    break;
                case "1e":
                    ir += registers[generalRegister1];
                    debugPrint("fx1e  : ", generalRegister1, " : ", registers[generalRegister1], " ir : ", ir);
                    break;
                case "a":
                    //do not move pc to until some key pressed
                    pc -= 2;

                    if (someKeyIsDown === 1) {
                        input0aData.instr0aFlag = 1;
                        input0aData.keyCode = toInt(getKeyDown());
                    }

                    if (input0aData.instr0aFlag === 2) {
                        input0aData.instr0aFlag = 0;
                        registers[generalRegister1] = input0aData.keyCode;
                        debugPrint("fx0a someKey is down   key :", registers[generalRegister1]);
                        pc += 2;
                    }

                    break;
                case "29":
                    ir = 80 + registers[generalRegister1] * 5;
                    debugPrint("fx29   X value : ", registers[generalRegister1], " ir :  ", ir);
                    break;
                case "33":
                    let no = registers[generalRegister1].toString();
                    no = "0".repeat(3 - no.length) + no;
                    memory[ir] = parseInt(no[0]);
                    memory[ir + 1] = parseInt(no[1]);
                    memory[ir + 2] = parseInt(no[2]);
                    debugPrint("fx33 to store : ", no, " m[ir] : ", memory[ir], " m[ir+1] : ", memory[ir + 1], " m[ir+2] : ", memory[ir + 2])
                    break;
                case "55":
                    debugPrint("fx55  ir : ", ir, " till VX : ", binToInt(bitInfo.X));
                    for (let i = 0; i < limit; i++)
                        memory[ir + i] = registers['V' + toHex(i)];
                    break;
                case "65":
                    debugPrint("fx65  ir : ", ir, " till VX : ", binToInt(bitInfo.X));
                    for (let i = 0; i < limit; i++) {
                        debugPrint("Accessing :  ir+i : ", (ir + i), " memory[ir + i] : ", memory[ir + i]);
                        registers['V' + toHex(i)] = memory[ir + i];
                    }


                    break;
            }
            break;
        }
    }

    //debugger
}