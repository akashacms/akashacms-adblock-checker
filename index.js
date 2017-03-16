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
const co       = require('co');
const akasha   = require('akasharender');
const mahabhuta = require('mahabhuta');

const log   = require('debug')('akasha:extlinks-plugin');
const error = require('debug')('akasha:error-extlinks-plugin');

const pluginName = "akashacms-adblock-checker";

module.exports = class AdblockCheckerPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    configure(config) {
        config.addPartialsDir(path.join(__dirname, 'partials'));
        config.addMahabhuta(module.exports.mahabhuta);
    }

    useSelector(config, selector) { config.pluginData(pluginName).selector = selector; }
    getSelector(config) { return config.pluginData(pluginName).selector; }

    useCodeOnBlocked(config, code) { config.pluginData(pluginName).codeOnBlocked = code; }
    getCodeOnBlocked(config) { return config.pluginData(pluginName).codeOnBlocked; }
};

module.exports.mahabhuta = new mahabhuta.MahafuncArray("akashacms-adblock-checker", {});

class AdblockCheckerElement extends mahabhuta.CustomElement {
    get elementName() { return "adblock-checker"; }
    process($element, metadata, dirty) {
        const pluginData = metadata.config.pluginData(pluginName);
        var adblockSelector = pluginData.selector;
        var adblockCodeOnBlocked = pluginData.codeOnBlocked;
        var elementSelector = $(element).attr('selector');
        if (elementSelector) {
            adblockSelector = elementSelector;
        }
        return akasha.partial(metadata.config, "adblock-checker.html.ejs", {
            adblockSelector, adblockCodeOnBlocked
        });
	}
}
module.exports.mahabhuta.addMahafunc(new AdblockCheckerElement());
