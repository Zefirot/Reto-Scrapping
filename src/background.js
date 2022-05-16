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
        port.onMessage.addListener(message => {
            console.log(message.type);
            if (message.type === 1) {
                console.log("Se llego hasta la carga de contacto");
                profile.addContactInfo({ linkedin: message.linkedin, email: message.email })

            }
            if (message.type === 2) {
                profile.addExtraExperienceInfo(message.arrayOfJobs);
                profile.urlExtraExperience = null;
                console.log(profile);
                //console.log("datos guardados en indexdb")
            }
            console.log(profile.urlExtraExperience);
            if (!profile.hasMoreInfo()) {
                console.log("datos guardados en indexdb")

                nextProfile(tabId, urls, guardian);
                guardian++;

            }


            /*  if (profile.hasMoreInfo() && message.extraExperience) { //Si se recibio todo el contenido
 
 
                 nextProfile(tabId, urls, guardian); //Pasa de perfil cuando ya se agrego la informacion extra
                 guardian++;
             }
             /* else if (profile.hasMoreInfo() && message.extraEducation){
 
             } */
            //else if (!profile.hasMoreInfo()) {//Pasa de perfil cuando no hay mas informacion extra
            //await db.profiles.add(message)

            //} 

            /* fetch("http://localhost:3000/profiles",{
                method: "POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(message)
            }).then(response=>response.json())
                .then(data=>console.log(data))
                .catch(error=>console.log(error)) */
        })
    }
    else if (port.name === "safePortBasicData") {
        port.onMessage.addListener(async message => {
            profile = new Profile(message.fullName,
                message.basicExperience,
                message.basicEducation,
                message.urlExtraExperience,
                message.urlExtraEducation);

            console.log("URL Experiencia extra");
            console.log(profile.urlExtraExperience);

            setTimeout(() => {
                chrome.tabs.create({
                    url: URLS.baseLinkedin + message.urlContacInfo
                }, tab => {
                    setTimeout(() => { //Esperamos a que se cree la tab antes de inyectar
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ["./scripts/scrapContactInfo.js"]
                        });
                        //chrome.tabs.remove(tab.id);
                    }, 3000)
                    setTimeout(() => {
                        chrome.tabs.remove(tab.id);
                    }, 4000);
    
                });
            }, 3000);
            

            setTimeout(() => {
                if (profile.urlExtraExperience) {
                    chrome.tabs.create({
                        url: profile.urlExtraExperience
                    }, tab => {
                        setTimeout(() => { //Esperamos a que se cree la tab antes de inyectar
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ["./scripts/getExtraExperience.js"]
                            });
                            //chrome.tabs.remove(tab.id);
                        }, 3000)
                        setTimeout(() => {
                            chrome.tabs.remove(tab.id);
                        }, 7000);
                    });
                }
            },7000);


            //if (message.urlExtraEducation) {
            //    await chrome.tabs.create({
            //        url: message.urlExtraEducation
            //    }, tab => {
            //        setTimeout(async () => { //Esperamos a que se cree la tab antes de inyectar
            //            await chrome.scripting.executeScript({
            //                target: { tabId: tab.id },
            //                files: ["./scripts/scrapContactInfo.js"]
            //            });
            //            chrome.tabs.remove(tab.id);
            //        }, 1000)
            //    });
            //}

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

