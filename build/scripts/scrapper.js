(() => {
  // src/functions/autoscrolling.js
  var autoscrolling = (pixels) => new Promise((resolve, reject) => {
    let pixelstoScroll = pixels;
    const idInterval = setInterval(() => {
      window.scrollTo(0, pixelstoScroll);
      pixelstoScroll += pixels;
      if (pixelstoScroll > document.body.scrollHeight) {
        clearInterval(idInterval);
        resolve(true);
      }
    }, 100);
  });
  var autoscrolling_default = autoscrolling;

  // src/functions/selector.js
  var $ = (selector, node = document) => node.querySelector(selector);
  var $$ = (selector, node = document) => [...node.querySelectorAll(selector)];
  var $x = (xpath, node = document) => {
    const collection = document.evaluate(xpath, node, null, XPathResult.ANY_TYPE, null);
    let result = collection.iterateNext();
    const elements = [];
    while (result) {
      elements.push(result);
      result = collection.iterateNext();
    }
    return elements;
  };

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

  // src/scripts/scrapper.js
  waitForElement_default("h1").then(() => {
    autoscrolling_default(50).then(() => {
      const fullName = $(selectors_default.profile.css.fullname).textContent;
      const experienceItems = $x(selectors_default.profile.xpath.experiencieItems);
      const educationItems = $x(selectors_default.profile.xpath.educationItems);
      const extraInfo = $$(selectors_default.search.urlExtraInfo).map((elem) => elem.attributes.href.value);
      const contacInfo = $(selectors_default.search.urlContacInfo);
      let arrayOfJobs = [];
      for (let i = 0; i < experienceItems.length; i++) {
        const element = experienceItems[i];
        profile = new model_experience_default(element.querySelector(".display-flex .mr1 .visually-hidden")?.textContent, element.querySelector(".display-flex .t-14 .visually-hidden")?.innerText, element.querySelector(".display-flex .t-14.t-normal.t-black--light .visually-hidden")?.innerText, element.querySelectorAll(".display-flex .t-14.t-normal.t-black--light .visually-hidden")[1]?.textContent, element.querySelector(".pvs-list__outer-container .pvs-list .visually-hidden")?.innerText);
        arrayOfJobs.push(profile);
      }
      let arrayOfEducation = [];
      for (let i = 0; i < educationItems.length; i++) {
        const element = educationItems[i];
        let education = new model_education_default(element.querySelector(".mr1 .visually-hidden")?.innerText, element.querySelector(".t-14 .visually-hidden")?.innerText, element.querySelector(".t-black--light .visually-hidden")?.innerText, element.querySelector(".pv-shared-text-with-see-more .visually-hidden")?.innerText);
        arrayOfEducation.push(education);
      }
      const urlExtraExperience = extraInfo.find((elem) => elem.includes("expe"));
      const urlExtraEducation = extraInfo.find((elem) => elem.includes("education"));
      const urlContacInfo = contacInfo?.attributes.href.value;
      let port = chrome.runtime.connect({ name: "safePortBasicData" });
      port.postMessage({
        fullName,
        arrayOfJobs,
        arrayOfEducation,
        urlExtraExperience,
        urlExtraEducation,
        urlContacInfo
      });
    });
  }).catch(() => {
    console.log("intentelo mas tarde");
  });
})();
