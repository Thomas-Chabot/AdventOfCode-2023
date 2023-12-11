import { Vector2 } from "../dataStructures";
import { ITest } from "../interfaces";
import { assert } from "./assert";

export function RunTest(){
    let vector2a = new Vector2(1, 0);
    let vector2b = new Vector2(0, 1);
    let addedVector = vector2a.Add(1, 0);

    assert(!vector2a.Equals(vector2b), "The two vectors should not be equivalent.");
    assert(vector2a.ToString() === "1,0", `Expected stringified value to be 1,0; received ${vector2a.ToString()}`);
    assert(addedVector.Equals(new Vector2(2, 0)), `Add operation failed; received ${addedVector.ToString()}`);

    console.log(`Vector2 Tests Passed.`);
}