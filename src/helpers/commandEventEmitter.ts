import { EventEmitter } from "events";

export default class commandEventEmitter extends EventEmitter {
    emitSync(event: string | symbol, ...args: any[]): Promise<any[]> {
        const listeners = this.listeners(event);
        const promises = listeners.map(listener => {
            try {
                return Promise.resolve(listener(...args));
            } catch (error) {
                return Promise.reject(error);
            }
        });
        return Promise.all(promises);
    }
}
