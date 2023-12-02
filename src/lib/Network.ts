import { ReadSetting } from "./File";

// Fetches the test input for the user from a given day.
export async function FetchInput(dayNumber: number): Promise<string> {
    // Retrieve the session token
    let session = "";
    try {
        session = await ReadSetting("Session") as string;
    } catch (e) { }

    // If failed to retrieve, prompt the user to run the Configure command.
    if (session === "") {
        console.error("**** Please run the Configure command to set up your session token. ****");
        throw "Undefined Session Token";
    }

    let result = await fetch(`https://adventofcode.com/2023/day/${dayNumber}/input`, {
        headers: {
            Cookie: `session=${session}`
        }
    });
    
    // Check if the data retrieval failed
    if (result.status === 500) {
        console.error(`Failed to retrieve input data. Please check that the Session cookie is correct.`);
        throw "Could not retrieve test input data.";
    }

    return result.text();
}