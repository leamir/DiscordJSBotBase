import { AttachmentBuilder, Client, GatewayIntentBits } from 'discord.js';
import { logPaths } from './helpers/logger';
import util from 'node:util';

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export async function generateRandomString(
    sections: number = 4,
    maxLength: number = 32,
    validatorFunction?: (str: string) => boolean | Promise<boolean>,
    maxAttempts: number = 10
): Promise<string | null> {
    const generateSection = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < Math.floor((maxLength-sections)/sections); i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const generateString = () => {
        const sectionsArray = [];
        for (let i = 0; i < sections; i++) {
            sectionsArray.push(generateSection());
        }
        return sectionsArray.join('-');
    };

    let attempts = 0;
    while (attempts < maxAttempts) {
        const randomString = generateString();
        if (!validatorFunction || (await validatorFunction(randomString))) {
            return randomString;
        }
        attempts++;
    }
    return null;
}

export async function evaluateAndCaptureOutput(code: string): Promise<AttachmentBuilder> {
    let consoleOutput = '';
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    const captureConsole = (type: 'log' | 'warn' | 'error', ...args: any[]) => {
        consoleOutput += `[${type.toUpperCase()}] ${args.map(arg => util.inspect(arg)).join(' ')}\n`;
    };

    console.log = (...args) => captureConsole('log', ...args);
    console.warn = (...args) => captureConsole('warn', ...args);
    console.error = (...args) => captureConsole('error', ...args);

    let result;
    try {
        result = eval(code);
    } catch (error) {
        result = error;
    }

    result = util.inspect(result);

    // Restore original console methods
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;

    const combinedOutput = `Console Output:\n${consoleOutput}\n\nResult:\n${result}`;
    const buffer = Buffer.from(combinedOutput, 'utf-8');
    return new AttachmentBuilder(buffer, { name: 'output.txt' });
}