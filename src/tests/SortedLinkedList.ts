import { SortedLinkedList } from "../dataStructures";
import { ITest } from "../interfaces";
import { assert } from "./assert";

export function RunTest(){
    let linkedList = new SortedLinkedList<number>((a, b) => a - b);
    linkedList.Add(1);
    linkedList.Add(3);
    linkedList.Add(5);
    linkedList.Add(2);
    linkedList.Add(4);
    linkedList.Add(0);
    linkedList.Add(8);
    linkedList.Add(7);

    let resultArray = linkedList.ToArray().join(",");
    let expectedArray = [0, 1, 2, 3, 4, 5, 7, 8];

    // Head should be 0.
    assert(linkedList.Head === 0, `Linked List Head has incorrect value: ${linkedList.Head}.`);

    // Note: For laziness, comparing this by joining to a string and comparing that.
    assert(resultArray === expectedArray.join(","), `Result Array is incorrect: ${resultArray}`);

    console.log("Sorted Linked List tests passed.");
}