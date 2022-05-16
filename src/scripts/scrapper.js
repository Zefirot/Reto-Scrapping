import autoscrolling from "../functions/autoscrolling.js";
import { $, $$, $x } from "../functions/selector.js";
import waitForElement from "../functions/waitForElement.js";
import SELECTORS from "./selectors.js";
import Experience from "../model/model.experience"
import Education from "../model/model.education"

waitForElement('h1')
   .then(() => {
      autoscrolling(50).then(() => {
         const fullName = $(SELECTORS.profile.css.fullname).textContent;
         const experienceItems = $x(SELECTORS.profile.xpath.experiencieItems);
         const educationItems = $x(SELECTORS.profile.xpath.educationItems);
         const extraInfo = $$(SELECTORS.search.urlExtraInfo).map(elem => elem.attributes.href.value); //Informacion adicional de trabajo y educacion
         const contacInfo = $(SELECTORS.search.urlContacInfo);

         let arrayOfJobs = [];
         for (let i = 0; i < experienceItems.length; i++) {
            const element = experienceItems[i];
            profile = new Experience(
               element.querySelector(".display-flex .mr1 .visually-hidden")?.textContent,
               element.querySelector(".display-flex .t-14 .visually-hidden")?.innerText,
               element.querySelector(".display-flex .t-14.t-normal.t-black--light .visually-hidden")?.innerText,
               element.querySelectorAll(".display-flex .t-14.t-normal.t-black--light .visually-hidden")[1]?.textContent,
               element.querySelector(".pvs-list__outer-container .pvs-list .visually-hidden")?.innerText
            );

            arrayOfJobs.push(profile);
         }

         let arrayOfEducation = [];
         for (let i = 0; i < educationItems.length; i++) {
            const element = educationItems[i];
            let education = new Education(
               element.querySelector(".mr1 .visually-hidden")?.innerText,
               element.querySelector(".t-14 .visually-hidden")?.innerText,
               element.querySelector(".t-black--light .visually-hidden")?.innerText,
               element.querySelector(".pv-shared-text-with-see-more .visually-hidden")?.innerText
            )
            arrayOfEducation.push(education);
         }

         const urlExtraExperience = extraInfo.find(elem => elem.includes("expe"));
         const urlExtraEducation = extraInfo.find(elem => elem.includes("education"));
         const urlContacInfo = contacInfo?.attributes.href.value;

         let port = chrome.runtime.connect({ name: "safePortBasicData" });
         port.postMessage({
            fullName,
            arrayOfJobs,
            arrayOfEducation,
            urlExtraExperience,
            urlExtraEducation,
            urlContacInfo,
         });

      })
   })
   .catch(() => { console.log("intentelo mas tarde") })
