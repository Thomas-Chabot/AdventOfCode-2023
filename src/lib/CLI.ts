/*
This file controls the Command-Line Interface, allowing the program to read user input.
*/
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export function PromptUser(query: string): Promise<string> {
    return new Promise(function(resolve) {
        rl.question(`${query}  `, (str: string) => {
            resolve(str);
        });
    });
}

export function QuitPrompt(){
    rl.close();
}

rl.on('close', () => process.exit(0));