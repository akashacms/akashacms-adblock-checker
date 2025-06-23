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
// const util     = require('node:util');
import akasha, {
    Configuration,
    CustomElement,
    Munger,
    PageProcessor
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
        config.addPartialsDir(path.join(__dirname, 'partials'));
        config.addMahabhuta(mahabhutaArray(options, config, this.akasha, this));
    }

    get config() { return this.#config; }

    // These are moot.  The documentation for them no longer eists.
    // Maybe there is still code using these two functions.

    useSelector(config, selector) { this.options.selector = selector; }
    getSelector(config) { return this.options.selector; }

    useCodeOnBlocked(config, code) { this.options.codeOnBlocked = code; }
    getCodeOnBlocked(config) { return this.options.codeOnBlocked; }
};


export function mahabhutaArray(
            options,
            config, // ?: Configuration,
            akasha, // ?: any,
            plugin  // ?: Plugin
) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new AdblockCheckerElement(config, akasha, plugin));
    return ret;
};

class AdblockCheckerElement extends CustomElement {
    get elementName() { return "adblock-checker"; }
    process($element, metadata, dirty) {
        var adblockCodeOnBlocked = this.array.options.codeOnBlocked
            .replace(/(\r\n|\n|\r)/gm,"")
            .replace(/"/gm, '\\"');
        var elementSelector = $element.attr('selector');
        if (elementSelector) {
            adblockSelector = elementSelector;
        }
        // console.log(`${pluginName} ${adblockSelector} ${adblockCodeOnBlocked}`);
        return this.akasha.partial(this.config, "adblock-checker.html.ejs", {
            adblockSelector: this.array.options.selector,
            adblockCodeOnBlocked
        });
	}
}
