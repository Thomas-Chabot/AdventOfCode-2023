// Fetches the test input for the user from a given day.
export async function FetchInput(dayNumber: number): Promise<string> {
    let result = await fetch(`https://adventofcode.com/2023/day/${dayNumber}/input`, {
        headers: {
            Cookie: `session=${process.env.session}`
        }
    });
    return result.text();
}