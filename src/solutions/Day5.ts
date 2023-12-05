import { IDay } from "../interfaces";
import { SortedLinkedList } from "../dataStructures";

type Data = {
    SourceStart: number;
    DestinationStart: number;
    Length: number;
}
type MapperResult = {
    Seeds: number[],
    Maps: Data[][]
};

export class Day5 implements IDay {
    protected ParseNumbers(str: string): number[] {
        let numberMatches = str.match(/[0-9]+/g);
        let numbers: number[] = [ ];
        numberMatches?.forEach(num => {
            numbers.push(parseInt(num));
        })
        return numbers;
    }
    protected ParseConverters(mapData: string): Data[] {
        let linkedList = new SortedLinkedList<Data>((a, b) => {
            return a.SourceStart - b.SourceStart
        });

        let mappers = mapData.split("\n");
        mappers.forEach(x => {
            let numbers = this.ParseNumbers(x);
            if (numbers.length !== 3) {
                console.warn("Could not parse numbers for ", x);
                return;
            }

            linkedList.Add({
                SourceStart: numbers[1],
                DestinationStart: numbers[0],
                Length: numbers[2]
            });
        })

        return linkedList.ToArray();
    }
    protected BuildMaps(input: string): MapperResult {
        let mappingData = input.split("\n\n");
        let seeds = "";
        let maps: Data[][] = [];
        mappingData.forEach((data, index) => {
            if (data.trim() === "") {
                return;
            }

            let result = data.match(/:([\S\s]+)/);
            if (result === null) {
                console.warn(`Could not find match for ${data}`);
                return;
            }

            let mapData = result[1].trim();
            if (index === 0) {
                seeds = mapData;
                return;
            }

            let map = this.ParseConverters(mapData);
            maps.push(map);
        });

        return {
            Maps: maps,
            Seeds: this.ParseNumbers(seeds)
        };
    }
    protected MapValue(startValue: number, maps: Data[]): number {
        for (let i = 0; i < maps.length; i++) {
            // If we ever reach a point where our start value is less than the map start value,
            // it means our value isn't in the map, which will keep it at the same value.
            if (startValue < maps[i].SourceStart) {
                return startValue;
            }

            // Otherwise, check if our value is within this range.
            if (startValue < maps[i].SourceStart + maps[i].Length) {
                // If it is, then we map it against the Destination value.
                let distance = startValue - maps[i].SourceStart;
                return maps[i].DestinationStart + distance;
            }
        }

        // If we go through the entire list and don't find a matching value, then there's no match;
        // Return just a 1-to-1 mapping of keeping the same value.
        return startValue;
    }
    protected GetLocationValue(seed: number, maps: Data[][]): number {
        let value = seed;

        // Walk through every map to map our value
        maps.forEach(map => {
            value = this.MapValue(value, map);
        });
        
        return value;
    }
    Part1(input: string): string {
        let {Seeds, Maps} = this.BuildMaps(input.replace(/\r/g, ""));
        let lowest: number = 9e9;

        Seeds.forEach(seed => {
            let value = this.GetLocationValue(seed, Maps);
            if (value < lowest) {
                lowest = value;
            }
        })

        return lowest.toString();
    }
    Part2(input: string): string {
        let {Seeds, Maps} = this.BuildMaps(input.replace(/\r/g, ""));
        let lowest = 9e9;

        // This is bruteforced, bad
        for (let i = 0; i < Seeds.length; i+=2) {
            for (let seed = Seeds[i]; seed <= seed + Seeds[i + 1]; seed++) {
                let value = this.GetLocationValue(seed, Maps);
                if (value < lowest) {
                    lowest = value;
                }
            }
        }

        return lowest.toString();
    }
    
}