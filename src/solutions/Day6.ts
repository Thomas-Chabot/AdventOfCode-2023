/*
    Implements Day 6 solution.

    A pattern to notice here is that this is a curve.
    At the beginning, every second held will increase the calculated value, until you reach the peak.
    After the peak, every additional second will cost more in how long you have remaining, meaning the next value will be lower.

    So the solution here is just to find these two peak values:
        Starting from 0, find the first value that brings us to our target - this is where holding the button gives us a fast enough speed to reach our distance.
        Starting from the end, find the last value that brings us to our target - this is where we've got enough time to reach the target distance.
        Every value between these two will be within the target range.
*/

import { IDay } from "../interfaces";

export class Day6 implements IDay {
    Calculate(timeHeld: number, totalTime: number) {
        // Speed is calculated at 1ms/second for timeHeld seconds.
        // Distance is speed * (totalTime - timeHeld)
        return timeHeld * (totalTime - timeHeld);
    }
    FindFirstMatch(distance: number, time: number, increments: boolean) {
        // I'm curious if this is cleaner than just having two loops. Hmm.
        // Idea is to keep it within the time range, and find the first value that brings us to our target distance.
        let secondsHeld = increments ? 0 : time;
        while (secondsHeld <= time && secondsHeld >= 0 && this.Calculate(secondsHeld, time) <= distance) {
            secondsHeld += increments ? 1 : -1;
        }
        return secondsHeld;
    }
    FindCurveDistance(distance: number, time: number) {
        let start = this.FindFirstMatch(distance, time, true);
        let end = this.FindFirstMatch(distance, time, false);

        return end - start + 1;
    }

    Part1(input: string): string {
        let [times, distances] = input.split("\n").map(x => x.match(/[0-9]+/g)?.map(n => parseInt(n)));
        if (!times || !distances) {
            throw `Could not parse input: ${input}`
        }

        // Go through all the values to find our curve
        // The curve distance gets multiplied together to get our final result.
        let counter = 1;
        for (let i = 0; i < times.length; i++) {
            let value = this.FindCurveDistance(distances[i], times[i]);
            counter *= value;
        }

        return counter.toString();
    }
    Part2(input: string): string {
        let [time, distance] = input.split("\n").map(x => x.match(/[0-9]+/g)?.join(""));
        if (!distance || !time) {
            throw `Could not parse input: ${input}`;
        }

        // This only has one curve; calculate the size of this curve.
        return this.FindCurveDistance(parseInt(distance), parseInt(time)).toString();
    }
    
}