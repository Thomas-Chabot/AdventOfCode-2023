import { IDay, ITest } from "./interfaces";
import { GetExample, GetTestInput, WriteTestInput, PromptUser, FetchInput, QuitPrompt, WriteSetting } from "./lib";
import { Day1, Day10, Day2, Day3, Day4, Day5, Day6, Day7, Day8, Day9 } from "./solutions";
import { SortedLinkTests, Vector2 } from "./tests";

// Days - Note that as new solutions are added, we should add them to the array here, in order.
let dayClasses = [Day1, Day2, Day3, Day4, Day5, Day6, Day7, Day8, Day9, Day10];
let days : IDay[] = [ ];
let tests: { [id: string]: ITest } = {
    sortedlinkedlist: SortedLinkTests,
    vector2: Vector2
}

// Create instances for each of the days that can be run
dayClasses.forEach((Day, index) => days[index] = new Day());

// Retrieve Input
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

// Log a day's output to the console.
async function outputResults(dayNumber: number, day: IDay) {
    let exampleP1 = await GetExample(dayNumber, 1);
    let exampleP2 = await GetExample(dayNumber, 2);
    let input = (await getInputData(dayNumber)).trim();

    console.log(`
        EXAMPLES:
            Part 1: ${day.Part1(exampleP1)}`);
    console.log(
`            Part 2: ${day.Part2(exampleP2)}`);
    console.log(`
        TEST INPUT:
            Part 1: ${day.Part1(input)}`)
    console.log(
`            Part 2: ${day.Part2(input)}`);
}

// Allows the user to run the code for a specific day.
async function runDay() {
    let input = await PromptUser(`Please input a day to read the result from [1 - ${days.length}]:`);
    let dayNumber = parseInt(input);
    let day = days[dayNumber - 1];
    if (!dayNumber || !day) {
        console.error(`Invalid Input: ${input}`);
        return;
    }

    try {
        await outputResults(dayNumber, day);
    } catch (ex) {
        console.error(`Failed to output results: ${ex}`)
    }
}

// Runs unit tests.
async function runTest() {
    let testType = await PromptUser(`Please select a test type [${Object.keys(tests).join(", ")}]:`);
    let test = tests[testType.toLowerCase()];
    if (test === undefined) {
        console.error(`Could not find a test with the name ${testType}`);
    } else {
        try {
            test.RunTest();
        } catch (e) {
            console.error(`Test failed with exception: ${e}`);
        }
    }
}

// Allow the user to configure their settings.
async function configure(){
    let sessionToken = await PromptUser("Please enter your session token:");
    await WriteSetting("Session", sessionToken);
}

// Main loop.
async function Main(){
    try {
        console.log(`Hello World! This program lets you solve Advent of Code challenges.`);
        let quit = false;
        while (!quit) {
            let mode = await PromptUser(`Please select a mode [configure, day, test or quit]:`);
            switch (mode.toLowerCase()) {
                case `quit`:
                    quit = true;
                    break;
                case `configure`:
                    await configure();
                    break;
                case `day`:
                    await runDay();
                    break;
                case `test`:
                    await runTest();
                    break;
                default:
                    console.error(`Invalid Input: ${mode}`);
                    break;
            }
        }

        QuitPrompt();
    } catch (e) {
        console.error(`Prompt Error.`);
    }
}

Main();