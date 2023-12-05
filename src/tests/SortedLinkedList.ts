import { SortedLinkedList } from "../dataStructures";
import { ITest } from "../interfaces";

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

    let resultArray = linkedList.ToArray();
    let expectedArray = [0, 1, 2, 3, 4, 5, 7, 8];

    // Note: For laziness, comparing this by joining to a string and comparing that.
    console.assert(resultArray.join(",") === expectedArray.join(","), "Result Array is incorrect: %s", resultArray);
    
}