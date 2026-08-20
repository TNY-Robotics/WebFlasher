import {
    ESPLoader,
    Transport,
} from "esptool-js";

import type {
    LoaderOptions,
    IEspLoaderTerminal,
} from "esptool-js";

export let esploader: ESPLoader|null = null;

export function initializeESPLoader(port: any) {
    const terminal: IEspLoaderTerminal = {
        clean() {
            console.log(`<=== CLEAR ===>`);
        },
        writeLine(data: string) {
            console.log(data);
        },
        write(data: string) {
            console.log(data);
        },
    };
    const transport = new Transport(port, true);
    const loaderOptions: LoaderOptions = {
        transport: transport,
        baudrate: 921600, // Communication baud rate
        terminal: terminal, // Optional terminal for logging
        debugLogging: false, // Optional debug logging
    };
    esploader = new ESPLoader(loaderOptions);
    return esploader;
}