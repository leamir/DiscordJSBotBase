import { Events, ClientEvents, Awaitable } from 'discord.js';

export enum eventType {
    'once',
    'on'
}

export class eventFileClass 
{

    public readonly eventName: keyof ClientEvents;
    public readonly onRun: (...args: any) => void;
    public readonly onLoad?: () => void
    public readonly eventType: eventType;

    constructor(eventName: keyof ClientEvents, eventType: eventType, onRun: (...args: any) => void, onLoad?: () => void)
    {
        this.eventName = eventName;
        this.eventType = eventType;
        this.onRun = onRun;
        this.onLoad = onLoad;
    }
}