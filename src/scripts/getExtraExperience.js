import { $, $$ } from "../functions/selector.js";
import SELECTORS from "./selectors.js";
import Experience from "../model/model.experience"

let arrayOfJobs = [];
const extraExperience = $$(SELECTORS.profile.css.extraExperience);
   //.map(elem => elem.querySelector(".display-flex .mr1 .visually-hidden")?.textContent);


   for (let i = 0; i < extraExperience.length; i++) {
      const element = extraExperience[i];
      console.log(element);
      profile = new Experience(
         element.querySelector(".display-flex .mr1 .visually-hidden")?.textContent,
         element.querySelector(".display-flex .t-14 .visually-hidden")?.innerText,
         element.querySelector(".display-flex .t-14.t-normal.t-black--light .visually-hidden")?.innerText,
         element.querySelectorAll(".display-flex .t-14.t-normal.t-black--light .visually-hidden")[1]?.textContent,
         element.querySelector(".pvs-list__outer-container .pvs-list .visually-hidden")?.innerText
      );
   
      arrayOfJobs.push(profile);
   }

let port = chrome.runtime.connect({ name: "safePort" });
port.postMessage({ arrayOfJobs, type: 2 });


