class Profile{
    constructor(fullName,experience,education,urlExtraExperience,urlExtraEducation){
        this.fullName = fullName;
        //this.contactInfo = contactInfo;
        this.experience = experience;
        this.education = education;
        this.urlExtraExperience = urlExtraExperience;
        this.urlExtraEducation = urlExtraEducation;
    }
    
    hasMoreInfo(){
        return (this.urlExtraExperience || this.urlExtraEducation);
    }

    addContactInfo(contactInfo){
        this.contactInfo = contactInfo;
    }

    addExtraExperienceInfo(extraInfo){
        this.experience = extraInfo;
    }
}

export default Profile