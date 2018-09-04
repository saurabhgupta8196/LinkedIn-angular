const Dao = require('../data-access/data-access');
const dao = new Dao();

const crypto = require("crypto");

class Company {
    /**
     * @description Getting data of a company based on ID
     * (companyId)
     * @author Jayasree, Sameera
     * @param {string} collection having collection name
     * @param {object} queryData having input data object
     * @returns {object} result
     */
    async getData(collection, queryData) {
        let result = await dao.find(collection, { "companyID": queryData.companyId });
        return (result);
    }

    /**                                
     * @description -Getting list of jobs
     * (companyId)
     * @author Akhil, Jayasree
     * @param {string} collection having collection name
     * @param {object} queryData input data object
     * @returns {object} result
     */
    async jobList(collection, queryData) {
        // console.log(queryData);
        let result = await dao.aggregate(collection, [{ $match: { "companyID": queryData.companyId } }, { $project: { "profile.jobs": 1 } }]);
        return (result[0].profile.jobs);
    }
    /**
     * @description -Adding job post details
     * (companyId, jobId, jobPosition, postDate, lastDate, applicants*)
     * @author Jayasree, Sameera
     * @param {string} collection having collection name
     * @param {object} queryData input data object
     * @returns {object} result
     */
    async addJobPost(collection,companyId, queryData) {
        let date = new Date()
        let lastDate = new Date(queryData.lastDate)
        let id = crypto.randomBytes(16).toString("hex");
        let result = await dao.update(collection, { "companyID": companyId }, { $push: { "profile.jobs": { "jobId": id, "position": queryData.jobPosition, "timestamp": date, "lastDate": lastDate, "applicants": [] } } });
        return (result);
    }

    /**
     * @description -Getting job details
     * (companyId,jobId)
     * @author Harshita
     * @param {string} collection having collection name
     * @param {object} queryData input data object
     * @returns {object} result
     */
    async getJobDetails(collection, queryData) {
        let result = await dao.aggregate(collection, [{ $match: { 'companyID': queryData.companyID } }, { $project: { post: { $filter: { input: '$profile.jobs', as: 'job', cond: { $eq: ['$$job.jobId', queryData.jobId] } } }, _id: 0 } }]);
        console.log(result)
        return 'abc'//(result[0].post[0]);
    }


    /**
     * @description -Adding new post
     * (companyId, postId, content)
     * @author Sameera,Sahithi
     * @param {string} collection having collection name
     * @param {object} queryData input data object
     * @returns {object} result
     */
    async addPost(collection, companyId, queryData) {
        let id = crypto.randomBytes(16).toString("hex")
        let postDate = new Date()
        let result = await dao.update(collection, { "companyID": companyId }, { $push: { "profile.post": { "postId": id, "content": queryData.content, "timestamp": postDate, likes: [], comments: [] } } });
        console.log(result)
        return (result);
    }

    /**
     * @description Removing job post details
     * (companyId, jobId)
     * @author Harshita
     * @param {string} collection having collection name
     * @param {object} queryData having query
     * @returns {object} result
     */
    async removeJobPost(collection, companyId, queryData) {
        let result = await dao.update(collection, { 'companyID': companyId }, { $pull: { "profile.jobs": { jobId: queryData.jobId } } });
        // console.log("Deleted");
        // console.log(result);
        return (result);
    }

    /**
     * @description -Getting list of applicants
     * (companyId, jobId)
     * @author Jayasree,Sameera
     * @param {string} collection having collection name
     * @param {object} queryData having query
     * @returns {object} result
     */
    async applicantList(collection, companyId, queryData) {
        let result = await dao.aggregate(collection, [{ $match: { "companyID": companyId } }, { $project: { "profile.jobs": 1, "_id": 0 } }]);
        for (let job of result[0].profile.jobs) {
            if (job.jobId === queryData.jobId)
                return job.applicants;
        }
        return ({ err: "No such job found" });
    }

    /**
     * @description -Getting applicant count for specific job id
     * (companyId,jobId)
     * @author Nandkumar
     * @param {string} collection having collection name
     * @param {object} queryData having query
     * @returns {object} result
     */
    async getApplicantCount(collection, companyId, queryData) {
        let result = await dao.aggregate(collection, [{ $match: { "companyID": companyId } }, { $project: { "profile.jobs": 1, "_id": 0 } }]);
        console.log(result[0].profile.jobs);
        for (let job of result[0].profile.jobs) {
            if (job.jobId === queryData.jobId)
                return ({ "length": job.applicants.length });
        }
        return ({ err: "No applicants" });
    }

    /**
     * @description -Like post
     * (companyId, postId, user)
     * @author Nandkumar
     * @param {string} collection having collection name
     * @param {object} queryData input data object
     * @returns {object} result
     */
    
    async likePost(collection, queryData, user) {
        let result = await dao.update(collection, { "companyID": queryData.companyID, 'profile.post.postId': queryData.postId }, { $push: { "profile.post.$.likes": { "likedBy": user, "timestamp": new Date() } } });
        return (result);
    }


    /**
    * @description Add applicant to the applicant list
    * (companyId, jobId, applicant)
    * @author Nandkumar
    * @param {string} collection having collection name
    * @param {object} queryData having query
    * @returns {object} result
    */
   /**
    * @required
    */
    async addApplicantToList(collection, queryData, applicant) {
        let result = await dao.update(collection, { "companyID": queryData.companyID, 'profile.jobs.jobId': queryData.jobId }, { $push: { "profile.jobs.$.applicants": applicant } });
        return result;
    }
}

module.exports = Company;


/*
db.orgs.aggregate([
    {$match: {'companyID': 'C006'}},
    {$project: {
        post: {$filter: {
            input: '$profile.jobs',
            as: 'job',
            $cond: {$eq: ['$$job.jobId', 'J008']}
        }},
        _id: 0
    }}
])*/