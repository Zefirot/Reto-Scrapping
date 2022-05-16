import autoscrolling from "../functions/autoscrolling.js";
import { $, $$, $x } from "../functions/selector.js";
import waitForElement from "../functions/waitForElement.js";
import SELECTORS from "./selectors.js";

waitForElement('h1')
   .then(()=>{
      autoscrolling(50).then(()=>{
         const fullName = $(SELECTORS.profile.css.fullname).textContent;
         const experienceItems = $x(SELECTORS.profile.xpath.experiencieItems);
         const educationItems = $x(SELECTORS.profile.xpath.educationItems);
         const extraInfo = $$(SELECTORS.search.urlExtraInfo).map(elem => elem.attributes.href.value); //Informacion adicional de trabajo y educacion
         const contacInfo = $(SELECTORS.search.urlContacInfo);
         
         const basicExperience = experienceItems
                                    .map(element => $('span[aria-hidden="true"]',element)?.textContent);
         
         
         const basicEducation = educationItems
                                    .map(element=> $('span[aria-hidden="true"]',element)?.textContent);


         const urlExtraExperience = extraInfo.find(elem => elem.includes("expe"));

         const urlExtraEducation = extraInfo.find(elem => elem.includes("education"));

         const urlContacInfo = contacInfo.attributes.href.value;

         let port = chrome.runtime.connect({name:"safePortBasicData"});
         port.postMessage({fullName,
            basicExperience,
            basicEducation,
            urlExtraExperience,
            urlExtraEducation,
            urlContacInfo,
            });

      })
   })
   .catch(()=>{console.log("intentelo mas tarde")})
