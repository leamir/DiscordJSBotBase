import { Events, ClientEvents, Awaitable } from 'discord.js';

export enum eventType {
    'once',
    'on'
}

export class eventFileClass 
{

    public readonly eventName: Events;
    public readonly onRun: (...args: any) => void;
    public readonly eventType: eventType;

    constructor(eventName: Events, eventType: eventType, onRun: (...args: any) => void)
    {
        this.eventName = eventName;
        this.eventType = eventType;
        this.onRun = onRun;
    }
}