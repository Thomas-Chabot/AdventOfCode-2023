import { IDay } from "../interfaces";

export class Day15 implements IDay {
    protected Hash(input: string) {
        let currentValue = 0;
        input.split("").forEach(x => {
            let asciiValue = x.charCodeAt(0);
            currentValue += asciiValue;
            currentValue *= 17;
            currentValue = currentValue % 256;
        });
        return currentValue;
    }
    Part1(input: string): string {
        let commands = input.replace(/\r/g, "").replace(/\n/g, "").split(",");
        let total = 0;

        commands.forEach(x => {
            total += this.Hash(x);
        });

        return total.toString();
    }
    Part2(input: string): string {
        return "";
    }
    
}