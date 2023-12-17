import { Vector2 } from "../dataStructures";
import { IDay } from "../interfaces";

class Beam {
    Position: Vector2;
    Direction: Vector2;

    constructor(position: Vector2, direction: Vector2) {
        this.Position = position;
        this.Direction = direction;
    }
    Next(): Beam { 
        return new Beam(this.Position.Add(this.Direction.X, this.Direction.Y), this.Direction);
    }
    BranchOff(): Beam[] {
        return [
            new Beam(this.Position, new Vector2(this.Direction.Y, -this.Direction.X)),
            new Beam(this.Position, new Vector2(-this.Direction.Y, this.Direction.X))
        ];
    }
    RotateForwards(): Beam {
        let direction = new Vector2(-this.Direction.Y, -this.Direction.X);
        return new Beam(this.Position.Add(direction.X, direction.Y), direction);
    }
    RotateBackwards(): Beam {
        let direction = new Vector2(this.Direction.Y, this.Direction.X);
        return new Beam(this.Position.Add(direction.X, direction.Y), direction);
    }
    ToString(): string {
        return `${this.Position.ToString()}, ${this.Direction.ToString()}`
    }
}

export class Day16 implements IDay {
    protected LogBeams(grid: string[][], beams: Beam[]) {
        // Create a clone of the grid
        let input = grid.map(line => line.join("")).join("\n");
        let clonedGrid = input.split("\n").map(x => x.split(""));

        // Overwrite the values by the beams
        beams.forEach(beam => {
            let line = grid[beam.Position.Y];
            let character = line && line[beam.Position.X];
            if (character === undefined) {
                return;
            }

            /*let newCharacter = "";
            if (character === "^" || character === "V" || character === "<" || character === ">") {
                newCharacter = "2";
            } else if (!isNaN(parseInt(character))) {
                newCharacter = (parseInt(character) + 1).toString();
            } else {
                let directionStr = "";
                if (beam.Direction.X === 1) {
                    directionStr = ">";
                } else if (beam.Direction.X === -1) {
                    directionStr = "<";
                } else if (beam.Direction.Y === 1) {
                    directionStr = "V";
                } else {
                    directionStr = "^";
                }
                newCharacter = directionStr;
            }*/
            let newCharacter = "#";
            clonedGrid[beam.Position.Y][beam.Position.X] = newCharacter;
        })

        let clonedStr = clonedGrid.map(x => x.join("")).join("\n");
        console.log(clonedStr);
    }
    protected CountEnergizedCells(grid: string[][], beams: Beam[]) {
        let counted = new Set<string>();
        let total = 0;
        beams.forEach(beam => {
            let line = grid[beam.Position.Y];
            let character = line && line[beam.Position.X];
            if (character === undefined) {
                return;
            }

            if (counted.has(beam.Position.ToString())) {
                return;
            }

            counted.add(beam.Position.ToString());
            total ++;
        });
        return total;
    }

    protected Energize(origin: Beam, input: string): number {
        let grid = input.replace(/\r/g, "").split("\n").map(line => line.split(""));

        let beams: Beam[] = [origin];
        let visited = new Set<string>();

        let index = 0;
        while (index < beams.length) {
            let beam = beams[index];
            index++;

            let line = grid[beam.Position.Y];
            let character = line && line[beam.Position.X];
            if (character === undefined) {
                continue;
            }
            

            let beamString = beam.ToString();
            if (visited.has(beamString)) {
                continue;
            }
            visited.add(beamString);

            switch(character){
                case ".":
                    beams.push(beam.Next());
                    break;
                case "|":
                    if (beam.Direction.X === 0) {
                        beams.push(beam.Next())
                    } else {
                        beams.push(...beam.BranchOff());
                    }
                    break;
                case "-":
                    if (beam.Direction.Y === 0) {
                        beams.push(beam.Next());
                    } else {
                        beams.push(...beam.BranchOff());
                    }
                    break;
                case "/":
                    beams.push(beam.RotateForwards());
                    break;
                case "\\":
                    beams.push(beam.RotateBackwards());
                    break;
                default:
                    console.error(`Could not identify character: ${character}`);
                    break;
            }
        }

        return this.CountEnergizedCells(grid, beams);
    }
    Part1(input: string): string {
        let origin = new Beam(new Vector2(0, 0), new Vector2(1, 0));
        let result = this.Energize(origin, input);

        return result.toString();
    }
    Part2(input: string): string {
        let grid = input.replace(/\r/g, "").split("\n").map(line => line.split(""));
        let maxEnergized = 0;

        for (let col = 0; col < grid[0].length; col++) {
            let downBeam = new Beam(new Vector2(col, 0), new Vector2(0, 1));
            let upBeam = new Beam(new Vector2(col, grid.length - 1), new Vector2(0, -1));

            let downCells = this.Energize(downBeam, input);
            let upCells = this.Energize(upBeam, input);
            
            maxEnergized = Math.max(maxEnergized, downCells, upCells);
        }

        for (let row = 0; row < grid.length; row++) {
            let rightBeam = new Beam(new Vector2(0, row), new Vector2(1, 0));
            let leftBeam = new Beam(new Vector2(grid[0].length - 1, row), new Vector2(-1, 0));

            let rightCells = this.Energize(rightBeam, input);
            let leftCells = this.Energize(leftBeam, input);

            maxEnergized = Math.max(maxEnergized, rightCells, leftCells);
        }

        return maxEnergized.toString();
    }
    
}