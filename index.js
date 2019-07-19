/**
 *
 * Copyright 2017 David Herron
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

'use strict';

const url      = require('url');
const path     = require('path');
const util     = require('util');
const akasha   = require('akasharender');
const mahabhuta = akasha.mahabhuta;

const _plugin_config = Symbol('config');
const _plugin_options = Symbol('options');

const pluginName = "akashacms-adblock-checker";

module.exports = class AdblockCheckerPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    configure(config, options) {
        this[_plugin_config] = config;
        this[_plugin_options] = options;
        options.config = config;
        config.addPartialsDir(path.join(__dirname, 'partials'));
        config.addMahabhuta(module.exports.mahabhutaArray(options));
    }

    get config() { return this[_plugin_config]; }
    get options() { return this[_plugin_options]; }

    // These are moot.  The documentation for them no longer eists.
    // Maybe there is still code using these two functions.

    useSelector(config, selector) { this.options.selector = selector; }
    getSelector(config) { return this.options.selector; }

    useCodeOnBlocked(config, code) { this.options.codeOnBlocked = code; }
    getCodeOnBlocked(config) { return this.options.codeOnBlocked; }
};


module.exports.mahabhutaArray = function(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new AdblockCheckerElement());
    return ret;
};

class AdblockCheckerElement extends mahabhuta.CustomElement {
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
        return akasha.partial(this.array.options.config, "adblock-checker.html.ejs", {
            adblockSelector: this.array.options.selector,
            adblockCodeOnBlocked
        });
	}
}
