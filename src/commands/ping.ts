import { CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { commandFileClass } from "../helpers/fileClasses";

export default new commandFileClass(
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Pong"),
    (interaction: CommandInteraction) => {
        interaction.reply('Pong!');
    },
    () => {

    }
);