import { IDay } from "../interfaces";

type Coordinate = {
    Index: number;
    LineNumber: number;
}

type NumberData = {
    LineNumber: number;
    StartingIndex: number;
    Length: number;
    Value: number;
}

export class Day3 implements IDay {
    // Detects if a given character is a number.
    protected IsNumber(character: string) {
        return !isNaN(parseInt(character));
    }
    // Given an index for the first character in a number, return the full number.
    protected GetFullNumber(line: string, startIndex: number) {
        let str = "";
        let index = startIndex;
        while (this.IsNumber(line.charAt(index))) {
            str += line.charAt(index);
            index ++;
        }
        return str;
    }

    // FindAllAdjacent checks surroundings from a number to find matches against a filter function.
    // Parameters:
    //   grid - The grid of strings, where every string is one line, in order.
    //   startPosition - The starting position for the number within the string.
    //   numberSize - The number of characters in the number. for example, if the number is 456, this is 3.
    //   lineNumber - The line where we found the number.
    //   filter - A function to filter against, should return true if this is a match.
    protected FindAllAdjacent(grid: string[], data: NumberData, filter: (character: string) => boolean): Coordinate[] {
        // Note: We can't go out-of-bounds; the minimum line is 0, and the maximum is grid.length - 1.
        let startLine = Math.max(0, data.LineNumber - 1);
        let endLine = Math.min(grid.length - 1, data.LineNumber + 1);

        // Similar logic for the character coordinates in the line - minimum is 0, maximum is the length of the string.
        let startCharacterCoordinate = Math.max(0, data.StartingIndex - 1);
        let endCharacterCoordinate = Math.min(grid[0].length - 1, data.StartingIndex + data.Length);

        let allMatchingCoordinates: Coordinate[] = [ ];
        for (let line = startLine; line <= endLine; line ++) {
            for (let characterCoordinate = startCharacterCoordinate; characterCoordinate <= endCharacterCoordinate; characterCoordinate ++) {
                let character = grid[line].charAt(characterCoordinate);
                // Add it to the list of matching coordinates if it passes the filter
                if (filter(character)) {
                    allMatchingCoordinates.push({
                        Index: characterCoordinate,
                        LineNumber: line
                    });
                }
            }
        }

        return allMatchingCoordinates;
    }

    protected ParseNumbers(grid: string[]): NumberData[] {
        let data: NumberData[] = [ ];

        grid.forEach((line: string, lineNumber: number) => {
            for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
                // If this is a number, we need to check if the number is valid
                if (this.IsNumber(line.charAt(characterIndex))) {
                    let fullNumber = this.GetFullNumber(line, characterIndex);
                    data.push({
                        LineNumber: lineNumber,
                        StartingIndex: characterIndex,
                        Length: fullNumber.length,
                        Value: parseInt(fullNumber)
                    });
                    characterIndex += fullNumber.length;
                }
            }
        });

        return data;
    }

    // Part 1: Find all numbers that are located adjacent to any symbol.
    Part1(input: string): string {
        let grid = input.replace(/\r/g, "").split("\n");
        let counter = 0;

        let allNumbers = this.ParseNumbers(grid);
        allNumbers.forEach(number => {
            let adjacentSymbols = this.FindAllAdjacent(grid, number, (c) => !this.IsNumber(c) && c !== ".");
            if (adjacentSymbols.length > 0) {
                counter += number.Value;
            }
        });
        
        return counter.toString();
    }

    // Part 2: Find all groups of numbers that are connected by a *.
    Part2(input: string): string {
        let grid = input.replace(/\r/g, "").split("\n");
        let counter = 0;
        
        // Start off by converting all the numbers in the grid into groups.
        // Every number has its own group, and this will allow us to convert from a Line + Index combo into the matching number.
        // For example, a line like: 123...456 will have two groups - indices 0,1,2 are Group 1, 6,7,8 are Group 2.
        let groups = new Map<number, Map<number, number>>();
        let numbers = this.ParseNumbers(grid);
        
        numbers.forEach((x, index) => {
            if (!groups.has(x.LineNumber)) {
                groups.set(x.LineNumber, new Map<number, number>());
            }

            for (let i = 0; i < x.Length; i++) {
                groups.get(x.LineNumber)?.set(x.StartingIndex + i, index);
            }
        });

        // Map through every number to run our logic.
        numbers.forEach(number => {
            // Check if we have any surrounding *s.
            let matchingAsterisks = this.FindAllAdjacent(grid, number, (x) => x === "*");
            if (matchingAsterisks.length === 0) {
                return;
            }

            matchingAsterisks.forEach(coordinate => {
                // Find all numbers surrounding the *.
                let matches = this.FindAllAdjacent(grid, {
                    LineNumber: coordinate.LineNumber,
                    Length: 1,
                    StartingIndex: coordinate.Index,
                    Value: 0
                }, this.IsNumber);
                
                // Parse the values into the groups.
                let groupMatches: Set<number> = new Set();
                matches.forEach(coordinate => {
                    let group = groups.get(coordinate.LineNumber)?.get(coordinate.Index);
                    if (group !== undefined) {
                        groupMatches.add(group);
                    }
                })
                
                // Include the value only if there's exactly two group matches.
                if (groupMatches.size === 2) {
                    let values = [...groupMatches];
                    let value0 = numbers[values[0]].Value;
                    let value1 = numbers[values[1]].Value;

                    // If we're not the lower value, return; that way this won't be double counted.
                    if (number.Value !== value0){
                        return;
                    }

                    counter += value0 * value1;
                }
            })
        })

        return counter.toString();
    }
    
}