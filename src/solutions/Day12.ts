import { IDay } from "../interfaces";

export class Day12 implements IDay {
    protected ParseInput(input: string, numCopies: number): {Sequence: string, Numbers: number[]} {
        let match = input.match(/^(.+) (.+)$/);
        if (match === null) {
            throw `Could not parse input: ${input}`;
        }

        let [_, sequence, numbersStr] = match;
        
        
        // Create multiple copies
        let repeatedSequence = `${sequence}?`.repeat(numCopies);
        numbersStr = `${numbersStr},`.repeat(numCopies);
        sequence = repeatedSequence.substring(0, repeatedSequence.length - 1);

        let numbers = numbersStr.match(/\d+/g);
        if (numbers === null) {
            throw `Could not parse numbers: ${numbersStr}`;
        }

        return {
            Sequence: sequence,
            Numbers: numbers.map(x => parseInt(x))
        };
    }
    protected CanFitSize(sequence: string, size: number) {
        for (let i = 0; i < size; i++) {
            if (sequence.charAt(i) === "." || sequence.charAt(i) === "") {
                return false;
            }
        }
        if (sequence.charAt(size) === "#") {
            return false;
        }
        return true;
    }

    protected Solve(sequence: string, sizes: number[], memo?: number[][] | undefined) {
        if (memo === undefined) {
            memo = [ ];
        }
        if (memo[sizes.length] === undefined) {
            memo[sizes.length] = [ ];
        }

        // If we've previously stored this index, re-map the value
        if (memo[sizes.length][sequence.length]) {
            return memo[sizes.length][sequence.length];
        }

        // Edge cases: If we reach the end of both sets, this is valid string
        if (sizes.length === 0 && sequence.length === 0) {
            return 1;
        }

        // If we run out of sizes, this is valid if we have no more damaged springs (#s)
        if (sizes.length === 0) {
            return sequence.indexOf("#") === -1 ? 1 : 0;
        }
        // Otherwise, if we have no more space in the string but we have more sizes, we're invalid
        if (sequence.length === 0) {
            return 0;
        }

        // At this point we have to run down the chain to calculate our results
        let size = sizes[0];
        let options = 0;
        let endIndex = sequence.indexOf("#") + 1;
        if (endIndex === 0) {
            endIndex = sequence.length;
        }
        for (let charIndex = 0; charIndex < endIndex; charIndex++) {
            // Check if this is a valid portion of the string that we can use.
            if (!this.CanFitSize(sequence.substring(charIndex), size)) {
                //console.log(`INVALID\tSize: ${size} | Char Index: ${charIndex} | Sub-sizes: ${sizes.slice(1)} | Total: ${options} | Sub-string: ${sequence.substring(charIndex)}`)
                continue;
            }

            let result = this.Solve(sequence.substring(charIndex + size + 1), sizes.slice(1), memo);
            //console.log(`VALID\tSize: ${size} | Char Index: ${charIndex} | Sub-sizes: ${sizes.slice(1)} | Sub-string: ${sequence.substring(charIndex + size + 1)} | Result: ${result} | Total: ${options} | `);

            options += result;
        }

        memo[sizes.length][sequence.length] = options;
        return options;
    }

    Part1(input: string): string {
        let lines = input.replace(/\r/g, "").split("\n");
        let sum = 0;
        lines.forEach(inputString => {
            let {Sequence, Numbers} = this.ParseInput(inputString, 1);
            let options = this.Solve(Sequence, Numbers);

            //console.log(`${Sequence} ${Numbers.join(",")} :: ${options}`);
            sum += options;
        })

        return sum.toString();
    }
    Part2(input: string): string {
        let lines = input.replace(/\r/g, "").split("\n");
        let sum = 0;
        lines.forEach(inputString => {
            let {Sequence, Numbers} = this.ParseInput(inputString, 5);
            let options = this.Solve(Sequence, Numbers);

            //console.log(`${Sequence} ${Numbers.join(",")} :: ${options}`);
            sum += options;
        })

        return sum.toString();
    }

}