import { SlashCommandBuilder } from "discord.js";
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
        if (interaction.options.getSubcommand() == 'eval')
            interaction.reply(`Hello World`)
    }
)