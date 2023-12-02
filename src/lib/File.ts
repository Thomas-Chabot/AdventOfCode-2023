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

export function GetAbsolutePath(relativePath: string) {
    return `${process.cwd()}\\${relativePath}`;
}

export async function GetExample(day: number, part: number) {
    return (await readFile(`${Paths.Examples}/Day${day}/Part${part}.txt`)).toString();
}
export async function GetTestInput(day: number) {
    return (await readFile(`${Paths.Examples}/Day${day}.txt`)).toString();
}
export async function WriteTestInput(day: number, input: string) {
    let folderPath = GetAbsolutePath(Paths.Input);

    // If the Inputs folder doesn't exist, create it
    CreateFolder(folderPath);

    // Write the file content
    await writeFile(`${folderPath}/Day${day}.txt`, input);
}