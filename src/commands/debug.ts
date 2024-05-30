import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { commandFileClass } from "../helpers/fileClasses";

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
		),
	(interaction) => {
		//TODO: Limit command using database, instead of hardcoding staff
		if (interaction.member?.user.id != '603063797871280139')
		{
			const responseEmbed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setTitle('Sem permissão!')
				.setDescription('Você precisa ser um desenvolvedor do bot para utilizar este comando')
			
			interaction.reply({ content: '', embeds: [responseEmbed], ephemeral: true });
			return;    
		}

		if (interaction.options.getSubcommand() == 'eval')
		{			
			return processEvalCommand(interaction);
		}
	}
)


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
}
