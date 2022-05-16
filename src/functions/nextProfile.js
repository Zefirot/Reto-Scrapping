const nextProfile = (tabId, urls, guardian) => {
    if (guardian < urls.length) {
        chrome.tabs.update(tabId, { url: urls[guardian] })
        setTimeout(() => {
            chrome.scripting.executeScript({
                target: { tabId },
                files: ['./scripts/scrapper.js']
            })
        }, 5000)
    }
}

export default nextProfile;