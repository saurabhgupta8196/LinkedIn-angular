const Dao = require('../data-access/data-access');
const crypto = require("crypto");

const dao = new Dao();

class Controller {

    constructor() {
        this.COLLECTION = "users";
    }

    /*
        @desc : "When we click on any user's profile, this details will be brought to be displayed"
        @author :  Dipmalya Sen
        @param : {string} user name
        @return : user object
    */
    async getUserByUserName(uName) {
        let objQuery = { userName: uName };
        let result = await dao.find(this.COLLECTION, objQuery);
        return result;
    }

    /*
        @desc : "This function will add the award passed as obj to the user's profile.. When we click on add award(+) then, the entered details will be fetched and passed as obj"
        @author : Supriya Patil
        @param : {string} user name, {object} award object
        @return : db update response
    */
    async addAwards(uName, obj) {
        const id = crypto.randomBytes(16).toString("hex");
        let query = { userName: uName };
        let newValue = { $push: { "profile.accomplishment.awards": { $each: [{ "awardId": id, "name": obj.name, "awardedBy": obj.awardedBy, "year": obj.year }] } } };
        let result = await dao.update(this.COLLECTION, query, newValue);
        return result;
    }

    /*
        @desc : "This function will update the award(according to user requirement) passed as obj to the user's profile... When we click on update award() then, the entered details will be fetched and passed as obj"
        @author :  Supriya Patil
        @param : {string} username, {string} award id, {object} award object
        @return : db update response
    */
    async updateAwards(uName, id, obj) {
        let query = { "userName": uName, "profile.accomplishment.awards.awardId": id };
        let newValue = {
            $set: {
                "profile.accomplishment.awards.$.name": obj.name,
                "profile.accomplishment.awards.$.awardedBy": obj.awardedBy,
                "profile.accomplishment.awards.$.year": obj.year
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
       @desc : "This function will remove the award passed as obj to the user's profile.. When we click on delete award(-) then, the entered details will be removed from the database"
       @author : Supriya Patil
       @param : {string} username, {string} award id
       @return : db update response
   */
    async removeAwards(uName, id) {
        let query = { userName: uName };
        let newValue = { $pull: { "profile.accomplishment.awards": { "awardId": id } } };
        let upsert = false;
        let bool = true;
        let result = await dao.update(this.COLLECTION, query, newValue, upsert, bool);
        return result;
    }

    /*
        @desc : "This function will add certificates passed as obj to the user's profile.. When we click on add certificates(+) then, the entered details will be fetched and passed as obj"
        @author : Soumyodipta Majumdar
        @param : {string} user name, {object} certifiactions object
        @return : db update resonse
    */
    async addCertifications(uName, obj) {
        const id = crypto.randomBytes(16).toString("hex");
        let query = { userName: uName };
        let newValue = { $push: { "profile.accomplishment.certifications": { $each: [{ "certificateId": id, "name": obj.name, "issuedBy": obj.issuedBy, "year": obj.year }] } } };
        let result = await dao.update(this.COLLECTION, query, newValue);
        return result;
    }

    /*
        @desc "This function will update the certificates(according to user requirement) passed as obj to the user's profile.. When we click on update certificate() then, the entered details will be fetched and passed as obj"
        @author : Soumyodipta Majumdar
        @param : {string} user name, {string} certifications id, {object} certifications object
        @return : db update response
    */
    async updateCertifications(uName, id, obj) {
        let query = { "userName": uName, "profile.accomplishment.certifications.certificateId": id };
        let newValue = {
            $set: {
                "profile.accomplishment.certifications.$.name": obj.name,
                "profile.accomplishment.certifications.$.issuedBy": obj.issuedBy,
                "profile.accomplishment.certifications.$.year": obj.year
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will remove the certificates passed as obj to the user's profile.. When we click on delete certificate(-) then, the entered details will be removed from the database"
        @author : Soumyodipta Majumdar
        @param : {string} user name, {string} certifiaction id
        @return : db update response
    */
    async removeCertifications(uName, id) {
        let query = { userName: uName };
        let newValue = { $pull: { "profile.accomplishment.certifications": { "certificateId": id } } };
        let upsert = false;
        let bool = true;
        let result = await dao.update(this.COLLECTION, query, newValue, upsert, bool);
        return result;
    }

    /*
       @desc "This function will add publications passed as obj to the user's profile.. When we click on add publications(+) then, the entered details will be fetched and passed as obj"
       @author : Anubha Joshi
       @param : {string} user name, {object} publications
       @return : db update response
   */
    async addPublications(uName, obj) {
        const id = crypto.randomBytes(16).toString("hex");
        let query = { userName: uName };
        let newValue = { $push: { "profile.accomplishment.publications": { $each: [{ "publicationId": id, "name": obj.name, "topic": obj.topic, "publishedBy": obj.publishedBy, "year": obj.year }] } } };
        let result = await dao.update(this.COLLECTION, query, newValue);
        return result;
    }

    /*
        @desc "This function will update the publications(according to user requirement) passed as obj to the user's profile.. When we click on update publication() then, the entered details will be fetched and passed as obj"
        @author : Anubha Joshi
        @param : {string} user name, {string} publications id
        @return : db update response
    */
    async updatePublications(uName, id, obj) {
        let query = { "userName": uName, "profile.accomplishment.publications.publicationId": id };
        let newValue = {
            $set: {
                "profile.accomplishment.publications.$.name": obj.name,
                "profile.accomplishment.publications.$.topic": obj.topic,
                "profile.accomplishment.publications.$.publishedBy": obj.publishedBy,
                "profile.accomplishment.publications.$.year": obj.year
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will remove the publications(according to user requirement) passed as obj to the user's profile.. When we click on remove publication() then, the publication details will be removed"
        @author : Anubha Joshi
        @param : {string} user name, {string} publications id
        @return : db update response
    */
    async removePublications(uName, id) {
        let query = { userName: uName };
        let newValue = { $pull: { "profile.accomplishment.publications": { "publicationId": id } } };
        let upsert = false;
        let bool = true;
        let result = await dao.update(this.COLLECTION, query, newValue, upsert, bool);
        return result;
    }

    /*
        @desc "This function will add endorsement(according to user requirement) passed as obj to the user's profile.. When we click on add endorsement() then, the entered details will be added to the user's profile"
        @author : Somya Burman
        @param : {string} user name, {object} endorsement object
        @return : db update response
        sample: 
        {
            user: (whom I'm endorsing),
            comment: (commenting something)
        }
    */
    async addEndorsement(uName, obj) {
        const id = crypto.randomBytes(16).toString("hex");
        let query = { userName: obj.user };
        let newValue = {
            $push: {
                "profile.endorsements":
                    {
                        $each: [
                            { "endorsementId": id, "endorsedBy": uName, "comment": obj.comment }]
                    }
            }
        };
        let result = await dao.update(this.COLLECTION, query, newValue);
        return result;
    }

    /*
        @desc "This function will add skills(according to user requirement) passed to the user's profile.. When we click on add skill() then, the entered details will be added to the user's profile"
        @author : Veshnavee Gupta
        @param : {string} user name, {string} skill value
        @return : db update response
    */
    async addSkill(uName, skill) {
        let query = { userName: uName };
        let newValue = { $push: { "profile.skills": skill } };
        let result = await dao.update(this.COLLECTION, query, newValue);
        return result;
    }

    /*
        @desc "This function will delete skills(according to user requirement) passed to the user's profile.. When we click on remove skill() then, the entered details will be removed from the user's profile"
        @author : Veshnavee Gupta
        @param : {string} user name, {string} skill value
        @return : db update response
    */
    async deleteSkill(uName, skill) {
        let query = { userName: uName };
        let newValue = { $pull: { "profile.skills": { $in: [skill] } } };
        let result = await dao.update(this.COLLECTION, query, newValue);
        return result;
    }

    /*
        @desc "This function will update bio(according to user requirement) passed to the user's profile.. When we click on add bio() then, the entered details will be added to the user's profile"
        @author : Dipmalya Sen
        @param : {string} user name, {object} bio
        @return : db update response
    */
    async updateBio(uName, obj) {
        let query = { userName: uName };
        let newValue = { $set: { "profile.bio": obj.bio } };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will add Experience(according to user requirement) passed to the user's profile.. When we click on add Experience() then, the entered details will be added from the user's profile"
        @author : Himani Jain
        @param : {string} user name, {object} Experience
        @return : db update response
    */
    async addExperience(uName, obj) {
        const id = crypto.randomBytes(16).toString("hex");
        let query = { userName: uName };
        let newValue = {
            $push: {
                "profile.experience":
                    {
                        $each: [
                            { "experienceId": id, "designation": obj.designation, "companyName": obj.companyName, "timePeriod": obj.timePeriod }]
                    }
            }
        }
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will update Experience(according to user requirement) passed to the user's profile.. When we click on update Experience() then, the entered details will be added from the user's profile"
        @author : Himani Jain
        @param : {string} user name, {string} experience id , {object} Experience
        @return : db update response
    */
    async updateExperience(uName, id, obj) {
        let query = { "userName": uName, "profile.experience.experienceId": id };
        let newValue = {
            $set: {
                "profile.experience.$.designation": obj.designation,
                "profile.experience.$.companyName": obj.companyName,
                "profile.experience.$.timePeriod": obj.timePeriod
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will remove Experience(according to user requirement) passed to the user's profile.. When we click on remove Experience() then, the entered details will be removed from the user's profile"
        @author : Himani Jain
        @param : {string} user name, {string} experience id
        @return : db update response
    */
    async removeExperience(uName, id) {
        let query = { userName: uName };
        let newValue = { $pull: { "profile.experience": { "experienceId": id } } };
        let upsert = false;
        let bool = true;
        let result = await dao.update(this.COLLECTION, query, newValue, upsert, bool);
        return result;
    }

    /*
        @desc "This function will add Education(according to user requirement) passed to the user's profile.. When we click on add Education() then, the entered details will be added from the user's profile"
        @author : Lalithya Satya
        @param : {string} user name, {object} Education
        @return : db update response
    */
    async addEducation(uName, obj) {
        const id = crypto.randomBytes(16).toString("hex");
        let query = { userName: uName };
        let newValue = {
            $push: {
                "profile.education":
                    {
                        $each: [
                            { "educationId": id, "degreeName": obj.degreeName, "university": obj.university, "percentage": obj.percentage, "yearOfPassing": obj.yearOfPassing }]
                    }
            }
        }
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will update Education(according to user requirement) passed to the user's profile.. When we click on update Education() then, the entered details will be added from the user's profile"
        @author : Lalithya Satya
        @param : {string} user name, {string} education id , {object} Education
        @return : db update response
    */
    async updateEducation(uName, id, obj) {
        let query = { "userName": uName, "profile.education.educationId": id };
        let newValue = {
            $set: {
                "profile.education.$.degreeName": obj.degreeName,
                "profile.education.$.university": obj.university,
                "profile.education.$.percentage": obj.percentage,
                "profile.education.$.yearOfPassing": obj.yearOfPassing
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will remove Education(according to user requirement) passed to the user's profile.. When we click on remove Education() then, the entered details will be removed from the user's profile"
        @author : Lalithya Satya
        @param : {string} user name, {string} education id
        @return : db update response
    */
    async removeEducation(uName, id) {
        let query = { userName: uName };
        let newValue = { $pull: { "profile.education": { "educationId": id } } };
        let upsert = false;
        let bool = true;
        let result = await dao.update(this.COLLECTION, query, newValue, upsert, bool);
        return result;
    }

    /*
        @desc "This function will fetch the number of connections a user has
        @author : Supriya Patil
        @param : {string} user name
        @return : {number} number of connections
    */
    async countConnection(uName) {
        let query = [{ $match: { "userName": uName } }, { $project: { count: { $size: "$connections" }, "_id": 0 } }]
        let result = await dao.aggregate(this.COLLECTION, query);
        return result;
    }

    /*
        @desc "This function will update Name(according to user) passed to the user's profile.. When we click on updateName() then, the entered detail will be updated to the user's profile"
        @author : Shrishti
        @param : {string} user name, {obj} name
        @return : db update response
    */

    async updateName(uName, obj) {
        let query = { "userName": uName };
        let newValue = {
            $set: {
                "name": obj.name
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will update DOB(according to user) passed to the user's profile.. When we click on updateDOB() then, the entered detail will be updated to the user's profile"
        @author : Shrishti
        @param : {string} user name, {obj} dateOfBith
        @return : db update response
    */

    async updateDOB(uName, obj) {
        let query = { "userName": uName };
        let newValue = {
            $set: {
                "dateOfBirth": obj.dateOfBirth
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will update Email(according to user) passed to the user's profile.. When we click on updateEmail() then, the entered detail will be updated to the user's profile"
        @author : Anubha Joshi
        @param : {string} user name, {obj} email
        @return : db update response
    */

    async updateEmail(uName, obj) {
        let query = { "userName": uName };
        let newValue = {
            $set: {
                "email": obj.email
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }

    /*
        @desc "This function will update Mobile(according to user) passed to the user's profile.. When we click on updateMobile() then, the entered detail will be updated to the user's profile"
        @author : Anubha Joshi
        @param : {string} user name, {obj} mobile
        @return : db update response
    */

    async updateMobile(uName, obj) {
        let query = { "userName": uName };
        let newValue = {
            $set: {
                "mobile": obj.mobile
            }
        };
        let upsert = { "upsert": true };
        let result = await dao.update(this.COLLECTION, query, newValue, upsert);
        return result;
    }


}

module.exports = Controller;
