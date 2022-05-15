const SELECTORS = {
    profile:{
        css:{
            fullname: "h1",
            contactData: ".pv-contact-info__contact-type .pv-contact-info__ci-container > a",
        },
        xpath:{
            educationItems: "(//section[.//span[contains(text(),'Educación')]]//ul)[1]/li",
            experiencieItems: "(//section[.//span[contains(text(),'Experiencia')]]//ul)[1]/li"
        }
    },
    search:{
        urlsProfiles:".search-results-container .ph0 ul.reusable-search__entity-result-list > li span.entity-result__title-text a",
        urlContacInfo:".pv-text-details__separator > a",
        urlExtraInfo:".pvs-list__footer-wrapper > div > a",
    }

}

export default SELECTORS