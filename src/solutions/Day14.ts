import { Vector2 } from "../dataStructures";
import { IDay } from "../interfaces";
import { WriteDebug } from "../lib";

type Loop = {
    StartIndex: number,
    Length: number
}

export class Day14 implements IDay {
    protected CreateValuesArray(input: string) {
        let lines = input.replace(/\r/g, "").split("\n");
        return lines.map(line => line.split(""));
    }

    //#region  "Cycling"
    protected Cycle(values: string[][], startIndex: number, endIndex: number, getNextIndexFromCube: (position: Vector2)=>number, 
        mapValue: (value: number)=>Vector2, mapIndex: (index:number)=>Vector2, increment: (i: number)=>number)
    {
        let currentValue = values.length;
        for (let i = startIndex; i !== endIndex; i = increment(i)) {
            let position = mapIndex(i);
            switch (values[position.Y][position.X]) {
                case "O":
                    values[position.Y][position.X] = ".";

                    let newPosition = mapValue(currentValue);
                    values[newPosition.Y][newPosition.X] = "O";
                    currentValue --;
                    break;
                case "#":
                    currentValue = getNextIndexFromCube(position);
                    break;
                default:
                    break;
            }

        }
    }
    protected CycleUp(column: number, values: string[][]) {
        this.Cycle(values, 0, values.length, 
            (position) => (values.length - position.Y) - 1, 
            (value: number)=>new Vector2(column, values.length - value), 
            (index: number)=>new Vector2(column, index), 
            (index)=>index+1);
    }
    protected CycleDown(column: number, values: string[][]) {
        this.Cycle(values, values.length - 1, -1, 
            (position) => (position.Y), 
            (value: number)=>new Vector2(column, value - 1), 
            (index: number)=>new Vector2(column, index), 
            (index)=>index - 1);
    }
    protected CycleLeft(line: number, values: string[][]) {
        this.Cycle(values, 0, values.length, 
            (position) => (values.length - position.X) - 1, 
            (value: number)=>new Vector2(values.length - value, line), 
            (index: number)=>new Vector2(index, line), 
            (index)=>index+1);
    }
    protected CycleRight(line: number, values: string[][]) {
        this.Cycle(values, values.length - 1, -1, 
            (position) => (position.X), 
            (value: number)=>new Vector2(value - 1, line), 
            (index: number)=>new Vector2(index, line), 
            (index)=>index - 1);
    }

    // Runs a cycle.
    protected RunCycle(values: string[][], endIndex: number, cycleFunction: (index: number, values: string[][])=>void) {
        for (let i = 0; i < endIndex; i++) {
            cycleFunction(i, values);
        }
    }
    //#endregion

    protected StringifyGrid(values: string[][]) {
        return values.map(x => x.join("")).join("\n");
    }
    protected async LogValues(index: number, values: string[][]) {
        await WriteDebug(14, `Index: ${index} | Total: ${this.CalculateLoad(values)}
${this.StringifyGrid(values)}
            
        `);
    }

    protected CalculateLoad(values: string[][]): number {
        // This is complicated but basically goes over every value and increments the total, if the value is a rounded rock.
        return values.map((line, lineNumber) => 
            line.map((value) => value === "O" ? values.length - lineNumber : 0).reduce((prev, x) => prev + x, 0))
            .reduce((x, prev) => prev + x, 0);
    }

    // This function looks for the loop. It'll keep cycling until we reach a point that we've seen before,
    // Then return the start and total length of that loop.
    protected FindLoop(values: string[][], cycle: ()=>void): Loop {
        type CycleData = {
            Next: string,
            FoundIndex: number
        };

        let prevValuesStr, valuesStr;
        
        let detectedValues = new Map<string, CycleData>();
        let index = 0;
        let sourceIndex = 0;
        while (true) {
            cycle();
            
            prevValuesStr = valuesStr;
            valuesStr = this.StringifyGrid(values);

            let prevData : CycleData | undefined = prevValuesStr === undefined ? undefined : detectedValues.get(prevValuesStr);
            if (prevData !== undefined && prevData.Next === valuesStr) {
                sourceIndex = prevData.FoundIndex;
                console.log(`Detected cycle at ${index}`);
                break;
            }
            if (prevValuesStr !== undefined) {
                detectedValues.set(prevValuesStr, {
                    Next: valuesStr,
                    FoundIndex: index
                });
            }

            index ++;
        }

        return {
            StartIndex: sourceIndex,
            Length: index - sourceIndex
        };
    }
    Part1(input: string): string {
        let values = this.CreateValuesArray(input);
        this.RunCycle(values, values[0].length, this.CycleUp.bind(this));
        return this.CalculateLoad(values).toString();
    }
    Part2(input: string): string {
        let cycleFunctions = [
            this.CycleUp.bind(this),
            this.CycleLeft.bind(this),
            this.CycleDown.bind(this),
            this.CycleRight.bind(this)
        ];
        let values = this.CreateValuesArray(input);

        let cycle = ()=>{
            for (let step = 0; step < 4; step++) {
                let cycler = cycleFunctions[step % cycleFunctions.length];
                let endIndex = (step % 2 === 0) ? values[0].length : values.length;
                
                this.RunCycle(values, endIndex, cycler);
            }
        };

        // The key to this puzzle is that we need to find the loop.
        // At some point, we'll run back into a configuration that we've seen before,
        // and from here every move can be calculated.

        // First step is to figure out where the loop starts, and how long that loop is.
        let loop = this.FindLoop(values, cycle);
        
        // Now that we have our loop data, we can math out how many steps we need to find our billionth value.
        let targetIndex = 1000000000;
        // Billionth is:
        //  1. Offset from the start of the loop - for example, if our loop was found starting at index 2, then we need billion - 2 moves.
        //  2. From here, calculate how many steps into the loop we need to make. Eg. A, B, C, A, B, C; if we're looking for B, this would be 1.
        //  3. Because we're moving from numbers into step counts, we need to subtract 1. (I think)
        let billionth = ((targetIndex - loop.StartIndex) % loop.Length) - 1;
        for (let i = 0; i < billionth; i++) {
            cycle();
        }
        
        // And now we can calculate the load.
        return this.CalculateLoad(values).toString();
    }
    
}