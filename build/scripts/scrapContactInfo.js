(() => {
  // src/functions/selector.js
  var $ = (selector, node = document) => node.querySelector(selector);
  var $$ = (selector, node = document) => [...node.querySelectorAll(selector)];

  // src/functions/waitForElement.js
  var waitForElement = (selector) => new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (!$(selector).element) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
    setTimeout(() => {
      reject();
    }, 1e4);
  });
  var waitForElement_default = waitForElement;

  // src/scripts/selectors.js
  var SELECTORS = {
    profile: {
      css: {
        fullname: "h1",
        contactData: ".pv-contact-info__contact-type .pv-contact-info__ci-container > a",
        extraExperience: "section .pvs-list__container .scaffold-finite-scroll >div>ul .pvs-list__paged-list-item",
        extraEducation: ".scaffold-finite-scroll__content > ul> li"
      },
      xpath: {
        educationItems: "(//section[.//span[contains(text(),'Educaci\xF3n')]]//ul)[1]/li",
        experiencieItems: "(//section[.//span[contains(text(),'Experiencia')]]//ul)[1]/li"
      }
    },
    search: {
      urlsProfiles: ".search-results-container .ph0 ul.reusable-search__entity-result-list > li span.entity-result__title-text a",
      urlContacInfo: ".pv-text-details__separator > a",
      urlExtraInfo: ".pvs-list__footer-wrapper > div > a"
    }
  };
  var selectors_default = SELECTORS;

  // src/scripts/scrapContactInfo.js
  waitForElement_default("h1").then(() => {
    const contactData = $$(selectors_default.profile.css.contactData).map((elem) => elem.attributes.href.value);
    const linkedin = contactData.find((elem) => elem.includes("linkedin"));
    const email = contactData.find((elem) => elem.includes("@"));
    let port = chrome.runtime.connect({ name: "safePort" });
    port.postMessage({ linkedin, email, type: 1 });
  }).catch(() => {
    console.log("intentelo mas tarde");
  });
})();
