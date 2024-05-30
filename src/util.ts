import { Client, GatewayIntentBits } from 'discord.js';
import { logPaths } from './helpers/logger';

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
