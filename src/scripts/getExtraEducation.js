import { $, $$ } from "../functions/selector.js";
import SELECTORS from "./selectors.js";
import Education from "../model/model.education.js";

let arrayOfEducation = [];
const extraExperience = $$(SELECTORS.profile.css.extraEducation);

for (let i = 0; i < extraExperience.length; i++) {
   const element = extraExperience[i];
   const education = new Education(
      element.querySelector(".display-flex .mr1 .visually-hidden")?.textContent,
      element.querySelector(".display-flex .t-14 .visually-hidden")?.innerText,
      element.querySelector(".display-flex .t-14.t-normal.t-black--light .visually-hidden")?.innerText,
      element.querySelectorAll(".display-flex .t-14.t-normal.t-black--light .visually-hidden")[1]?.textContent,
      element.querySelector(".pvs-list__outer-container .pvs-list .visually-hidden")?.innerText
   );

   arrayOfEducation.push(education);
}

let port = chrome.runtime.connect({ name: "safePort" });
port.postMessage({ arrayOfEducation, type: 3 });


