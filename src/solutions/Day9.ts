/*
    Day 9 is about finding the next/previous element in a pattern.
    It does this by calculating the next row down every time, until we get to the pattern,
    and then we can walk back up the chain to calculate the pattern.

    Details: https://adventofcode.com/2023/day/9
*/
import { IDay } from "../interfaces";

export class Day9 implements IDay {
    // Parses an input line (eg. 1 2 3 4 5 6) into an array of numbers.
    protected ParseNumberLine(numberLine: string): number[] | undefined {
        let numbers = numberLine.match(/[^ ]+/g)?.map(x => parseInt(x));
        if (numbers === undefined) {
            console.warn(`Could not parse number line: ${numberLine}`);
            return undefined;
        }
        return numbers;
    }

    // Detects the pattern and builds the next element in the sequence.
    protected ParseNextLineEntry(numbers: number[]): number {
        let endValues = [ ];

        while (true) {
            // Check if the entire number line is full of zeros
            if (numbers.filter(x => x !== 0).length === 0) {
                break;
            }

            // Otherwise, we want to record the end of this number line
            endValues.push(numbers[numbers.length - 1]);

            // And calculate our next row down
            let newNumbers = [ ];
            for (let i = 1; i < numbers.length; i++) {
                newNumbers.push(numbers[i] - numbers[i - 1]);
            }
            numbers = newNumbers;
        }

        // As we walk back up the chain, we can calculate our runningTotal
        // This is the previous running total + the end of the line above
        let runningTotal = 0;
        for (let i = endValues.length - 1; i >= 0; i--) {
            runningTotal += endValues[i];
        }

        // Return the final total.
        return runningTotal;
    }

    // Runs the exercise. This takes in a flag, doReverse, which indicates the element we're looking for.
    // If doReverse is true, the number line is reversed, so that we can find the previous element.
    protected RunExercise(input: string, doReverse: boolean): number {
        let numberLines = input.replace(/\r/g, "").split("\n");
        let total = 0;

        numberLines.forEach((numberLine) => {
            // Parse into the array of numbers
            let numbers = this.ParseNumberLine(numberLine);
            if (!numbers) {
                return;
            }

            // If we're looking for the start of the sequence, reverse it;
            // this way we can run the same algorithm to detect the pattern
            if (doReverse) {
                numbers.reverse();
            }

            // Calculate the next element in the sequence
            let value = this.ParseNextLineEntry(numbers);

            // Add the element to our running total.
            total += value;
        });

        return total;
    }

    // Part1 and Part2 are the same, just changing up the doReverse value.
    Part1(input: string): string {
        return this.RunExercise(input, false).toString();
    }
    Part2(input: string): string {
        return this.RunExercise(input, true).toString();
    }
    
}