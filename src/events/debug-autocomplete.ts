import { Events } from "discord.js"
import { EventFileClass, EventType } from "../helpers/fileClasses"
import { logPaths } from "../helpers/logger";
import path from "node:path";
import * as fs from 'node:fs';

export default new EventFileClass(
	Events.InteractionCreate,
	EventType.on,
	async function (interaction) {
		
		if (!interaction.isAutocomplete()) 
			return;

		if (interaction.commandName != 'debug')
			return;

		//TODO: Limit command using database, instead of hardcoding staff
		if (interaction.user.id != '603063797871280139')
			return await interaction.respond([]);

		if (interaction.options.getSubcommand() == 'get-log')
		{
			const focusedOption = interaction.options.getFocused(true);
			if (focusedOption.name == 'category')
			{
				let values = Object.entries(logPaths)
					.map(([key, value]) => value);

				if (focusedOption.value != null)
					values = values.filter(choice => choice.startsWith(focusedOption.value));
				
				await interaction.respond(values.map(choice => ({ name: choice, value: choice })));
			}
			else if (focusedOption.name == 'code')
			{
				const currentCategory = interaction.options.getString('category');
				if (currentCategory == null || !Object.values(logPaths).includes(currentCategory))
					return await interaction.respond([]);
				
				let finalPath = path.join( __dirname, '../../', 'logs', currentCategory);

				if (!fs.existsSync(finalPath))
					return await interaction.respond([]);

				
				let values = fs.readdirSync(finalPath)
					.map(fileName => fileName.replace(/\..+$/, ''));

				if (focusedOption.value != null)
					values = values.filter(choice => choice.startsWith(focusedOption.value));
				
				return await interaction.respond(values.map(choice => ({ name: choice, value: choice })));
			}
		}
	}
)