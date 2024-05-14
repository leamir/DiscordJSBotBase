import { Client, Events } from "discord.js";
import { eventFileClass, eventType } from "../helpers/fileClasses";

export default new eventFileClass(
    Events.ClientReady,
    eventType.once,
    (client: Client<true>) => {
        console.log(`Logged in as ${client.user.tag}!`);
    }
)