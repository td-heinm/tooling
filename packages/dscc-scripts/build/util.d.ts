import { CommonOptions } from 'execa';
export declare const assertNever: (x: never) => never;
export declare const format: {
    green: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    blue: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    yellow: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
    red: import("chalk").Chalk & {
        supportsColor: import("chalk").ColorSupport;
    };
};
interface ConnectorConfig {
    dsccConnector: {
        production: string;
        latest: string;
    };
}
export declare const invalidConnectorConfig: (path: keyof ConnectorConfig['dsccConnector']) => Error;
export declare const invalidVizConfig: (path: string) => Error;
export declare const pipeStdIO: CommonOptions;
export {};
