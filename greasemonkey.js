// ==UserScript==
// @name     getridof - remove ads, trackers and cookie banners
// @version  1
// @grant    none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

// Resources:
//
// https://api.jquery.com/category/selectors/
// https://www.coderstool.com/jquery-selector
// https://iditect.com/article/greasemonkey-scripting-api.html
//

var selectors = [
  // IDs
  "#__ap_gfc_consent_box_btn__",
  "#ad-blocking,#adblocktest",
  "#cookiescript_injected",
  "#credential_picker_container,#g_id_onload,#privacy-popup",
  "#ccc,#ccc-module,#ccc-notify,#ccc-overlay",
  "#dpr-manager",
  "#ez-cookie-dialog-wrapper",
  "#js-stats",
  "#onetrust-consent-sdk",
  "#privacy-banner",
  "#tracking_leaderboard_container",
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
  ".stats-pixel",
  "*[title='Consent Management']",
  "iframe[name$=apiLocator],iframe[name^=googlefc]",
  "iframe[name|=goog_topics_frame]",
  "iframe[name=__cmpLocator]",
  // "voluntary" abo suggestions
  "leo-abo-hint,ion-modal,ion-popover",
];

var iframes = [
  "acdn.adnxs.com",
  "ads.pubmatic.com",
  "cdn.connectad.io",
  "eus.rubiconproject.com",
  "js-sec.indexww.com",
  "onetag-sys.com",
  "prebid.a-mo.net",
  "u.openx.net",
];

// This should be a "all scripts loaded" hook, however, I did not find one yet...
setTimeout(() => {

  console.clear();
  removed = 0;

  for (sel in selectors)
  {
    elems = $(selectors[sel]);
    elems.remove();
    removed += elems.length;
    console.log("Removed " + elems.length + " \"" + selectors[sel] + "\".");
  }

  // The selectors choke on URLs, iterate over iframes using simple text search on src=
  $("iframe").each(function(index)
  {
    src = $(this).attr("src");

    for (i in iframes)
    {
      if (src.indexOf(iframes[i]) !== -1)
      {
          $(this).remove();
          ++removed;
          console.log("Removed <iframe src=\"" + src + "\".");
      }
    }
  });

  console.log("Removed " + removed + " elements.");

  // allow scrolling
  $("body").css("overflow", "auto");

  console.log("*** monkey finished ***");
}, 1000);
