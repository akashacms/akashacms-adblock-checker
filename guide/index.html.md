---
layout: plugin-documentation.html.ejs
title: AskashaCMS Adblock Checker documentation
---

Understandably many people run an Advertising Blocking extension in their web browser.  Advertising techniques frequently cause excess page load times and bad performance.  Those of us who publish websites often monetize by running advertising, and therefore we earn our living by showing advertising to our customers.  Ad blockers interfere with that business model, and we require a method to communicate with the customers who block our advertising efforts.

Of course it's useful if our advertising efforts do not cause an excessively bad experience for our customers.  That our customers resort to running an ad blocker is a symptom of over-the-top advertising techniques.  It is your choice whether to follow that recommendation, or not.

The point of the `akashacms-adblock-checker` plugin is two-fold:

* Detect whether an advertisement has been blocked
* Display a message to the reader

# Installation

With an AkashaCMS website setup, add the following to `package.json`

```
  "dependencies": {
    ...
    "akashacms-adblock-checker": "akashacms/akashacms-adblock-checker"
    ...
  }
```

I haven't decided to publish this plugin to `npm` yet.  Instead, at the moment, one should access it as shown here from the Github repository.

Once added to `package.json` run: `npm install`

## Page layout code

To enable the Adblock-Checker on a given page layout, add the following custom tag:

```
<adblock-checker></adblock-checker>
```

This custom tag invokes the partial named below, passing in the data given in the Configuration.

# Configuration

In `config.js` for the website:

```
config.use(require('akashacms-adblock-checker'));

config.plugin('akashacms-adblock-checker').useSelector(config, '.advert');
config.plugin('akashacms-adblock-checker').useCodeOnBlocked(config, `
    HTML of message to display to user
    `);
```

The string passed in `useSelector` is a jQuery selector to match a wrapper `div` you add to your advertising blocks.  See the next section for a discussion.

The string passed in `useCodeOnBlocked` is HTML that is to be displayed to the user.  By using a back-quote string (what ES-2015 calls a Template String) the string can include newlines for readability.  Those newlines will be removed before passing to the partial, however.

# Ad-Block Detection methodology

Having looked at the configuration, let's discuss the detection methodology.  I've verified this technique works with the adblocker I sometimes run in Chrome.

An adblocker works by looking for HTML sections it doesn't like, that it thinks constitutes an advertisement.  For example it might look for JavaScript or an `iframe` loading from specific URL's, or simply an HTML snippet that it recognizes as an advertisement.  It then removes that HTML from the DOM.

Therefore, if one wraps the advertisement with a `div`, that `div` will be empty.  Ergo, if one were to run some JavaScript to check the height of the wrapper `div`, a height of 0 pixels should be a clue of a blocked advertisement.

Consider:

```
<div class="advert">
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-PUBLISHER-ID"
     data-ad-slot="AD-SLOT-CODE"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>
```

This is a typical advertising snippet from Adsense.  Clearly an adblocker knows that Adsense advertising loads from `googlesyndication.com` and can remove said code from the page preventing the advertisement from loading.

In such a case the HTML effectively becomes:

```
<div class="advert">
</div>
```

In such a case, this jQuery expression will be true:

```
if ($(selector).height() === 0) { ... }
```

That's how the Adblock Checker works.

# Partial

The key to this is in the partial, `adblock-checker.html.ejs`.  Use a different detection mechanism requires overriding this file.  As with any other partial in AkashaCMS, implement that same partial in your website containing whatever it is you want.
