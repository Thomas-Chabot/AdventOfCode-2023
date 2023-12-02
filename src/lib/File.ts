import { readFile, writeFile, mkdir} from "fs/promises";
import { Paths } from "../Config.json";

// Creates a folder if it doesn't already exist.
export async function CreateFolder(folderPath: string) {
    try {
        return await mkdir(folderPath);
    } catch (e: any) {
        // Note: If we fail on 'EEXIST', it just means the folder already exists; we can ignore this.
        if (e.code === 'EEXIST') {
            return;
        }
        // Otherwise, escalate the error.
        throw e;
    }
}

// Converts a relative path to the absolute path.
export function GetAbsolutePath(relativePath: string) {
    return `${process.cwd()}\\${relativePath}`;
}

// Reads Example input data from file.
export async function GetExample(day: number, part: number) {
    return (await readFile(`${Paths.Examples}/Day${day}/Part${part}.txt`)).toString();
}
// Reads the Test Input data from a file.
export async function GetTestInput(day: number) {
    return (await readFile(`${Paths.Input}/Day${day}.txt`)).toString();
}
// Writes the Test Input data to a file.
export async function WriteTestInput(day: number, input: string) {
    let folderPath = GetAbsolutePath(Paths.Input);

    // If the Inputs folder doesn't exist, create it
    CreateFolder(folderPath);

    // Write the file content
    await writeFile(`${folderPath}/Day${day}.txt`, input);
}

// Reads a JSON value from the Settings file.
export async function ReadSetting(name: string): Promise<unknown> {
    let stringified = (await readFile(Paths.Settings)).toString();
    let data = JSON.parse(stringified);

    return data[name];
}

// Writes a value into the JSON Settings file.
export async function WriteSetting(name: string, value: unknown) {
    let data: any;
    try {
        let stringified = (await readFile(Paths.Settings)).toString();
        data = JSON.parse(stringified);
    } catch (e) {
        data = {};
    }

    data[name] = value;
    await writeFile(Paths.Settings, JSON.stringify(data, undefined, "\t"));
}