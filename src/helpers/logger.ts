import * as fs from 'node:fs';
import * as path from 'node:path';
import { generateRandomString } from '../util';

export enum LogTypes {
    COMMAND_ERRORS
}

type LogPathsType = {
    [key in LogTypes]: string;
};

export const logPaths: LogPathsType = { // Logs paths are inside the 'logs' folder
    [LogTypes.COMMAND_ERRORS]: "commands"
};

export async function writeLog(type: LogTypes, message: string) {
    function logExists(codeAttempt: string) {
        let filePath = "file://" + path.join(__dirname, '..\\..\\', 'logs', logPaths[type], codeAttempt) + '.txt';

        return (!fs.existsSync(filePath));
    }
    let logCode = await generateRandomString(4, 32, logExists, 25);

    if (logCode == null)
        throw new Error(`Cannot generate log identifier for ${type}.\nLog message: "${message}"`);

    let finalPath = path.join( __dirname, '../../', 'logs', logPaths[type], logCode) + '.txt';

    const directory = path.dirname(finalPath);
    
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(finalPath, message);

    return `${logPaths[type]}/${logCode}`;
}