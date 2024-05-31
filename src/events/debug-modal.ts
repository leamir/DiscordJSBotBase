import { EmbedBuilder, Events } from "discord.js";
import { EventFileClass, EventType } from "../helpers/fileClasses";
import { evaluateAndCaptureOutput } from "../util";


export default new EventFileClass(
	Events.InteractionCreate,
	EventType.on,
	async (interaction) => {
		if (!interaction.isModalSubmit())
			return;

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

		if (interaction.customId == 'interaction-response-debug-eval') {
			await interaction.deferReply({ ephemeral: true });
			
			const code = interaction.fields.getTextInputValue('debug-eval-modal-arbitrary-code');
			let result = await evaluateAndCaptureOutput(code);

			await interaction.editReply({ files: [result] });
		}
	}
)