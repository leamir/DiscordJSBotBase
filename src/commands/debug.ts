import { ActionRowBuilder, AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { commandFileClass } from "../helpers/fileClasses";
import path from "node:path";
import fs from "node:fs";
import { LogTypes, writeLog } from "../helpers/logger";
import { getFilesNamesAndCreateAttachment } from "../util";

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
		)
		.addSubcommand(subcommand => 
			subcommand
				.setName('delete-log')
				.setDescription("Deletar informações de um log")
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
		)
		.addSubcommand(subcommand => 
			subcommand
				.setName('get-logs')
				.setDescription("Pegar todas as logs de uma categoria, que contem um valor")
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
						.setDescription('Código (ou parte do código) do log')
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
		else if (interaction.options.getSubcommand() == 'delete-log')
			return processLogDelete(interaction);
		else if (interaction.options.getSubcommand() == 'get-logs')
			return processLogFind(interaction);
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

async function processLogFind(interaction: ChatInputCommandInteraction)
{
	const sendChat = !(interaction.options.getBoolean('send-chat') || false);

	const category = interaction.options.getString('category');
	const code = interaction.options.getString('code');

	if (category == null)
		return;

	let finalPath = path.join( __dirname, '../../', 'logs', category);

	if (!fs.existsSync(finalPath))
		return await interaction.reply({ content: `A categoria \`${category}\` não foi encontrada.`, ephemeral: sendChat });

	let files: (String[] | Error) 
	try {
		files = getFilesNamesAndCreateAttachment(finalPath);
	}
	catch(e: any) {
		files = e;
	}

	if (files instanceof Error)
	{
		await interaction.reply({ content: `Erro ao buscar a categoria \`${category}\`:` + files.stack, ephemeral: sendChat });
		return;
	}

	if (code != null)
		files = files.filter(file => file.includes(code));

	let filesStr = files.join('\n');

	const buffer = Buffer.from((files.length != 0) ? filesStr : ' ', 'utf-8');
    let finalAttachment = new AttachmentBuilder(buffer, { name: 'logs.txt' });
	
	if (code == null)
		await interaction.reply({ content: `Lista de erros na categoria \`${category}\`:`, ephemeral: sendChat, files: [finalAttachment] });
	else
		await interaction.reply({ content: `Lista de erros na categoria \`${category}\` (contendo \`${code}\` no nome):`, ephemeral: sendChat, files: [finalAttachment] });
}

async function processEvalCommand(interaction: ChatInputCommandInteraction)
{
	const responseModal = new ModalBuilder()
		.setCustomId('interaction-response-debug-eval')
		.setTitle("Evaluate expression")
	
	const codeInput = new TextInputBuilder()
		.setCustomId('debug-eval-modal-arbitrary-code')
		.setLabel("What's the code that you want to evaluate?")
		.setStyle(TextInputStyle.Paragraph)

	const responseActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(codeInput);

	responseModal.addComponents(responseActionRow);

	await interaction.showModal(responseModal);
}

async function processLogDelete(interaction: ChatInputCommandInteraction)
{
	const category = interaction.options.getString('category');
	const code = interaction.options.getString('code');

	if (category == null || code == null)
		return;

	let finalPath = path.join( __dirname, '../../', 'logs', category, code) + '.txt';

	if (!fs.existsSync(finalPath))
		return await interaction.reply({ content: `O código de erro do erro \`${category}/${code}\` não foi encontrado.`, ephemeral: true });

	try {
		fs.unlinkSync(finalPath);
	}
	catch(e: any) {
		let logCode = await writeLog(LogTypes.COMMAND_ERRORS, e.stack);
		const embed = new EmbedBuilder()
			.setTitle("Oh não!")
			.setDescription(`Ocorreu um erro na execução deste comando.\nTente novamente mais tarde.\n\nCódigo de erro: \`{logCode}\`.`)
			.setColor("#FF0000")
			.setTimestamp()

		interaction.reply({ embeds: [embed], ephemeral: true });
		return;
	}

	await interaction.reply({ content: `O erro \`${category}/${code}\` foi deletado com sucesso.`, ephemeral: true });
}