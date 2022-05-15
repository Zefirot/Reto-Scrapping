import { $, $$ } from "../functions/selector.js";
import waitForElement from "../functions/waitForElement.js";
import SELECTORS from "./selectors.js";

waitForElement('h1')
    .then(() => {
            const contactData = $$(SELECTORS.profile.css.contactData).map(elem => elem.attributes.href.value);
            const linkedin = contactData.filter(elem => elem.includes("linkedin"));
            const email = contactData.filter(elem => elem.includes("@"));

            let port = chrome.runtime.connect({ name: "safePort" });
            port.postMessage({ linkedin, email});

    })
    .catch(() => { console.log("intentelo mas tarde") })
