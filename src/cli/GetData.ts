import { readFile } from "fs";

function getFileData(pathFromInput: string): Promise<string> {
    return new Promise((fulfill, reject) => {
        readFile(`${process.cwd()}\\..\\data\\${pathFromInput}`, (err, data) => {
            if (err) {
                reject(err);
            } else {
                fulfill(data.toString());
            }
        });
    });
}

export function getExamples(day: number, part: number): Promise<string> {
    return getFileData(`examples\\Day${day}\\Part${part}.txt`);
} 
export function getInput(day: number): Promise<string> {
    return getFileData(`inputs\\Day${day}.txt`);
}