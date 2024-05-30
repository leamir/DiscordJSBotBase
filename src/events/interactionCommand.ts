import { CommandInteraction, EmbedBuilder, REST, Routes } from "discord.js";
import { commandFileClass, EventFileClass, EventType } from "../helpers/fileClasses";
import * as fs from "node:fs";
import * as path from "node:path";
import { EventEmitter } from "node:events";
import { LogTypes, writeLog } from "../helpers/logger";

const commandEventEmitter = new EventEmitter();

export default new EventFileClass(
	'interactionCreate',
	EventType.on,
	async function (interaction) {
		if (!interaction.isChatInputCommand())
			return;

		if (commandEventEmitter.listenerCount(interaction.commandName) == 0) {
			let logCode = await writeLog(LogTypes.COMMAND_ERRORS, (new Error(`Command ${interaction.commandName} isn't implemented.\n\LEAMIR_CMD_ERR_NOT_IMPLEMENTED`).stack) as string);
			const embed = new EmbedBuilder()
				.setTitle("Oh não!")
				.setDescription(`Ocorreu um erro na execução deste comando.\nTente novamente mais tarde.\n\nPara pedir suporte, inclua o código \`${logCode}\` na sua mensagem.`)
				.setColor("#FF0000")
				.setTimestamp()
				.setFooter(
					{
						text: "Código de erro legível: LEAMIR_CMD_ERR_NOT_IMPLEMENTED"
					}
				);

			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		commandEventEmitter.emit(interaction.commandName, interaction);
		
	},
	async function () {
		const commandsFiles =
			fs.readdirSync("./out/commands")
				.filter((file) => file.endsWith('.js'))
				.map((fileName) => fileName = `../commands/${fileName}`);;

		let builders = [];

		for (let filePath of commandsFiles) {
			const eventData = (await import('file://' + path.join(__dirname, filePath))).default.default as commandFileClass;

			builders.push(eventData.cmdConstructor.toJSON());

			if (eventData.onLoad)
				eventData.onLoad();

			commandEventEmitter.on(eventData.cmdConstructor.name, (args) => { eventData.onRun(args); });
		}

		let commandArgs = process.argv.slice(2).map(arg => arg.toLowerCase()); 
		if (commandArgs.includes('--registercommands'))
		{
			if (process.env.TESTS_GUILD_ID == undefined) {
				console.error("Environment TESTS_GUILD_ID is not set.");
				return;
			}
			const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN || '');
			try {
				console.log(`Started refreshing ${builders.length} application (/) commands on tests guild.`);
		
				const data = await rest.put(
					Routes.applicationGuildCommands(process.env.DISCORD_APP_CLIENT_ID || '', process.env.TESTS_GUILD_ID),
					{ body: builders },
				) as any;
		
				console.log(`Successfully reloaded ${data.length} application (/) commands on tests guild.`);
			} catch (error) {
				console.error(error);
			}
		}
		if (commandArgs.includes('--registerglobalcommands'))
		{
			const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN || '');
			try {
				console.log(`Started refreshing ${builders.length} application (/) commands.`);
		
				const data = await rest.put(
					Routes.applicationCommands(process.env.DISCORD_APP_CLIENT_ID || ''),
					{ body: builders },
				) as any;
		
				console.log(`Successfully reloaded ${data.length} application (/) commands.`);
			} catch (error) {
				console.error(error);
			}
		}
	}
);
