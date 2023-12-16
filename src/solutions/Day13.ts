import { IDay } from "../interfaces";
import { Vector2 } from "../dataStructures";

export class Day13 implements IDay {
    protected ParseGrids(input: string): string[][] {
        return input.replace(/\r/g, "").split("\n\n").map(data => data.split("\n"));
    }
    protected FindReflections(startIndex: number, endIndex: number, getValue: (index: number, offset: number)=>string): number {
        let numDifferences = 0;
        let index = startIndex;
        while (index < endIndex) {
            if (getValue(index, 0) !== getValue(index, 1)) {
                numDifferences ++;
            }
            index++;
        }
        
        return numDifferences;
    }
    protected CheckAllReflections(numDifferences: number, reflectionIndices: number[], maxValues: number,
        numInnerValuesToCheck: number, getValue: (reflectionIndex: number, innerIndex: number)=>string): number[]
    {
        let validReflections: number[] = [ ];

        reflectionIndices.forEach(reflectionIndex => {
            let numRowsToCheck = Math.min(reflectionIndex, maxValues - reflectionIndex);
            let totalReflections = 0;
            for (let lineOffset = 0; lineOffset < numRowsToCheck; lineOffset++) {
                let reflections = this.FindReflections(0, numInnerValuesToCheck, (charIndex, offset) => {
                    if (offset === 0) {
                        return getValue(reflectionIndex - lineOffset - 1, charIndex)
                    }
                    return getValue(reflectionIndex + lineOffset, charIndex);
                });
                totalReflections += reflections;
            }
            if (totalReflections === numDifferences) {
                validReflections.push(reflectionIndex);
            }
        })

        return validReflections;
    }
    protected FindReflectionPoints(grid: string[], numDifferences: number): {Vertical: number[], Horizontal: number[]} {
        let horizontalReflections: number[] = [ ];
        let verticalReflections: number[] = [ ];
        
        for (let charIndex = 0; charIndex < grid[0].length - 1; charIndex++) {
            if (this.FindReflections(0, grid.length, (lineNumber, offset)=>grid[lineNumber][charIndex + offset]) <= numDifferences) {
                verticalReflections.push(charIndex + 1);
            }
        }

        for (let lineNumber = 0; lineNumber < grid.length - 1; lineNumber ++) {
            if (this.FindReflections(0, grid[lineNumber].length, (charIndex, offset)=>grid[lineNumber + offset][charIndex]) <= numDifferences) {
                horizontalReflections.push(lineNumber + 1);
            }
        }

        let validHorizontalReflections = this.CheckAllReflections(numDifferences, horizontalReflections, grid.length, grid[0].length, (lineNumber: number, charIndex: number)=>grid[lineNumber][charIndex]);
        let validVerticalReflections = this.CheckAllReflections(numDifferences, verticalReflections, grid[0].length, grid.length, (charIndex: number, lineNumber: number) => grid[lineNumber][charIndex]);

        return {
            Vertical: validVerticalReflections,
            Horizontal: validHorizontalReflections
        };
    }
    protected Solve(input: string, numDifferences: number): number {
        let grids = this.ParseGrids(input);
        let counter = 0;

        grids.forEach((grid, index) => {
            let reflectors = this.FindReflectionPoints(grid, numDifferences);
            if (reflectors.Horizontal[0]){
                counter += reflectors.Horizontal[0] * 100;
            } else {
                counter += reflectors.Vertical[0];
            }
        })
        
        return counter;
    }
    Part1(input: string): string {
        return this.Solve(input, 0).toString();
    }
    Part2(input: string): string {
        return this.Solve(input, 1).toString();
    }    
}