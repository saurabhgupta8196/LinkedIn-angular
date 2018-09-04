/**
 * @author Nandkumar Gangai and Harshita Shrivastava
 * @version 1.0
 * @since 26-08-2018
 * 
 * Controller layer with methods to fire queries on database using dataLayer
 */

const express = require('express');
const app = express();

const Dao = require('../data-access/data-access');
const dao = new Dao();


class Connections {

    /**
     *Description - Get all the data of a (user)
     * @author Nidhi
     * @param {string} collections name of collection
     * @param {string} name username
     * @returns {object} result 
     */
    async getData(collections, name) {
        let result = await dao.find(collections, { userName: name });
        return (result);
    }


    /**
     * Description - Get name and image of a (user)
     * @author Harshita, Nandkumar
     * @param {string} collections name of collection
     * @param {string} name username
     * @returns {object} result
     */
    async getNameAndImage(collections, name) {
        let result = await dao.aggregate(collections, [{ $match: { userName: name } }, { $project: { name: "$name", _id: "$userName", profile: "$profile.image" } }]);
        return (result[0]);
    }


    /**
     * Description - Getting count of connections
     * @author Nidhi
     * @param {string}  collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {number} result (count of connections)
     */
    async getConnectionCount(collections, user) {
        let result = await dao.aggregate(collections, [{ $match: { userName: user } }, { $group: { _id: "$userName", count: { $sum: { $size: "$connections" } } } }]);
        // console.log(result);
        return (result[0].count.toString());
    }

    /**
     *Description - Sending Connect request
     * (sender - receiver)
     * @author Harshita, Nandkumar
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {object} result 
     */
    async connect(collections, sender, receiver) {
        let result = await dao.update(collections, { userName: sender }, { $push: { "connectionRequests.sent": receiver } });
        let res = await dao.update(collections, { userName: receiver }, { $push: { "connectionRequests.receive": sender } });
        return (result);
    }

    /**
     * Description - Accepting connection request
     * (user - requester)
     * @author Kameshwar
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {object} result
     */
    async acceptInvitation(collections, user, requester) {
        let result = await dao.update(collections, { userName: user }, { $pull: { "connectionRequests.receive": requester } });
        let res = await dao.update(collections, { userName: user }, { $push: { "connections": requester } });
        res = await dao.update(collections, { userName: requester }, { $pull: { "connectionRequests.sent": user } });
        res = await dao.update(collections, { userName: requester }, { $push: { "connections": user } });
        return (result);
    }

    /**
     * Description - Remove connection
     * (user - connection)
     * @author Harshita, Nandkumar
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {object} result
     */
    async removeConnection(collections, user, connection) {
        console.log(queryData);
        let result = await dao.update(collections, { userName: user }, { $pull: { "connections": connection } });
        let res = await dao.update(collections, { userName: connection }, { $pull: { "connections": user } });
        return (result);
    }

    /**
     * Description - Blocking connection
     * (user - blockee)
     * @author Akhil
     * @param {stirng} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {object} result
     */
    async blockConnection(collections, user, blockee) {
        //console.log(queryData);
        let result = await dao.update(collections, { userName: user }, { $push: { "blocklist.blocked": blockee } });
        let res = await dao.update(collections, { userName: blockee }, { $push: { "blocklist.blockedBy": user } });

        return (result);
    }

    /**
    * Description - Unblocking connection
    * (user-blockee)
    * @author Prabha
    * @param {string} collections name of collection
    * @param {object} queryData data to be passed in the query
    */
    async unblock(collections,user, blockee) {
        //console.log(queryData);
        let result = await dao.update(collections, { userName: user }, { $pull: { "blocklist.blocked": blockee } });
        let res = await dao.update(collections, { userName: blockee }, { $pull: { "blocklist.blockedBy": user } });
    }


    /**
     * Description - Ignoring Invitation Received
     * (user-sender)
     * @author Ganesh
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     */
    async ignoreRequest(collections, user, sender) {
        //console.log(queryData);
        let result = await dao.update(collections, { userName: user }, { $pull: { "connectionRequests.receive": sender } });
        let res = await dao.update(collections, { userName: sender }, { $pull: { "connectionRequests.sent": user } });
    }


    /**
     * Description -View Invitations Sent Count
     * (user)
     * @author Kameshwar, Ganesh
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {number} result 
     */
    async invitationsSentCount(collections, user) {
        let result = await dao.aggregate(collections, [{ $match: { userName: user } }, { $group: { _id: "$userName", count: { $sum: { $size: "$connectionRequests.sent" } } } }]);
        return (result[0].count.toString());
    }

    /**
     * Description -View Invitations Received Count
     * (user)
     * @author Sameera
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {number} result
     */
    async invitationsReceivedCount(collections, user) {
        let result = await dao.aggregate(collections, [{ $match: { userName: user } }, { $group: { _id: "$userName", count: { $sum: { $size: "$connectionRequests.receive" } } } }]);
        return (result[0].count.toString());
    }

    /**
     * Description -View Invitations Sent
     * (user)
     * @author Kameshwar, Ganesh
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {number} result
     */
    async invitationsSent(collections, queryData) {
        let result = await dao.aggregate(collections, [{ $match: { userName: queryData.user } }, { $project: { sent: "$connectionRequests.sent" } }]);
        return (result);
    }

    /**
     * Description -View Invitations Received
     * (user)
     *  @author Sameera, Kameshwar
     * @param {string} collections  name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {number} result
     */
    async invitationsReceived(collections, user) {
        let result = await dao.aggregate(collections, [{ $match: { userName: user } }, { $project: { receive: "$connectionRequests.receive" } }]);
        return (result);
    }


    /**
     * Description -View Connections List
     * (user)
     * @author Harshita, Nandkumar
     * @param {string} collections name of collection
     * @param {object} queryData data to be passed in the query
     * @returns {name} result
     */
    async getConnectionsList(collections, user) {
        let result = await dao.aggregate(collections, [{ $match: { userName: user } }, { $project: { connections: "$connections" } }]);
        return (result);
    }

    /**
        * Description -Follow a company
        * (user,companyId)
        * @author Harshita, Nandkumar
        * @param {string} collections name of User collection
        * @param {object} queryData data to be passed in the query
        * @returns {name} result
        */
    async followCompany(userCollection, orgCollection, user, companyId) {
        let result = await dao.update(userCollection, { userName: user }, { $push: { "followingCompany": companyId } });
        result = await dao.update(orgCollection, { companyID: companyId }, { $push: { "profile.followers": user } });
        return (result);
    }
}

module.exports = Connections;