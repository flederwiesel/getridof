// ==UserScript==
// @name     getridof
// @description remove ads, trackers and cookie banners
// @version  1
// @match *://*/*
// @run-at document-start
// @grant    none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

// Resources:
//
// https://api.jquery.com/category/selectors/
// https://www.coderstool.com/jquery-selector
// https://iditect.com/article/greasemonkey-scripting-api.html
//

/* eslint-env jquery */

var removed = 0;

var selectors = [
  // IDs
  "#__ap_gfc_consent_box_btn__",
  "#ad-blocking,#adblocktest",
  "#cmpbox,#cmpbox2",
  "#cookiescript_injected",
  "#credential_picker_container,#g_id_onload,#privacy-popup",
  "#ccc,#ccc-module,#ccc-notify,#ccc-overlay",
  "#didomi-host",
  "#dpr-manager",
  "#ez-cookie-dialog-wrapper",
  "#js-stats",
  "#onetrust-consent-sdk",
  "#privacy-banner",
  "#site-overlay",
  "#tracking_leaderboard_container",
  "#wpstats",
  // scripts and pixels
  "*[src*=cookieControl]",
  "*[src*=monetization]",
  "*[src*=ad-delivery],*[src*=doubleclick]",
  // cookie banners and trackers
  "dialog.consent,dialog.js-consent",
  "div.adbox,div.adbox-skyscraper,div.adbox-skyscraper2",
  "div.ezmob-footer",
  "div.fc-consent-root,div.fc-dialog-overlay",
  "div[class*=sc-15dps6c-0]",
  "div[id^=amzn-assoc-ad-]",
  "div[id^=sp_message_container_]",
  ".ad,.ad-banner,.adcontainer,.ad-bouncex,.ad-skin,.has-ad-prefix,.page-ad",
  ".cookie-policy",
  ".stats-pixel",
  "[data-ad-template]",
  "*[title='Consent Management']",
  "*[title='SP Consent Message']",
  "iframe[name$=apiLocator],iframe[name^=googlefc]",
  "iframe[name|=goog_topics_frame]",
  "iframe[name=__cmpLocator]",
  // "voluntary" abo suggestions
  "leo-abo-hint,ion-modal,ion-popover",
];

var blacklist = [
  "aaxads.com",
  "aaxdetect.com",
  "acdn.adnxs.com",
  "ads.pubmatic.com",
  "cdn.connectad.io",
  "eus.rubiconproject.com",
  "js-sec.indexww.com",
  "mgr.consensu.org",
  "onetag-sys.com",
  "pixel.wp.com",
  "prebid.a-mo.net",
  "trx-hub.com",
  "u.openx.net",
];

// This should be a "all scripts loaded" hook, however, I did not find one yet...
setTimeout(() => {

  console.clear();

  for (var sel in selectors)
  {
    var elems = $(selectors[sel]);
    elems.remove();
    removed += elems.length;
    console.debug("Removed " + elems.length + " \"" + selectors[sel] + "\".");
  }

  // The selectors choke on URLs, iterate over iframes using simple text search on src=
  $("iframe,img").each(function(index)
  {
    var src = $(this).attr("src");

    if (src)
    {
      for (var i in blacklist)
      {
        if (src.indexOf(blacklist[i]) !== -1)
        {
          $(this).remove();
          ++removed;
          console.debug("Removed <" + $(this).prop("tagName") + " src=\"" + src + "\".");
          break;
        }
      }
    }
  });

  // Remove scripts
  $("script").each(function(index)
                     {
    var src = $(this).attr("src");

    if (src)
    {
      for (var i in blacklist)
      {
        if (src.indexOf(blacklist[i]) !== -1)
        {
          $(this).remove();
          ++removed;
          console.debug("Removed <script src=\"" + src + "\".");
          break;
        }
      }
    }
  });

  console.debug("Removed " + removed + " elements.");

  // allow scrolling
  $("body").css("overflow", "auto");

  $(".sp-message-open body").each(function() {
    $(this).attr("style", "overflow: auto !important; position: static !important");
  });

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(function (currentValue, currentIndex, listObj) {
          if (currentValue.outerHTML) {
            console.warn(`*** Inserted ${currentValue.outerHTML}, ${currentIndex}.`);
          }
        });
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Start observing the target node for configured mutations
  observer.observe(document.getElementsByTagName("body")[0], config);

  console.log("*** monkey finished ***");
}, 1000);
