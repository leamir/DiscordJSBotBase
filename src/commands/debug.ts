import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { commandFileClass } from "../helpers/fileClasses";
import path from "node:path";
import fs from "node:fs";

export default new commandFileClass(
	new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Uso restrito do desenvolvedores')
		.setDMPermission(true)
		.setDefaultMemberPermissions(0)
		.addSubcommand(subcommand =>
			subcommand
				.setName('eval')
				.setDescription('Roda um código JS arbitrário no bot')
		)
		.addSubcommand(subcommand => 
			subcommand
				.setName('get-log')
				.setDescription("Receber informações de um log")
				.addStringOption(option =>
					option
						.setName('category')
						.setDescription('Categoria do log')
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addStringOption(option =>
					option
						.setName('code')
						.setDescription('Código do log')
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addBooleanOption(option =>
					option
						.setName('send-chat')
						.setDescription("Enviar log no chat de forma publica?")
				)
		),
	(interaction) => {
		//TODO: Limit command using database, instead of hardcoding staff
		if (interaction.user.id != '603063797871280139')
		{
			const responseEmbed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setTitle('Sem permissão!')
				.setDescription('Você precisa ser um desenvolvedor do bot para utilizar este comando')
			
			interaction.reply({ content: '', embeds: [responseEmbed], ephemeral: true });
			return;    
		}

		if (interaction.options.getSubcommand() == 'eval')
			return processEvalCommand(interaction);
		else if (interaction.options.getSubcommand() == 'get-log')
			return processLogFetch(interaction); 
	}
);


async function processLogFetch(interaction: ChatInputCommandInteraction)
{
	const sendChat = !(interaction.options.getBoolean('send-chat') || false);

	const category = interaction.options.getString('category');
	const code = interaction.options.getString('code');

	if (category == null || code == null)
		return;

	let finalPath = path.join( __dirname, '../../', 'logs', category, code) + '.txt';

	if (!fs.existsSync(finalPath))
		return await interaction.reply({ content: `O código de erro do erro \`${category}/${code}\` não foi encontrado.`, ephemeral: sendChat });

	await interaction.reply({ content: `Informações do erro \`${category}/${code}\`:`, ephemeral: sendChat, files: [finalPath] });
}

async function processEvalCommand(interaction: ChatInputCommandInteraction)
{
	const responseModal = new ModalBuilder()
		.setCustomId('interaction-response-debug-eval')
		.setTitle("Evaluate expression")
	
	const codeInput = new TextInputBuilder()
		.setCustomId('code')
		.setLabel("What's the code that you want to evaluete?")
		.setStyle(TextInputStyle.Paragraph)

	const responseActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(codeInput);

	responseModal.addComponents(responseActionRow);

	await interaction.showModal(responseModal);
	//TODO: Implement
}
