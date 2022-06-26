//fde = fetch decode execute

let instructionPerSecond = 10000;
let fdeIntervalID;

function intToBin(inte) {
    //return inte.toString(2);
    return ("00000000" + inte.toString(2)).substr(-8);
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

function getKey()
{

}
function loadProgramToMemory(view8bit) {
    let i = toInt("0x200");
    for (let bit of view8bit) {
        console.log(i + " : " + intToBin(bit));
        memory[i] = bit;
        i++;
    }
    console.log("loaded : " + i);
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

            fdeIntervalID = setInterval(() => {
                fdeCycle();
            }, 100);
        }

        fr.readAsArrayBuffer(this.files[0]);
    });

document.getElementById('stop').addEventListener("click", function () {
    clearInterval(fdeIntervalID);
});

function fdeCycle() {

    let instruction = intToBin(memory[pc]) + intToBin(memory[pc + 1]);
    let keyDownInstFlag = 0;
    incremenetPC();
    incremenetPC();
    console.log("current pc : " + pc + " instruction : " + instruction);

    //let instruction = memory[toInt(pc)].slice(2)+memory[toInt(pc)+1].slice(2);

    bitInfo = new SeperateBits(instruction);

    switch (bin2hex(bitInfo.opcode)) {
        case '0':
            console.log("instruction 0");

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
            console.log("instruction 1");
            console.log(binToInt(bitInfo.NNN) + " " + bitInfo.NNN);
            pc = binToInt(bitInfo.NNN);
            break;

        case '2':
            console.log("instruction 2");
            stack.push(pc);
            pc = binToInt(bitInfo.NNN);
            break;
        
        case '3':
            if(registers["V"+bin2hex(bitInfo.X)] === bitInfo.NN)
            {
                incremenetPC();
                incremenetPC();
            }
            break;
        case '4':
            if(registers["V"+bin2hex(bitInfo.X)] !== bitInfo.NN)
            {
                incremenetPC();
                incremenetPC();
            }
        case '5':
            if(registers["V"+bin2hex(bitInfo.X)] === registers["V"+bin2hex(bitInfo.Y)])
            {
                incremenetPC();
                incremenetPC();
            }
            break;

        case '6':
            console.log("instruction 6");
            registers["V" + bin2hex(bitInfo.X)] = bitInfo.NN;
            break;

        case '7':
            console.log("instruction 7");
            let generalRegister = "V" + bin2hex(bitInfo.X);
            let currentVxValue = binToInt(registers["V" + bin2hex(bitInfo.X)]);

            registers[generalRegister] = intToBin(currentVxValue + binToInt(bitInfo.NN));

            if (registers[generalRegister].length > 8) {
                registers[generalRegister] = registers[generalRegister].slice(registers[generalRegister].length - 8);
                registers["VF"] = intToBin(1);
            }

            break;
        
        case '8':
            let generalRegister1 = "V"+bin2hex(bitInfo.X);
            let generalRegister1 = "V"+bin2hex(bitInfo.Y);
            switch(bin2hex(bitInfo.N))
            {
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
                    if(registers[generalRegister1].length > 8)
                    {
                        registers[generalRegister1] = registers[generalRegister1].slice(registers[generalRegister1].length - 8);
                        registers["VF"] = intToBin(1);
                    }
                    break;
                case '5':
                case '7':
                    let minuend;
                    let subtrahend;

                    if(bin2hex(bitInfo.opcode) === '5')
                    {
                        minuend = binToInt(registers[generalRegister1]);
                        subtrahend = binToInt(registers[generalRegister2]);
                    }
                    else {
                        minuend = binToInt(registers[generalRegister2]);
                        subtrahend = binToInt(registers[generalRegister1]);
                    }
                    registers[generalRegister1] = intToBin(minuend - subtrahend);
                    if(minuend > subtrahend)
                    {
                        registers["VF"] = intToBin(1);
                    }
                    else
                    {
                        registers["VF"] = intToBin(0);
                    }
                    break;
                case '6':
                case 'e':
                    //registers[generalRegister1] = registers[generalRegister2];

                    if(bin2hex(bitInfo.opcode) === '6')
                    {
                        registers["VF"] = registers[generalRegister1][7];
                        registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) >>> 1);
                    }
                    else {
                        registers["VF"] = registers[generalRegister1][0];
                        registers[generalRegister1] = intToBin(binToInt(registers[generalRegister1]) << 1);
                    }
                    break;
            }
            break;
        case '9':
            if(registers["V"+bin2hex(bitInfo.X)] !== registers["V"+bin2hex(bitInfo.Y)])
            {
                incremenetPC();
                incremenetPC();
            }
            break;
        case 'a':
            console.log("instruction a");
            ir = binToInt(bitInfo.NNN);
            break;
        case 'b':
            pc = binToInt(bitInfo.NNN)+binToInt(registers["V0"]);
            break;
        case 'c':
            let randomNumber = Math.floor(Math.random() * 256);
            registers["V"+ bin2hex(bitInfo.X)] = intToBin(randomNumber & binToInt(bitInfo.NN));
            break;
        case 'd':
            console.log("instruction d");
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
        case 'e':
            keyDownInstFlag = 1;
            if(bin2hex(bitInfo.NN) === "9e")
            {
                document.addEventListener('keydown', function(event) {
                    if(keyDownInstFlag === 1) {
                        let keyValueInReg = bin2hex(bitInfo.X)
                        let skipFlag = 0;
                        if(event.code === 'Digit1' && keyValueInReg === "0") {
                            skipFlag = 1;
                        }
                        if(event.code === 'Digit2' && keyValueInReg === "1") {
                            skipFlag = 1;
                        }
                        if(event.code === 'Digit3' && keyValueInReg === "2") {
                            skipFlag = 1;
                        }
                        if(event.code === 'Digit4' && keyValueInReg === "3") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyQ' && keyValueInReg === "4") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyW' && keyValueInReg === "5") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyE' && keyValueInReg === "6") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyR' && keyValueInReg === "7") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyA' && keyValueInReg === "8") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyS' && keyValueInReg === "9") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyD' && keyValueInReg === "a") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyF' && keyValueInReg === "b") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyZ' && keyValueInReg === "c") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyX' && keyValueInReg === "d") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyC' && keyValueInReg === "e") {
                            skipFlag = 1;
                        }
                        if(event.code === 'keyV' && keyValueInReg === "f") {
                            skipFlag = 1;
                        }
                        if(skipFlag === 1) {
                            incremenetPC();
                            incremenetPC();
                        }
                    }
                  });
            }
            break;
    }

}