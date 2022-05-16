(() => {
  // src/functions/selector.js
  var $$ = (selector, node = document) => [...node.querySelectorAll(selector)];

  // src/scripts/selectors.js
  var SELECTORS = {
    profile: {
      css: {
        fullname: "h1",
        contactData: ".pv-contact-info__contact-type .pv-contact-info__ci-container > a",
        extraExperience: "section .pvs-list__container .scaffold-finite-scroll >div>ul .pvs-list__paged-list-item"
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

  // src/model/model.experience.js
  var Experience = class {
    constructor(rol, place, period, description) {
      this.rol = rol;
      this.place = place;
      this.period = period;
      this.description = description;
    }
  };
  var model_experience_default = Experience;

  // src/scripts/getExtraExperience.js
  var arrayOfJobs = [];
  var extraExperience = $$(selectors_default.profile.css.extraExperience);
  for (let i = 0; i < extraExperience.length; i++) {
    const element = extraExperience[i];
    console.log(element);
    profile = new model_experience_default(element.querySelector(".display-flex .mr1 .visually-hidden")?.textContent, element.querySelector(".display-flex .t-14 .visually-hidden")?.innerText, element.querySelector(".display-flex .t-14.t-normal.t-black--light .visually-hidden")?.innerText, element.querySelectorAll(".display-flex .t-14.t-normal.t-black--light .visually-hidden")[1]?.textContent, element.querySelector(".pvs-list__outer-container .pvs-list .visually-hidden")?.innerText);
    arrayOfJobs.push(profile);
  }
  var port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage({ arrayOfJobs, type: 2 });
})();
