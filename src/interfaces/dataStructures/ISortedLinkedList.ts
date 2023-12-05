export interface ISortedLinkedList<T> {
    Head: T | undefined;
    Add(data: T): void;
    ToArray(): T[];
}