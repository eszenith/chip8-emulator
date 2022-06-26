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
            break;
        case '1':
            console.log("instruction 1");
            console.log(binToInt(bitInfo.NNN) + " " + bitInfo.NNN);
            pc = binToInt(bitInfo.NNN);
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
        case 'a':
            console.log("instruction a");
            ir = binToInt(bitInfo.NNN);
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

    }

}