//fde = fetch decode execute

let instructionPerSecond = 10000;
let fdeIntervalID;
let soundDelayID;
let debugFlag = 0;

// this code records all key down at the moment, used for some instruction later
let someKeyIsDown = 0;
let keyDownDict = {};

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
    if (Object.keys(keyDownDict).length === 0) {
        someKeyIsDown = 1;
        keyDownDict[event.code] = 1;
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


//-----


function intToBin(inte) {
    //return inte.toString(2);
    let bin = inte.toString(2);
    //if (inte >= 0)
    return ("00000000" + bin).substr(-8);

    // dealing with negative numbers

    // let flag = 0;
    // bin = bin.slice(1);
    // console.log(bin);
    // for (let i = bin.length; i >= 0; i--) {
    //     console.log(bin[i] + " " + flag);
    //     if (bin[i] === '1')
    //         flag = 1;

    //     if (flag === 1) {
    //         if (bin[i] === '0') {
    //             bin[i] = '1';
    //         }
    //         else {
    //             bin[i] = '0';
    //         }
    //     }
    // }

    // return ("11111111" + bin).substr(-8);
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
    for (let bit of view8bit) {
        memory[i] = bit;
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

    incremenetPC();
    incremenetPC();

    //let instruction = memory[toInt(pc)].slice(2)+memory[toInt(pc)+1].slice(2);

    bitInfo = new SeperateBits(instruction);

    if (debugFlag === 1) {
        console.log("debug : instruction : \n");
        console.log(JSON.stringify(bitInfo));
        console.log("debug : registers : \n");
        console.log(JSON.stringify(registers));
    }

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
                for (let i = 0; i < displayHeight; i++) {
                    for (let j = 0; j < displayWidth; j++) {
                        clearPixel(i, j);
                    }
                }
            }
            else if (bin2hex(bitInfo.X) + bin2hex(bitInfo.NN) === "0ee") {
                pc = stack.pop();
            }
            break;
        case '1':
            pc = binToInt(bitInfo.NNN);
            break;

        case '2':
            stack.push(pc);
            pc = binToInt(bitInfo.NNN);
            break;

        case '3':
            // console.log("register : "+registers["V" + bin2hex(bitInfo.X)]);
            // console.log(bitInfo.NN);
            // console.log(registers["V" + bin2hex(bitInfo.X)] === bitInfo.NN);
            if (registers["V" + bin2hex(bitInfo.X)] === bitInfo.NN) {
                incremenetPC();
                incremenetPC();
            }
            break;
        case '4':
            if (registers["V" + bin2hex(bitInfo.X)] !== bitInfo.NN) {
                incremenetPC();
                incremenetPC();
            }
        case '5':
            if (registers["V" + bin2hex(bitInfo.X)] === registers["V" + bin2hex(bitInfo.Y)]) {
                incremenetPC();
                incremenetPC();
            }
            break;

        case '6':
            registers["V" + bin2hex(bitInfo.X)] = bitInfo.NN;
            break;

        case '7':
            // console.log("instruction 7 : ");
            let generalRegister = "V" + bin2hex(bitInfo.X);
            let currentVxValue = binToInt(registers["V" + bin2hex(bitInfo.X)]);

            // console.log("x curr value bin : "+registers["V" + bin2hex(bitInfo.X)]+" converted :  "+currentVxValue);
            // console.log("NN value bin : "+bitInfo.NN+" converted : "+binToInt(bitInfo.NN));
            registers[generalRegister] = intToBin(currentVxValue + binToInt(bitInfo.NN));

            if (registers[generalRegister].length > 8) {
                registers[generalRegister] = registers[generalRegister].slice(registers[generalRegister].length - 8);
                registers["Vf"] = intToBin(1);
            }

            break;

        case '8':
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            let generalRegister2 = "V" + bin2hex(bitInfo.Y);
            switch (bin2hex(bitInfo.N)) {
                case '0':
                    registers[generalRegister1] = registers[generalRegister2];
                    break;
                case '1':
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) | binToInt(registers[generalRegister2]));
                    break;
                case '2':
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) & binToInt(registers[generalRegister2]));
                    break;
                case '3':
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) ^ binToInt(registers[generalRegister2]));
                    break;
                case '4':
                    registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) + binToInt(registers[generalRegister2]));
                    if (registers[generalRegister1].length > 8) {
                        registers[generalRegister1] = registers[generalRegister1].slice(registers[generalRegister1].length - 8);
                        registers["Vf"] = intToBin(1);
                    }
                    break;
                case '5':
                case '7':
                    let minuend;
                    let subtrahend;

                    if (bin2hex(bitInfo.N) === '5') {
                        console.log("instruction x5");
                        minuend = binToInt(registers[generalRegister1]);
                        subtrahend = binToInt(registers[generalRegister2]);
                        console.log("min : " + minuend);
                        console.log("sub : " + subtrahend);
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
                    break;
                case '6':
                case 'e':
                    //registers[generalRegister1] = registers[generalRegister2];

                    if (bin2hex(bitInfo.N) === '6') {
                        registers["Vf"] = registers[generalRegister1][7];
                        registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) >>> 1);
                    }
                    else {
                        registers["Vf"] = registers[generalRegister1][0];
                        registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) << 1);
                    }
                    break;
            }
            break;
        case '9':
            if (registers["V" + bin2hex(bitInfo.X)] !== registers["V" + bin2hex(bitInfo.Y)]) {
                incremenetPC();
                incremenetPC();
            }
            break;
        case 'a':
            ir = binToInt(bitInfo.NNN);
            break;
        case 'b':
            pc = binToInt(bitInfo.NNN) + binToInt(registers["V0"]);
            break;
        case 'c':
            let randomNumber = Math.floor(Math.random() * 256);
            registers["V" + bin2hex(bitInfo.X)] = intToBin(randomNumber & binToInt(bitInfo.NN));
            break;
        case 'd': {
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            let generalRegister2 = "V" + bin2hex(bitInfo.Y);
            let xCoord = binToInt(registers[generalRegister1]) % displayWidth;
            let yCoord = binToInt(registers[generalRegister2]) % displayHeight;
            //from memory access the sprite starting from the index register 

            let spriteIndex = ir;
            let limit = spriteIndex + binToInt(bitInfo.N);

            for (; spriteIndex < limit; spriteIndex++) {
                let xCoordIter = xCoord;
                let spriteRow = intToBin(memory[spriteIndex]);
                for (let j = 0; j < 8; j++) {
                    if (spriteRow[j] === '1')
                        togglePixel(yCoord, xCoordIter);

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
                if (someKeyIsDown === 1) {
                    if (checkInputDown(val)) {
                        incremenetPC();
                        incremenetPC();
                    }
                }
            }

            else if (bin2hex(bitInfo.NN) === "a1") {
                if (someKeyIsDown === 1) {
                    if (~checkInputDown(val)) {
                        incremenetPC();
                        incremenetPC();
                    }
                }
            }
            break;
        }
        case 'f': {
            let generalRegister1 = "V" + bin2hex(bitInfo.X);
            switch (bin2hex(bitInfo.NN)) {
                case "7":
                    registers[generalRegister1] = intToBin(dt);
                    break;
                case "15":
                    dt = binToInt(registers[generalRegister1]);
                    break;
                case "18":
                    st = binToInt(registers[generalRegister1]);
                    break;
                case "1e":
                    ir += binToInt(registers[generalRegister1]);
                    break;
                case "a":
                    keyInstFlag0a = 1;
                    pc -= 2;
                    if (someKeyIsDown === 1) {
                        registers[generalRegister1] = hex2bin(getKeyDown());
                    }
                    break;
                case "29":
                    //check how are values stored in registers
                    ir = 80 + binToInt(registers[generalRegister1]) * 5;
                    break;
                case "33":
                    let no = binToInt(registers[generalRegister1]).toString();
                    no = "0".repeat(3 - no.length) + no;
                    memory[ir] = parseInt(no[0]);
                    memory[ir + 1] = parseInt(no[1]);
                    memory[ir + 2] = parseInt(no[2]);
                    break;
                case "55":
                    for (let i = 0; i < 16; i++)
                        memory[ir + i] = registers['V' + toHex(i)];
                    break;
                case "65":
                    for (let i = 0; i < 16; i++)
                        registers['V' + toHex(i)] = intToBin(memory[ir + i]);
                    break;
            }
            break;
        }
    }

}