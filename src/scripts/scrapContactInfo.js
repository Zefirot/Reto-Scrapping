import { $, $$ } from "../functions/selector.js";
import waitForElement from "../functions/waitForElement.js";
import SELECTORS from "./selectors.js";

waitForElement('h1')
    .then(() => {
            const contactData = $$(SELECTORS.profile.css.contactData).map(elem => elem.attributes.href.value);
            const linkedin = contactData.find(elem => elem.includes("linkedin"));
            const email = contactData.find(elem => elem.includes("@"));

            let port = chrome.runtime.connect({ name: "safePort" });
            port.postMessage({ linkedin, email, type:1});

    })
    .catch(() => { console.log("intentelo mas tarde") })
