import URLS from "./config.js";
import Profile from './model/model.profile';
import nextProfile from './functions/nextProfile';
import sendData from './functions/sendData';

let tabId;
let guardian = 0
let urls;
let profile;
let urlActualPage;

chrome.runtime.onConnect.addListener(port => {
    if (port.name === "safePort") {
        port.onMessage.addListener(async message => {
            if (message.type === 1) {
                profile.addContactInfo({ linkedin: message.linkedin, email: message.email })
            }
            if (message.type === 2) {
                profile.addExtraExperienceInfo(message.arrayOfJobs);
            }
            if (message.type === 3) {
                profile.addExtraEducationInfo(message.arrayOfEducation);
            }
            if (!profile.hasMoreInfo()) {
                await sendData("http://localhost:7080/api/v1/profile/create-profile", profile);

                if (guardian < urls.length) {
                    nextProfile(tabId, urls[guardian]);
                    guardian ++;
                } 
            }
        })
    }
    else if (port.name === "safePortBasicData") {
        port.onMessage.addListener(async message => {
            profile = new Profile(message.fullName,
                message.arrayOfJobs,
                message.arrayOfEducation,
                message.urlExtraExperience,
                message.urlExtraEducation);

            chrome.tabs.create({
                url: URLS.baseLinkedin + message.urlContacInfo
            }, tab => {
                setTimeout(() => { //Esperamos a que se cree la tab antes de inyectar
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["./scripts/scrapContactInfo.js"]
                    });
                }, 3000)
                setTimeout(() => {
                    chrome.tabs.remove(tab.id);
                }, 6000);

            });

            if (profile.urlExtraExperience) {
                setTimeout(() => {
                    chrome.tabs.create({
                        url: profile.urlExtraExperience
                    }, tab => {
                        setTimeout(() => { //Esperamos a que se cree la tab antes de inyectar
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ["./scripts/getExtraExperience.js"]
                            });
                        }, 3000)
                        setTimeout(() => {
                            chrome.tabs.remove(tab.id);
                        }, 6000);
                    });
                }, 3000);
            }
            if (profile.urlExtraEducation) {
                setTimeout(() => {
                    chrome.tabs.create({
                        url: profile.urlExtraEducation
                    }, tab => {
                        setTimeout(() => { //Esperamos a que se cree la tab antes de inyectar
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ["./scripts/getExtraEducation.js"]
                            });
                        }, 3000)
                        setTimeout(() => {
                            chrome.tabs.remove(tab.id);
                        }, 6000);
                    });

                }, 6000);
            }
        });
    }
    else if (port.name === "safePortUrls") {
        port.onMessage.addListener(async message => {
            urls = message.urlsProfiles

            const [url] = urls
            await chrome.tabs.update(tabId, { url })

            setTimeout(() => {
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['./scripts/scrapper.js']
                })
            }, 5000)
            guardian++
        })
    }
    else if (port.name === "popUpClick") {
        port.onMessage.addListener(async message => {
            urlActualPage = URLS.base + message.filterTo
            chrome.tabs.create({
                url: urlActualPage
            }, tab => {
                tabId = tab.id
                setTimeout(() => { //Esperamos a que se cree la tab antes de inyectar
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["./scripts/getUrls.js"]
                    })
                }, 1000)
            })
        })
    }
})

