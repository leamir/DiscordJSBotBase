import 'dotenv/config';
import { Events } from 'discord.js';
import { client } from './util';
import * as fs from 'node:fs';
import { eventFileClass, eventType } from './helpers/fileClasses';

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const eventFiles = fs.readdirSync('./out/events').filter((fileName) => fileName.endsWith('.js')).map((fileName) => fileName = `./out/${fileName}`);
eventFiles.forEach(async (filePath) => {
	const eventData = (await import(filePath)) as eventFileClass;

	if (eventData.eventType == eventType.on)
		client.on(eventData.eventName, eventData.onRun);
	else
		client.once(eventData.eventName, eventData.onRun);
});

client.login(process.env.DISCORD_BOT_TOKEN);