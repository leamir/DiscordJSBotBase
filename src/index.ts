import 'dotenv/config';
import { client } from './util';
import * as fs from 'node:fs';
import { EventFileClass, EventType } from './helpers/fileClasses';

const eventFiles = 
	fs.readdirSync('./out/events')
		.filter((fileName) => fileName.endsWith('.js'))
		.map((fileName) => fileName = `./events/${fileName}` );

eventFiles.forEach(async (filePath) => {
	
	try {
		const eventData = (await import(filePath)).default.default as EventFileClass<any>;

		if (eventData.onLoad)
			eventData.onLoad();

		if (eventData.EventType == EventType.on)
			client.on(eventData.eventName, eventData.onRun);
		else
			client.once(eventData.eventName, eventData.onRun);
	}
	catch(e) {
		console.log(`[ERR] Can't load event file '${filePath}'\n`, (e as any).stack);
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);