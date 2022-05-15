import autoscrolling from "../functions/autoscrolling.js";
import { $, $$, $x } from "../functions/selector.js";
import waitForElement from "../functions/waitForElement.js";
import SELECTORS from "./selectors.js";

waitForElement('h1')
   .then(()=>{
      autoscrolling(30).then(()=>{
         const fullName = $(SELECTORS.profile.css.fullname).textContent;
         const experienceItems = $x(SELECTORS.profile.xpath.experiencieItems);
         const educationItems = $x(SELECTORS.profile.xpath.educationItems);
         const extraInfo = $$(SELECTORS.search.urlExtraInfo); //Informacion adicional de trabajo y educacion
         const contacInfo = $(SELECTORS.search.urlContacInfo);
         
         const pruebaExperience = experienceItems
                                    .map(element => $('span[aria-hidden="true"]',element)?.textContent);
         
         
         const pruebaEducation = educationItems
                                    .map(element=> $('span[aria-hidden="true"]',element)?.textContent);


         const urlExtraInfo = extraInfo.map(elem => elem.attributes.href.value)
                                       .filter(elem => elem.includes("expe") || elem.includes("education"));

         const urlContacInfo = contacInfo.attributes.href.value;

         let port = chrome.runtime.connect({name:"safePortBasicData"});
         port.postMessage({fullName,pruebaExperience, pruebaEducation, urlExtraInfo, urlContacInfo});

      })
   })
   .catch(()=>{console.log("intentelo mas tarde")})
