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
    Part1(input: string): string {
        let {Seeds, Maps} = this.BuildMaps(input.replace(/\r/g, ""));
        let locations = new SortedLinkedList<number>((a, b) => a - b);

        Seeds.forEach(value => {
            // Walk through every map to map our value
            Maps.forEach(map => {
                value = this.MapValue(value, map);
            });

            // After all the maps, we'll have our location; store this into the locations list
            locations.Add(value);
        })

        if (!locations.Head) {
            return "";
        }
        return locations.Head.toString();
    }
    Part2(input: string): string {
        return "";
    }
    
}