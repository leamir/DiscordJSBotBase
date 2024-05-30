import { ClientEvents, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export enum EventType {
    'once',
    'on'
}

export class EventFileClass<T extends keyof ClientEvents> {
    public readonly eventName: T;
    public readonly onRun: (...args: ClientEvents[T]) => void;
    public readonly onLoad?: () => void;
    public readonly EventType: EventType;

    constructor(eventName: T, EventType: EventType, onRun: (...args: ClientEvents[T]) => void, onLoad?: () => void) {
        this.eventName = eventName;
        this.EventType = EventType;
        this.onRun = onRun;
        this.onLoad = onLoad;
    }
}

export class commandFileClass
{
    public readonly cmdConstructor: SlashCommandBuilder;
    public readonly onRun: (interaction: CommandInteraction) => void;
    public readonly onLoad?: () => void;

    constructor(cmdConstructor: SlashCommandBuilder, onRun: (interaction: CommandInteraction) => void, onLoad?: () => void)
    {
        this.cmdConstructor = cmdConstructor;
        this.onRun = onRun;
        this.onLoad = onLoad;   
    }
}
