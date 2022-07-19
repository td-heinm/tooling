"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessage = void 0;
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const bluebird = require("bluebird");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const args_1 = require("../args");
const util_1 = require("../util");
const util = require("./util");
const buildOptions = (buildValues, args, componentIndex) => {
    let transformString;
    const format = args.format;
    const component = buildValues.components[componentIndex];
    switch (format) {
        case args_1.MessageFormat.OBJECT:
            transformString = 'objectTransform';
            break;
        case args_1.MessageFormat.TABLE:
            transformString = 'tableTransform';
            break;
        default:
            return util_1.assertNever(format);
    }
    const plugins = [
        // Add config
        new CopyWebpackPlugin([
            { from: path.join(buildValues.pwd, 'src', component.jsonFile), to: '.' },
        ]),
        // Add manifest
        new CopyWebpackPlugin([
            {
                from: path.join('src', buildValues.manifestFile),
                to: '.',
                transform: (content) => {
                    const manifestContents = content.toString();
                    const newManifest = manifestContents
                        .replace(/YOUR_GCS_BUCKET/g, buildValues.gcsBucket)
                        .replace(/"DEVMODE_BOOL"/, `${buildValues.devMode}`);
                    return newManifest;
                },
            },
        ]),
        // Add transform param definition
        new webpack.DefinePlugin({
            TRANSFORM_PARAM: `"${transformString}"`,
        }),
    ];
    // Only add in the copy plugin for the css if the user provides a css value in
    // the manifest.
    if (component.cssFile !== undefined) {
        plugins.push(new CopyWebpackPlugin([
            { from: path.join('src', component.cssFile), to: '.' },
        ]));
    }
    const outputFilename = (component.jsFile || component.tsFile).replace('.ts', '.js');
    return {
        mode: 'development',
        entry: {
            // this is the viz source code
            main: path.resolve(__dirname, '../../', 'viz', 'printMessage.js'),
        },
        output: {
            filename: outputFilename,
            path: path.resolve(buildValues.pwd, 'build'),
        },
        plugins,
    };
};
exports.buildMessage = async (args) => {
    const buildValues = util.validateBuildValues(args);
    for (let i = 0; i < buildValues.components.length; i++) {
        const webpackOptions = buildOptions(buildValues, args, i);
        const compiler = webpack(webpackOptions);
        const compilerRun = bluebird.promisify(compiler.run, { context: compiler });
        await compilerRun();
    }
};
