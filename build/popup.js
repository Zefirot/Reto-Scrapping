document.getElementById('buttonRun').onclick = ()=> {
    const filter = document.getElementById('filterTo').value;
    let port = chrome.runtime.connect({name:"popUpClick"})
    port.postMessage({"filterTo":filter});

};