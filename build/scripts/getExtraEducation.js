(() => {
  // src/functions/selector.js
  var $$ = (selector, node = document) => [...node.querySelectorAll(selector)];

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

  // src/model/model.education.js
  var Education = class {
    constructor(institutionName, degree, period, description) {
      this.institutionName = institutionName;
      this.degree = degree;
      this.period = period;
      this.description = description;
    }
  };
  var model_education_default = Education;

  // src/scripts/getExtraEducation.js
  var arrayOfEducation = [];
  var extraExperience = $$(selectors_default.profile.css.extraEducation);
  for (let i = 0; i < extraExperience.length; i++) {
    const element = extraExperience[i];
    const education = new model_education_default(element.querySelector(".display-flex .mr1 .visually-hidden")?.textContent, element.querySelector(".display-flex .t-14 .visually-hidden")?.innerText, element.querySelector(".display-flex .t-14.t-normal.t-black--light .visually-hidden")?.innerText, element.querySelectorAll(".display-flex .t-14.t-normal.t-black--light .visually-hidden")[1]?.textContent, element.querySelector(".pvs-list__outer-container .pvs-list .visually-hidden")?.innerText);
    arrayOfEducation.push(education);
  }
  var port = chrome.runtime.connect({ name: "safePort" });
  port.postMessage({ arrayOfEducation, type: 3 });
})();
