/**
 *
 * Copyright 2017-2025 David Herron
 *
 * This file is part of AkashaCMS-extlinks (http://akashacms.com/).
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import path from 'node:path';
import akasha, {
    CustomElement,
    Munger
} from 'akasharender';
const mahabhuta = akasha.mahabhuta;

const __dirname = import.meta.dirname;

const pluginName = "@akashacms/plugins-adblock-checker";

export class AdblockCheckerPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    #config;

    configure(config, options) {
        this.#config = config;
        this.akasha = config.akasha;
        this.options = options ? options : {};
        options.config = config;
        config.addAssetsDir(path.join(__dirname, 'assets'));
        config.addFooterJavaScript({
            href: '/vendor/@akashacms/plugins-adblock-checker/adblock-checker.js'
        });
        const s = this.generateCheckerScript();
        if (typeof s === 'string') {
            config.addFooterJavaScript({
                script: s
            });
        }

    }

    get config() { return this.#config; }

    // Generates in-line JavaScript to invoke the akAdblockChecker
    // with appropriate arguments.
    //
    // Base64 is used for the codeOnBlocked because it is
    // otherwise encoded with HTML entities that would be
    // difficult to decode.  Base64 is easy to decode using
    // built-in functions in JavaScript.
    //
    // The codeOnBlocked value comes from the Configuration.
    // It is converted into Base64 and supplied to akAdblockChecker
    // In akAdblockChecker it is decoded and, if appropriate,
    // is used to replace any empty advert block.
    generateCheckerScript() {
        let adblockSelector =  this.options.selector;
        // console.log(`generateChecker`, this?.options?.codeOnBlocked);
        let adblockCodeOnBlocked = btoa(this?.options?.codeOnBlocked 
            ? this.options.codeOnBlocked 
            : undefined);
        return  typeof adblockCodeOnBlocked === 'string'
            ? `
            window.onload = function() {
                setTimeout(function() {
                    akAdblockChecker("${adblockSelector}", \`
                        ${adblockCodeOnBlocked}
                    \`);
                });
            };
            `
            : undefined;
    }
};
