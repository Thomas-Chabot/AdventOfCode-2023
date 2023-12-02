require('dotenv').config();

const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const readInput = (query: string): Promise<string> => new Promise((resolve) => rl.question(`${query}  `, resolve));

import { IDay } from "./interfaces";
import { GetExample, GetTestInput, WriteTestInput } from "./lib";
import { FetchInput } from "./lib/Network";
import { Day1, Day2 } from "./solutions";

let days = [new Day1(), new Day2()];

async function getInputData(day: number): Promise<string> {
    // First, check if the input is already written to disk, and retrieve it if it exists
    try {
        return await GetTestInput(day);
    } catch (e : any) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
        
        // Doesn't exist; retrieve it from the network.
        let inputFetched = await FetchInput(day);
        if (!inputFetched) {
            // Could not retrieve the input data.
            throw e;
        }
        
        // Write back to disk so that we can save it for later
        WriteTestInput(day, inputFetched);
        return inputFetched;
    }
}

async function outputResults(dayNumber: number, day: IDay) {
    let exampleP1 = await GetExample(dayNumber, 1);
    let exampleP2 = await GetExample(dayNumber, 2);
    let input = (await getInputData(dayNumber)).trim();

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