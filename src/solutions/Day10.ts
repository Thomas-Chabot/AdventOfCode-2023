import { IDay } from "../interfaces";
import { Vector2 } from "../dataStructures";

const Directions : {[direction: string]: Vector2} = {
    Up: new Vector2(-1, 0),
    Down: new Vector2(1, 0),
    Left: new Vector2(0, -1),
    Right: new Vector2(0, 1)
};

const DirectionsMap : {[character: string]: Vector2[]} = {
    '|': [Directions.Up, Directions.Down],
    '-': [Directions.Left, Directions.Right],
    'L': [Directions.Up, Directions.Right],
    'J': [Directions.Up, Directions.Left],
    '7': [Directions.Down, Directions.Left],
    'F': [Directions.Down, Directions.Right],
    '.': []
};

type Point = {
    Position: Vector2;
    Distance: number;
}

type Graph = {
    Points: Point[];
    PipeSet: Set<string>;
}

export class Day10 implements IDay {
    protected FindStartPosition(input: string): Vector2 {
        let startLine = input.substring(0, input.indexOf("S")).match(/\n/g)?.length || 0;
        let startPosition = input.split("\n")[startLine].indexOf("S");
        return new Vector2(startLine, startPosition);
    }
    protected FindValidStartPoints(startPosition: Vector2, lines: string[]): Vector2[] {
        let validPoints: Vector2[] = [ ];

        Object.values(Directions).forEach(direction => {
            // Check every surrounding point to see if this is a valid position.
            let point = startPosition.Add(direction.X, direction.Y);
            let value = lines[point.X]?.charAt(point.Y);
            if (!value) {
                return;
            }

            // Find if this point has a connection to the start point;
            // If it does, then we can start our pipe here.
            let directions = DirectionsMap[value];
            for (let direction of directions) {
                let newPoint = point.Add(direction.X, direction.Y);
                if (newPoint.Equals(startPosition)) {
                    validPoints.push(point);
                    return;
                }
            }

            return;
        });

        return validPoints;
    }
    protected BranchOutFrom(startPosition: Vector2, lines: string[]): Graph {
        let points: Point[] = [ ];
        let visitedPoints : Set<string> = new Set<string>();
        visitedPoints.add(startPosition.ToString());
        
        // Find the valid positions that connect to S
        let startPoints = this.FindValidStartPoints(startPosition, lines);

        // Push each of these into the queue of visited points
        startPoints.forEach(x => {
            points.push({
                Position: x,
                Distance: 1
            });
            visitedPoints.add(x.ToString());
        });

        // Go through each of the start points and find valid positions to reach
        for (let index = 0; index < points.length; index++ ){
            // Find the value stored at this point
            let value = lines[points[index].Position.X]?.charAt(points[index].Position.Y);
            if (!value) {
                continue;
            }
            
            // Calculate the directions from the point
            let directions = DirectionsMap[value];
            directions.forEach(direction => {
                let newPoint = points[index].Position.Add(direction.X, direction.Y);
                let value = lines[newPoint.X]?.charAt(newPoint.Y);
                if (visitedPoints.has(newPoint.ToString()) || !value) {
                    return;
                }

                points.push({
                    Position: newPoint,
                    Distance: points[index].Distance + 1
                });
                visitedPoints.add(newPoint.ToString());
            });
        }

        return {
            Points: points,
            PipeSet: visitedPoints
        };
    }
    protected FindPointsInsideCurve(lines: string[], graph: Graph): Vector2[] {
        // Create a 2D grid of spaces in the pipe
        let grid: boolean[][] = []
        lines.forEach((line, lineNumber) => {
            let gridLine: boolean[] = [ ];
            line.split("").forEach((_, characterIndex) => {
                let isInCurve = graph.PipeSet.has(new Vector2(lineNumber, characterIndex).ToString());
                gridLine[characterIndex] = isInCurve;
            })
            grid[lineNumber] = gridLine;
        })

        // Calculate the points inside the curve
        let pointsInsideCurve: Vector2[] = [];
        let insideCurve: Set<string> = new Set<string>();

        // Walk through the grid and calculate all spaces that are inside the pipe.
        // We can tell we're walking inside the pipe because we'll pass by one pointed up.
        // For each of these that we pass, inside pipe gets flipped: yes/no/yes/no/...
        let isInsideCurve = false;
        const validCharacters: Set<string> = new Set<string>(["L", "J", "|"]);
        lines.forEach((line, lineNumber) => {
            line.split("").forEach((character, characterIndex) => {
                // If we're inside the pipe, check to flip the flag.
                if (grid[lineNumber][characterIndex]) {
                    if (validCharacters.has(character)) {
                        isInsideCurve = !isInsideCurve;
                    }
                } else if (isInsideCurve) {
                    // Otherwise, if we're inside the curve, add this point.
                    let position = new Vector2(lineNumber, characterIndex);
                    insideCurve.add(position.ToString());
                    pointsInsideCurve.push(position);
                }
            })
        });

        return pointsInsideCurve;
    }
    Part1(input: string): string {
        input = input.replace(/\r/g, "");
        let lines = input.split("\n");

        let startPosition = this.FindStartPosition(input);
        let points = this.BranchOutFrom(startPosition, lines).Points;
        return points[points.length - 1].Distance.toString();
    }
    Part2(input: string): string {
        input = input.replace(/\r/g, "");
        let lines = input.split("\n");

        let startPosition = this.FindStartPosition(input);
        let graph = this.BranchOutFrom(startPosition, lines);
        /*graph.Points.push({
            Position: startPosition,
            Distance: 0
        });*/

        let pointsInsideCurve = this.FindPointsInsideCurve(lines, graph);
        return pointsInsideCurve.length.toString();
    }
    
}