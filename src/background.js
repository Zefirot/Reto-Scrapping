import URLS from "./config.js"
import { db } from "./lib/db.js"

let tabId;

chrome.action.onClicked.addListener(tab=>{ //Se agre la pagina de linkedin y se ejecuta el getURL de perfiles
    chrome.tabs.create({
        url: URLS.base
    }, tab =>{
        tabId = tab.id
        chrome.scripting.executeScript({
            target:{tabId: tab.id},
            files:["./scripts/getUrls.js"]
        })
    })
})

let guardian = 0
let urls;

chrome.runtime.onConnect.addListener(port=>{ //Se escucha los puertos para saber en donde scrappear
    if(port.name==="safePort"){
        port.onMessage.addListener(async message=>{

            await db.profiles.add(message)
            console.log("datos guardados en indexdb")
            console.log(guardian)
            if(guardian<urls.length){
                await chrome.tabs.update(tabId,{url:urls[guardian]}) //Se redirige hacia las paginas de los perfiles
    
                setTimeout(()=>{ //Se duerme el proceso para evitar problemas de sincronismo
                    chrome.scripting.executeScript({
                        target: {tabId},
                        files: ['./scripts/scrapper.js']    // Se ejecuta el script para tomar datos de los perfiles
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
})

