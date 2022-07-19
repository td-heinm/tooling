import { PathLike } from 'fs';
import { VizArgs } from '../args';
export interface ComponentBuildValues {
    cssFile?: string;
    jsonFile: string;
    jsFile?: string;
    tsFile?: string;
}
export interface BuildValues {
    devBucket: string;
    prodBucket: string;
    manifestFile: 'manifest.json';
    components: ComponentBuildValues[];
    devMode: boolean;
    pwd: string;
    gcsBucket: string;
}
export declare const validateBuildValues: (args: VizArgs) => BuildValues;
interface VizComponent {
    name: string;
}
export interface VizManifest {
    components: VizComponent[];
}
export declare const validateManifestFile: (path: PathLike) => VizManifest;
export declare const validateConfigFile: (path: PathLike) => boolean;
export declare const getBuildableComponents: () => ComponentBuildValues[];
export declare const getComponentIndex: (args: VizArgs, manifestPath: PathLike) => string;
export {};
