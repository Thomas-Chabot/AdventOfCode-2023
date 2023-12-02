const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const readInput = (query: string): Promise<string> => new Promise((resolve) => rl.question(`${query}  `, resolve));

import { getExamples, getInput } from "./cli";
import { IDay } from "./interfaces";
import { Day1, Day2 } from "./solutions";

let days = [new Day1(), new Day2()];

async function outputResults(dayNumber: number, day: IDay) {
    let exampleP1 = await getExamples(dayNumber, 1);
    let exampleP2 = await getExamples(dayNumber, 2);

    // Read input - Note that this has a special check in case it fails, to tell the user that they need to create the file.
    let input : string = "";
    try {
        input = await getInput(dayNumber);
    } catch (e: any) {
        const code = e.code;
        if (code === 'ENOENT') {
            console.log(`Failed to find input file; please check that this file has been created. If you're not sure, please read the README for instructions.`);
        } else {
            console.log(`Failed to read input file: ${e.message}`)
        }

        return;
    }

    console.log(`
        EXAMPLES:
            Part 1: ${day.Part1(exampleP1)}
            Part 2: ${day.Part2(exampleP2)}

        TEST INPUT:
            Part 1: ${day.Part1(input)}
            Part 2: ${day.Part2(input)}
    `);
}

// Usage inside aync function do not need closure demo only
(async() => {
    try {
        console.log(`Hello World! This program lets you solve Advent of Code challenges.`);
        let quit = false;
        while (!quit) {
            let input = await readInput(`Please input a day to read the result from [1 - ${days.length}]. Or enter 'quit' to quit:`);
            if (input.toLowerCase() === 'quit') {
                quit = true;
                break;
            }

            let dayNumber = parseInt(input);
            let day = days[dayNumber - 1];
            if (!dayNumber || !day) {
                console.error(`Invalid Input: ${input}`);
                continue;
            }

            try {
                await outputResults(dayNumber, day);
            } catch (ex) {
                console.error(`Failed to output results: ${ex}`)
            }
        }

        rl.close();
    } catch (e) {
        console.error(`Prompt Error.`);
    }
})();

// When done reading prompt, exit program 
rl.on('close', () => process.exit(0));