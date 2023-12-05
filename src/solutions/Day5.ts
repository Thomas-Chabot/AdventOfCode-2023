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
            for (let seed = Seeds[i]; seed <= Seeds[i] + Seeds[i + 1]; seed++) {
                let value = this.GetLocationValue(seed, Maps);
                if (value < lowest) {
                    lowest = value;
                }
            }
        }

        return lowest.toString();
    }
    

    /*
        The Brute Force solution was fast enough to solve this one, so I haven't bothered to go through to implement a faster solution.
        However, a potential improvement would be something along the lines of:

        The bottom, locations, is a regular number line. It goes from 0 to infinity.
        The next level up, humidity, will become a new number line. This one gets scrambled by the conversions that we need to take it to each location.

        For example, assume we have the humidity-to-location mappings:
            1 2 1
            4 1 1
            3 6 4

            Then we can take our location number line:
                1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10
            And apply our conversions to it:
                1 2 1 means we map from source 2 to desination 1; this will change the 2 in our number line to instead be a 1.
                1 - 1 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10
            
                4 1 1 means that from our humidity number line, point 1 will map to point 4.
                4 - 1 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10

                3 6 4 maps four numbers, starting from 6, up to 9, to the destination numbers 3 to 7.
                4 - 1 - 3 - 4 - 5 - 3 - 4 - 5 - 6 - 10

                This gives us the new number line 4 - 1 - 3 - 4 - 5 - 3 - 4 - 5 - 6 - 10.

        Assume we then have a mapping from temperature-to-humidity, where temperature 5 maps to humidity 1.
            We now have the updated humidity number line, which points temperatures to where they land in locations. That means that:
            Temperature 5 points to Humidity 1.
            Humidity 1 was pointing to Location 4.

            Now, Temperature 5 can be set to Location 4, giving us its new number line of:
                1 - 2 - 3 - 4 - 4 - 6 - 7 - 8 - 9 - 10 - ...
            
            And we can keep walking up the chain, line-by-line, to figure out how each level maps to locations.

        At the top of the chain, after we've gone through all the groups, we'll have a new number line that corresponds to the lowest locations.
        Then we can just go through our inputs, and check for matches between our updated number line and the seed values.

        Assume we have seeds 13, 3, 2, 7.
        That means we have seeds between 2 - 8 and 13 - 15.
        We can walk through our number line to look for the first number that falls between these ranges, and then we stop once we find that number.

        I haven't bothered to program any of it, or calculate the efficiency of it. But I believe it would be faster than the bruteforce technique.
    */
}