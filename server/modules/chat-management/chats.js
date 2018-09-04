var Dao = require('../data-access/data-access')
const dao = new Dao()

const collection = "conversations"

class Chats {

    /**
     * Description - To get the complete conversation between two users
     * @author Vinal Bang, Kuldeep 
     * @param {Object} requestBody contains user 1 and user 2 details
     * @returns {Object} returns the array of messages exchanged between the users 
     */
    async getChatsBetweenUsers(user1, user2) {
        let result
        try {
            result = await dao.aggregate(collection, [{ $match: { participants: { $all: [user1, user2] } } }, { $project: { _id: 0, messages: 1 } }])
        }
        catch (err) {
            result = { error: "err" }
        }
        return result[0].messages
    }
    


    /**
     * Description - To check whether there exist a message in conversation between the users
     * @author Vinal Bang, Kuldeep 
     * @param {Object} requestBody contains user 1 and user 2 details
     * @returns {Object} returns true if conversation between two users exist and false if doesn't 
     */
    async conversationExist( user1, user2) {
        
        let result = await dao.find(collection, { participants: { $all: [user1, user2] } });
        if (result.length === 0) {
            return false;
        } else {
            return true;
        }
    }




    /**
     * Description - to create a new conversation between the given users
     * @author Vinal Bang, Kuldeep 
     * @param {Object} requestBody contains user 1, user 2, sender and content of the message 
     * @returns {Object} returns the result of query executed
     */
    async newConversation(sender, receiver, content) {
        let query = { "participants": [sender, receiver], "messages": [{ "sender": sender, "content": content, timestamp: new Date() }] }
        let result
        try {
            result = await dao.insert(collection, query); 
        }
        catch (err) {
            result = { error: "err" }
        }
        return result;
    }
    


    /**
     * Description - function to  add message in a chat that already exist
     * @author Vinal Bang, Kuldeep 
     * @param {Object} requestBody contains user 1, user 2, sender and content of the message 
     * @returns {Object} returns the result of query executed
     */
    async addMessageInConversation(sender, receiver, content) {
        let result
        try {
            result = await dao.update(collection, { participants: { $all: [sender, receiver] } }, { $push: { "messages": { "sender": sender, "content": content, "timestamp": new Date() } } });
        }
        catch (err) {
            result = { error: "err" }
        }
        return result;
    }


    /**
     * Description - function to  delete message in a chat that already exist
     * @author Vinal Bang, Kuldeep 
     * @param {Object} requestBody contains user 1, user 2 and timestamp of message 
     * @returns {Object} returns the result of query executed
     */
    async deleteSingleMessage(user1, user2, timestamp) {
        let result
        try {
            result = await dao.update(collection, { participants: { $all: [user1, user2] } }, { $pull: { "messages": { "timestamp": new Date(timestamp) } } })
        }
        catch (err) {
            result = { error: "err" }
        }
        return result;
    }

    /**
     * Description - function to  get all the users the given user has conversation with
     * @author Vinal Bang, Kuldeep 
     * @param {Object} requestBody contains user  
     * @returns {Object} returns the list of users with their last message who have conversation with give user
     */
    async hasConversationsWith(user) {
        let result
        try {
            result = await dao.aggregate(collection, [{ $match: { participants: user } }, { $project: { participants: 1, messages: 1, _id: 0 } }]);
            result = result.map(t => {
                var temp
                var msg
                var x = t.participants
                var l = t.messages.length
                
                x = x.filter(val => {
                    if (val != user) {
                        if (l != 0) {
                            msg = t.messages[l - 1];
                            return (val);
                        }
                        return 0;
                    }
                })
                temp = {
                    "participant": x,
                    "lastMessage": msg
                }
                return temp;
            })
            console.log(result);
        }
        catch (err) {
            result = { error: err }
        }
        return result;
    }



}

module.exports = Chats;