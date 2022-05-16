import URLS from "./config.js";
import { db } from "./lib/db.js";
import Profile from './model/model.profile';
import nextProfile from './functions/nextProfile';

let tabId;
let guardian = 0
let urls;
let profile;

chrome.runtime.onConnect.addListener(port => {
    if (port.name === "safePort") {
        port.onMessage.addListener(async message => {
            console.log(message.type);
            if (message.type === 1) {
                //console.log(profile)
                console.log("Se llego hasta la carga de contacto");
                profile.addContactInfo({ linkedin: message.linkedin, email: message.email })

            }
            if (message.type === 2) {
                profile.addExtraExperienceInfo(message.arrayOfJobs);
                profile.urlExtraExperience = null;
                //console.log(profile);
                //console.log("datos guardados en indexdb")
            }
            if (message.type === 3){
                console.log(message.arrayOfEducation)
                profile.addExtraEducationInfo(message.arrayOfEducation);
                console.log(profile);
                profile.urlExtraEducation = null;
            }

            if (!profile.hasMoreInfo()) {

                fetch("http://localhost:7080/api/v1/profile/create-profile", {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(profile)
                }).then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => {
                        console.log(error)
                        await db.profiles.add(profile) //Si falla se envia hacia indexDB
                    })
                
                nextProfile(tabId, urls, guardian);
                guardian++;
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

            setTimeout(() => {
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
            }, 3000);

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
                        }, 7000);
                    });
                }, 7000);
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
                        }, 7000);
                    });

                }, 7000);
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
            chrome.tabs.create({
                url: URLS.base + message.filterTo
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

