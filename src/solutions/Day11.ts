import { BFS, Node } from "../algorithms";
import { Vector2 } from "../dataStructures";
import { IDay } from "../interfaces";

type Universe = {
    Galaxies: Vector2[];
    BlankRows: Set<number>;
    BlankColumns: Set<number>;
}

const Directions = [new Vector2(0, 1), new Vector2(0, -1), new Vector2(1, 0), new Vector2(-1, 0)];

export class Day11 implements IDay {
    protected ParseInput(lines: string[]): Universe {
        let galaxies: Vector2[] = [];
        let occupiedColumns = new Set<number>();
        let blankRows: Set<number> = new Set<number>();
        let blankColumns: Set<number> = new Set<number>();

        // Find the coordinates of all galaxies
        lines.forEach((line, lineNumber) => {
            let hasGalaxy = false;
            line.split("").forEach((character, characterIndex) => {
                if (character === "#") {
                    galaxies.push(new Vector2(lineNumber, characterIndex));
                    occupiedColumns.add(characterIndex);
                    hasGalaxy = true;
                }
            });

            // If we don't have any galaxies in the row, store it as an empty row
            if (!hasGalaxy) {
                blankRows.add(lineNumber);
            }
        });

        // Build in all the blank columns - these are any columns that don't have galaxies
        for (let i = 0; i < lines[0].length; i++) {
            if (!occupiedColumns.has(i)) {
                blankColumns.add(i);
            }
        }

        return {
            Galaxies: galaxies,
            BlankColumns: blankColumns,
            BlankRows: blankRows
        };
    }
    protected FindClosestPaths(expansionFactor: number, fromGalaxy: Vector2, universe: Universe, lines: string[]) {
        let fromGalaxyId: number;
        let distances = new Map<number, number>();
        let galaxiesFound = 0;

        // Build up Galaxy Positions -> ID map
        let galaxies = new Map<string, number>();
        universe.Galaxies.forEach((galaxy, id) => {
            galaxies.set(galaxy.ToString(), id);
            if (galaxy.Equals(fromGalaxy)){
                fromGalaxyId = id;
            }
        })

        // Build out the nodes
        let characters = lines.map(x => x.split(""));
        let nodes = BFS(fromGalaxy, characters, {
            CheckNode: (node: Node) => {
                // Check if we've found a galaxy
                let galaxyId = galaxies.get(node.Position.ToString());
                if (galaxyId !== undefined) {
                    distances.set(galaxyId, node.Distance);
                    galaxiesFound ++;
                }

                // Exit once we've found all nodes
                return galaxiesFound !== universe.Galaxies.length;
            },
            GetDistance: (node: Node, direction: Vector2) => {
                let isDoubled = false;

                // Check if distance is doubled
                if (direction.X !== 0) {
                    let newX = node.Position.X + direction.X;
                    isDoubled = universe.BlankRows.has(newX);
                } else {
                    let newY = node.Position.Y + direction.Y;
                    isDoubled = universe.BlankColumns.has(newY);
                }

                let addedDistance = isDoubled ? expansionFactor : 1;
                return node.Distance + addedDistance;
            }
        });

        return distances;
    }
    protected Solve(input: string, expansionFactor: number) {
        let lines = input.replace(/\r/g, "").split("\n");
        let universe = this.ParseInput(lines);
        let totalDistance = 0;

        // Go through every galaxy to find the distances to every other galaxy
        for (let index = 0; index < universe.Galaxies.length; index++) {
            let distances = this.FindClosestPaths(expansionFactor, universe.Galaxies[index], universe, lines);
            distances.forEach(x => {
                totalDistance += x;
            })
        }
        
        // Divide the total distance by 2 here because every galaxy is double counted.
        // eg. We count (1, 7) as separate from (7, 1).
        return totalDistance / 2;
    }
    Part1(input: string): string {
        return this.Solve(input, 2).toString();
    }
    Part2(input: string): string {
        return this.Solve(input, 1000000).toString();
    }
    
}