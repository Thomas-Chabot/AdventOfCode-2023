import { IDay } from "../interfaces";

export class Day14 implements IDay {
    protected CreateValuesArray(input: string) {
        let lines = input.replace(/\r/g, "").split("\n");
        return lines.map(line => line.split(""));
    }
    protected Cycle(column: number, values: string[][], record: boolean): number[] {
        let updates: number[] = [];
        let currentValue = values.length;

        for (let line = 0; line < values.length; line++) {
            switch (values[line][column]) {
                case "O":
                    updates.push(currentValue);
                    values[line][column] = ".";
                    values[values.length - currentValue][column] = "O";
                    currentValue --;
                    break;
                case "#":
                    currentValue = (values.length - line) - 1;
                    break;
                default:
                    break;
            }
        }

        return updates;
    }
    protected CalculateLoad(values: string[][]): number {
        // This is pretty easy; we can go up-down to calculate how many rocks are at each level.
        // We stop when we either hit the bottom, or hit a #, and then we add this to our total.
        // Then we can continue from that layer down.

        let total = 0;

        for (let colIndex = 0; colIndex < values[0].length; colIndex++) {
            let updates = this.Cycle(colIndex, values, true);
            let columnTotal = updates.reduce((prevValue, updateValue) => prevValue + updateValue, 0);
            total += columnTotal;
        }

        return total;
    }
    Part1(input: string): string {
        let values = this.CreateValuesArray(input);
        
        return this.CalculateLoad(this.CreateValuesArray(input)).toString();
    }
    Part2(input: string): string {
        let values = this.CreateValuesArray(input);

        return "";
    }
    
}