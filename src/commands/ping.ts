import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { commandFileClass } from "../helpers/fileClasses";
import { client } from "../util";

export default new commandFileClass(
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Retorna o valor "),
    (interaction: CommandInteraction) => {
        const responseEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(':ping_pong: Pong!')
            .addFields(
                { name: 'Tempo de resposta da API Discord', value: `${Math.abs(client.ws.ping)}ms`},
                { name: 'Tempo de recebimento da mensagem', value: `${Math.abs(Date.now() - interaction.createdTimestamp)}ms`}
            )
        interaction.reply({ content: '', embeds: [responseEmbed], ephemeral: true});
    },
    () => {

    }
);