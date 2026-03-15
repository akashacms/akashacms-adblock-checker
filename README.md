# @akashacms/plugins-adblock-checker
Adblock checker for use on AkashaCMS websites, detecting whether an advertisement has been blocked, displaying a message of your choice to the visitor.

This plugin requires wrapping your advertising code with a wrapper `div`.  It runs some JavaScript to detect if the advertisement was blocked, and then inserting a message of your choice.

```js
import { AdblockCheckerPlugin } from '@akashacms/plugins-adblock-checker';

config
   .use(AdblockCheckerPlugin, {
        selector: '\".advert\"',
        codeOnBlocked: `
        <div style="border: 1px solid red; max-width: 100%;">Browse available:
            <ul class="list-group">
            <li class="list-group-item list-group-item-info"><a type="button" class="btn btn-outline-primary btn-lg" href="/ev-charging/range-confidence/chap8-tech/electric-car-extension-cords.html">Electric vehicle charging cords.</a></li>
            <li class="list-group-item list-group-item-info"><a type="button" class="btn btn-outline-primary btn-lg" href="/ev-charging/range-confidence/chap-6a-evse-catalog.html">Electric vehicle charging stations</a></li>
            </ul>
        </div>`
    });

```