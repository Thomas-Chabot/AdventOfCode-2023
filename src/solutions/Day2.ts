import { IDay } from "../interfaces";

type Marbles = {
    Red: number;
    Green: number;
    Blue: number;
}

type GameData = {
    IsValid: boolean;
    GameNumber?: number | undefined,
    Minimums?: Marbles
}

export class Day2 implements IDay {
    protected parseSingleDraw(draw: string): Marbles {
        let marblesDrawn = {
            Red: 0,
            Green: 0,
            Blue: 0
        };

        draw.split(", ").forEach(marbleStr => {
            let match = marbleStr.match(/([0-9]+) (red|blue|green)/);
            if (!match){
                throw `Failed to parse string: ${marbleStr}`;
            }

            let numDrawn = match[1];
            let marblesType = match[2];
            switch (marblesType) {
                case "red":
                    marblesDrawn.Red = parseInt(numDrawn);
                    break;
                case "blue":
                    marblesDrawn.Blue = parseInt(numDrawn);
                    break;
                case "green":
                    marblesDrawn.Green = parseInt(numDrawn);
                    break;
                default:
                    throw `Could not parse marble type: ${marblesType}`;
            }
        })

        return marblesDrawn;
    }
    protected parseGame(line: string, criteria: Marbles): GameData {
        let isValidGame = true;

        let matchResult = line.match(/Game ([0-9]+): (.+)/);
        if (matchResult === null) {
            return {
                IsValid: false
            }
        }

        let gameNumber = matchResult[1];
        let allMarbles = matchResult[2];
        let minimums = {
            Red: 0,
            Blue: 0,
            Green: 0
        };

        allMarbles.split("; ").forEach(x => {
            let drawData = this.parseSingleDraw(x);
            if (drawData.Blue > criteria.Blue || drawData.Red > criteria.Red || drawData.Green > criteria.Green) {
                isValidGame = false;
            }
            minimums = {
                Red: Math.max(drawData.Red, minimums.Red),
                Green: Math.max(drawData.Green, minimums.Green),
                Blue: Math.max(drawData.Blue, minimums.Blue)
            };
        });

        return {
            IsValid: isValidGame,
            GameNumber: parseInt(gameNumber),
            Minimums: minimums
        }
    }
    protected Solve(input: string, solver: (game: GameData) => void): void {
        let marbleLimits = {
            Red: 12,
            Green: 13,
            Blue: 14
        }
        input.split("\n").forEach(x => {
            let gameResult = this.parseGame(x, marbleLimits);
            solver(gameResult);
        })
        
    }
    Part1(input: string): string {
        let counter = 0;
        this.Solve(input, (gameResult: GameData) => {
            if (gameResult.IsValid && gameResult.GameNumber) {
                counter += gameResult.GameNumber;
            }
        })
        
        return counter.toString();
    }
    Part2(input: string): string {
        let counter = 0;
        this.Solve(input, (gameResult: GameData) => {
            if (!gameResult.Minimums) {
                throw `Could not find minimums for the game: ${gameResult.GameNumber}`;
            }
            const power = gameResult.Minimums.Red * gameResult.Minimums.Green * gameResult.Minimums.Blue;
            counter += power;
        });
        return counter.toString();
    }
}
