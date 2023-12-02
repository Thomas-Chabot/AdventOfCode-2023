import { IDay } from "../interfaces";

export class Day1 implements IDay {
    protected compute(string: string): number {
        const numbers = string.match(/[0-9]/g);
        if (numbers === null) {
            throw `Could not parse any numbers for the string: ${string}.`;
        }

        return parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`);
    }
    protected replaceWords(string: string): string {
        let replacements = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        replacements.forEach((numStr, index) => {
            let regex = new RegExp(numStr, "g");

            // Replace any occurrences of the word, leaving the first and last letter in place
            string = string.replace(regex, `${numStr.charAt(0)}${index}${numStr.charAt(numStr.length-1)}`);
        })
        return string;
    }
    protected solveStrings(input: string, parseLine: (line: string)=>string): string {
        const stringArray = input.split("\n");
        let total = 0;
        stringArray.forEach(string => {
            total += this.compute(parseLine(string));
        });
    
        return total.toString();

    }

    public Part1(input: string): string {
        return this.solveStrings(input, (s)=>s);
    }
    public Part2(input: string): string {
        return this.solveStrings(input, this.replaceWords);
    }
}