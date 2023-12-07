/*
    Day 7 is about Camel Cards, which is a similar idea to poker.
    Given many hands of cards, sort the cards into rank order, where rank is determined by the value of the hand.
*/

import { IDay } from "../interfaces";

type Hand = {
    Cards: string[],
    Values: number[],
    Bid: number
}

const CardValues: {[key: string]: number} = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    ["9"]: 9,
    ["8"]: 8,
    ["7"]: 7,
    ["6"]: 6,
    ["5"]: 5,
    ["4"]: 4,
    ["3"]: 3,
    ["2"]: 2
}
const GetCardValue = (card: string, hasWildcard: boolean) => {
    // Note: If we're using wildcards, then the J becomes worth less than any other card.
    if (card === "J" && hasWildcard) {
        return 1;
    }
    // Otherwise, we can just use the CardValues map.
    return CardValues[card] || 0;
}

export class Day7 implements IDay {
    protected ParseCardType(hand: string[], hasWildcard: boolean): number[] {
        let matches = [ ];

        // Note: We can't start on a wildcard. Keep moving forward until we're not at one.
        let startPosition = 0;
        while (hasWildcard && startPosition < hand.length && hand[startPosition] === "J") {
            startPosition ++;
        }

        // Note: If the entire card is just a wildcard, then we can exit here with just returning that value.
        if (startPosition === hand.length) {
            return [hand.length];
        }

        // Starting from our current position, walk through the rest of the hand.
        let prev = hand[startPosition];
        let counter = 1;
        let numWildcards = startPosition;
        for (let i = startPosition + 1; i < hand.length; i++) {
            // If we're at a wildcard, we should just include this number for later.
            // Otherwise, check if we have the same value; if we do, we can increment the counter,
            // If not, switch to a new counter.
            if (hasWildcard && hand[i] === "J"){
                numWildcards ++;
            } else if (hand[i] === prev) {
                counter ++;
            } else {
                matches.push(counter);
                counter = 1;
                prev = hand[i];
            }
        }

        // Push in the counter for any remaining values from the end of the card.
        matches.push(counter);

        // Sort the values, so that the highest is at the front, then add the wildcards to this counter.
        matches.sort((a, b) => b - a);
        matches[0] += numWildcards;

        return matches;
    }
    protected SortHands(hands: Hand[], hasWildcard: boolean) {
        hands.sort((hand1, hand2) => {
            // First check is based on how many different types are in the hand.
            // This is nice because we can check by length; two pairs means we have three separate types, for example.
            if (hand1.Values.length < hand2.Values.length) {
                return 1;
            }
            if (hand2.Values.length < hand1.Values.length) {
                return -1;
            }

            // If the two lengths match, that means they're close in class - three-of-a-kind vs. two pairs, or something similar.
            // We can compare those by checking the first value: three-of-a-kind would start with 3, two pairs would start with 2.
            if (hand1.Values[0] < hand2.Values[0]) {
                return -1;
            }
            if (hand2.Values[0] < hand1.Values[0]) {
                return 1;
            }

            // In this case the two are equal, so we need to compare by card value.
            for (let i = 0; i < hand1.Cards.length; i++) {
                let cardValue1 = GetCardValue(hand1.Cards[i], hasWildcard);
                let cardValue2 = GetCardValue(hand2.Cards[i], hasWildcard);
                if (cardValue1 < cardValue2) {
                    return -1;
                }
                if (cardValue2 < cardValue1) {
                    return 1;
                }
            }

            return 0;
        });
    }
    protected PlayGame(input: string, hasWildcard: boolean): string {
        let inputHands = input.replace(/\r/g, "").split("\n");
        let hands: Hand[] = [];

        // Run through every hand one-by-one to create our Hands array.
        inputHands.forEach(handData => {
            let match = handData.match(/(^.+) (.+$)/);
            if (match === null) {
                console.log(`Could not parse hand data: ${handData}`);
                return;
            }

            let [_, hand, bid] = match;
            let cards = hand.split("");

            // Sort the hand so that everything is in order.
            cards.sort((a, b) => CardValues[a] - CardValues[b]);

            // Figure out the values for this hand type.
            let values = this.ParseCardType(cards, hasWildcard);

            // Add the hand into our list of hands
            hands.push({
                Cards: hand.split(""),
                Values: values,
                Bid: parseInt(bid)
            });
        })

        // Now that we've created all our hands, we can sort them into order by their value.
        this.SortHands(hands, hasWildcard);

        // And now that everything is sorted, we can find the value by multiplying rank by bid
        let total = 0;
        hands.forEach((handData, index) => {
            total += (index + 1) * handData.Bid;
        })
        
        return total.toString();
    }
    Part1(input: string): string {
        return this.PlayGame(input, false);
    }
    Part2(input: string): string {
        return this.PlayGame(input, true);
    }
    
}