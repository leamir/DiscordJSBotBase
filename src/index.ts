import 'dotenv/config';
import { Events } from 'discord.js';
import { client } from './util';

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);