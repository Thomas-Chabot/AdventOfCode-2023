export function assert(assertion: boolean, message: string) {
    if (assertion === false) {
        throw message;
    }
}
