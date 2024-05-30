import { Client, Events } from "discord.js";
import { EventFileClass, EventType } from "../helpers/fileClasses";

export default new EventFileClass(
    Events.ClientReady,
    EventType.once,
    (client: Client<true>) => {
        console.log(`Logged in as ${client.user.tag}!`);
    }
)