import { IDay } from "../interfaces";
import { LowestCommonMultiple } from "../lib";

type Steps = {[nodeId: string]: string[]};

export class Day8 implements IDay {
    protected BuildSteps(data: string[]): Steps {
        let steps: Steps = { };

        // Map all the data into the nodes map.
        data.forEach(x => {
            let nodeDataMatch = x.match(/^(.+) = \((.+), (.+)\)$/);
            if (nodeDataMatch === null) {
                console.log(`Could not parse: ${x}`);
                return;

            }
            
            let [_, nodeId, leftNodeId, rightNodeId] = nodeDataMatch;
            steps[nodeId] = [leftNodeId, rightNodeId];
        });

        return steps;
    }
    protected CountSteps(directions: string[], steps: Steps, startNode: string, check: (nodeId: string)=>boolean): number {
        let counter = 0;
        let currentNode = startNode;
        while (!check(currentNode)) {
            let direction = directions[counter % directions.length];
            counter ++;

            let arrayIndex = direction === "L" ? 0 : 1;
            currentNode = steps[currentNode][arrayIndex];
        }
        return counter;
    }
    Part1(input: string): string {
        let [directions, _, ...data] = input.replace(/\r/g, "").split("\n");
        let directionsArray = directions.split("");

        let steps = this.BuildSteps(data);
        let result = this.CountSteps(directionsArray, steps, "AAA", (node) => node === "ZZZ");
        return result.toString();
    }
    Part2(input: string): string {
        let [directions, _, ...data] = input.replace(/\r/g, "").split("\n");
        let directionsArray = directions.split("");
        let steps = this.BuildSteps(data);
        
        // NOTE: This one has a trick in the question, that every time we pass the exit point, it's the same number of steps to reach it again.
        // That lets us calculate how many steps we need to reach the exit, and then we know that's how many it's going to take every time.
        // We can calculate that for every one of our start points, then just find the LCM between them
        let loops : number[] = [ ];
        Object.keys(steps).forEach(nodeId => {
            if (nodeId.charAt(nodeId.length - 1) === "A") {
                let stepsCount = this.CountSteps(directionsArray, steps, nodeId, (newNodeId) => newNodeId.charAt(newNodeId.length - 1) === "Z");
                loops.push(stepsCount);
            }
        })

        return LowestCommonMultiple(loops).toString();
    }
    
}