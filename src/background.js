import URLS from "./config.js"
import { db } from "./lib/db.js"

let tabId;
let guardian = 0
let urls;

chrome.runtime.onConnect.addListener(port=>{
    if(port.name==="safePort"){
        port.onMessage.addListener(async message=>{

            await db.profiles.add(message)
            console.log("datos guardados en indexdb")
            console.log(guardian)
            if(guardian<urls.length){
                await chrome.tabs.update(tabId,{url:urls[guardian]})
    
    
                setTimeout(()=>{
                    chrome.scripting.executeScript({
                        target: {tabId},
                        files: ['./scripts/scrapper.js']    
                    }) 
                },5000)
    
                guardian++

            }
            /* fetch("http://localhost:3000/profiles",{
                method: "POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(message)
            }).then(response=>response.json())
                .then(data=>console.log(data))
                .catch(error=>console.log(error)) */
        })
    }else if(port.name==="safePortUrls"){
        port.onMessage.addListener(async message=>{            
            urls = message.urlsProfiles 
            
            const [url] = urls
            await chrome.tabs.update(tabId,{url})

            setTimeout(()=>{
                chrome.scripting.executeScript({
                    target: {tabId},
                    files: ['./scripts/scrapper.js']    
                }) 
            },5000)
            guardian++
        })
    }
    else if (port.name === "popUpClick"){
        port.onMessage.addListener(async message=>{

            chrome.tabs.create({
                url: URLS.base + message.filterTo
            }, tab =>{
                tabId = tab.id
                setTimeout(()=>{ //Esperamos a que se cree la tab antes de inyectar
                    chrome.scripting.executeScript({
                        target:{tabId: tab.id},
                        files:["./scripts/getUrls.js"] 
                    }) 
                },1000)
            })
        })
    }
})

