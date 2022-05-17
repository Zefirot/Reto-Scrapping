const nextProfile = (tabId, url) => {
        chrome.tabs.update(tabId, { url })
        setTimeout(() => {
            chrome.scripting.executeScript({
                target: { tabId },
                files: ['./scripts/scrapper.js']
            })
        }, 5000)
    }

export default nextProfile;
