import { IDay } from "../interfaces";

type Lens = {
    Label: string;
    Length: number | undefined;
    Operation: string;
}

export class Day15 implements IDay {
    protected Hash(input: string): number {
        let currentValue = 0;
        input.split("").forEach(x => {
            let asciiValue = x.charCodeAt(0);
            currentValue += asciiValue;
            currentValue *= 17;
            currentValue = currentValue % 256;
        });
        return currentValue;
    }
    protected GetCommands(input: string): string[] {
        return input.replace(/\r/g, "").replace(/\n/g, "").split(",");
    }
    protected ParseCommand(command: string): Lens {
        let match = command.match(/^(.+)([=-])(\d*)$/);
        if (match === null) {
            throw `Could not parse command: ${command}`;
        }

        let [_, label, commandType, lengthStr] = match;
        let length = parseInt(lengthStr);
        return {
            Label: label,
            Operation: commandType,
            Length: isNaN(length) ? undefined : length
        }
    }

    protected Remove(label: string, boxes: Lens[][]) {
        let hash = this.Hash(label);
        if (boxes[hash] === undefined) {
            return;
        }

        let foundIndex = boxes[hash].findIndex(x => x.Label === label);
        if (foundIndex !== -1) {
            boxes[hash].splice(foundIndex, 1);
        }
    }
    protected Set(lens: Lens, boxes: Lens[][]) {
        let hash = this.Hash(lens.Label);
        if (boxes[hash] === undefined) {
            boxes[hash] = [ ];
        }

        let foundLens = boxes[hash].find(x => x.Label === lens.Label);
        if (foundLens) {
            foundLens.Length = lens.Length;
        } else {
            boxes[hash].push(lens);
        }
    }

    Part1(input: string): string {
        let commands = this.GetCommands(input);
        let total = 0;

        commands.forEach(x => {
            total += this.Hash(x);
        });

        return total.toString();
    }
    Part2(input: string): string {
        let boxes: Lens[][] = new Array(256);

        // Go through the commands and build up our HASHMAP        
        let commands = this.GetCommands(input);
        commands.forEach(commandString => {
            let lens = this.ParseCommand(commandString);
            switch (lens.Operation) {
                case "=":
                    this.Set(lens, boxes);
                    break;
                case "-":
                    this.Remove(lens.Label, boxes);
                    break;
                default:
                    throw `Could not read command type: ${lens.Operation}`;
            }
        });

        // Calculate focusing power
        let focusingPower = 0;
        boxes.forEach((box, boxIndex) => {
            if (box === undefined) {
                return;
            }

            box.forEach((lens, slotIndex) => {
                if (lens.Length === undefined) {
                    throw `Undefined Lens length: ${lens.Label} ${lens.Operation} ${lens.Length}`;
                }
                focusingPower += (boxIndex + 1) * (slotIndex + 1) * lens.Length;
            });
        })

        return focusingPower.toString();
    }
    
}