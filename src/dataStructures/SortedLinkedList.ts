import { ISortedLinkedList } from "../interfaces";

type Node<T> = {
    Data: T;
    Next?: Node<T> | undefined;
}

// A Sorted Linked List.
export class SortedLinkedList<T> implements ISortedLinkedList<T> {
    private head: Node<T> | undefined;
    private compare: (value1: T, value2: T) => number;

    // Creates a new linked list. Takes in the comparator function, which compares two values,
    // and retuns a value of:
    //   -X -> The first value is less than the second value.
    //   0  -> The two values are equal.
    //   +X -> The first value is greater than the second value.
    constructor(comparator: (value1: T, value2: T) => number) {
        this.compare = comparator;
    }

    // Adds data into the linked list, in sorted order.
    Add(data: T): void {
        let newNode: Node<T> = {
            Data: data
        };

        // Walk through the list to find the right spot to add the new node
        let previousNode = undefined;
        let nextNode = this.head;
        while (nextNode !== undefined && this.compare(data, nextNode.Data) > 0) {
            previousNode = nextNode;
            nextNode = nextNode.Next;
        }

        // Check if we're replacing the head element
        if (nextNode === this.head) {
            newNode.Next = this.head;
            this.head = newNode;
        } else {
            // If not, check if we need to update a previous node's nextNode reference
            if (previousNode !== undefined) {
                previousNode.Next = newNode;
            }

            // And update our next node
            newNode.Next = nextNode;
        }
    }

    // Converts the LinkedList into an array.
    ToArray(): T[] {
        let results: T[] = [];
        let node = this.head;
        while (node !== undefined) {
            results.push(node.Data);
            node = node.Next;
        }
        return results;
    }
    
}