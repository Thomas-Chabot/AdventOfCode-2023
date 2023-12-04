import { IDay } from "../interfaces";

export class Day4 implements IDay {
    protected ScoreCards(cards: string[]): Map<number, number> {
        let cardValues = new Map<number, number>();
        cards.forEach(card => {
            let cardData = card.match(/Card[\ ]*([0-9]+): ([^|]+) \| (.+)$/);
            if (cardData === null) {
                console.warn("Could not find card data for the card: ", card);
                return;
            }

            let [_, cardId, winningNumbersStr, ticketNumbersStr] = cardData;
            let winningNumbers = winningNumbersStr.match(/([0-9]+)/g);
            let ticketNumbers = ticketNumbersStr.match(/([0-9]+)/g);

            // Map the winning numbers into a set
            let winningNumbersSet = new Set(winningNumbers);
            let matchesCount = 0;
            ticketNumbers?.forEach(number => {
                if (winningNumbersSet.has(number)){
                    matchesCount ++;
                }
            });

            cardValues.set(parseInt(cardId), matchesCount);
        })

        return cardValues;
    }
    Part1(input: string): string {
        let cards = input.split("\n");
        let values = this.ScoreCards(cards);
        let total = 0;

        values.forEach(matches => {
            if (matches > 0) {
                total += Math.pow(2, matches - 1);
            }
        });
        return total.toString();
    }
    Part2(input: string): string {
        let cards = input.split("\n");
        let values = this.ScoreCards(cards);
        let multipliers: number[] = [];
        let total = 0;
        
        values.forEach((value, cardId) => {
            let multiplier = multipliers[cardId - 1] || 0;
            for (let i = 0; i < value; i++) {
                let nextCard = cardId + i;
                if (!multipliers[nextCard]) {
                    multipliers[nextCard] = 0;
                }

                multipliers[nextCard] += multiplier + 1;
            }
            total += multiplier + 1;
        })

        return total.toString();
    }
    
}