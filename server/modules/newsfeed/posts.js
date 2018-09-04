const Dao = require('../data-access/data-access');
const dao = new Dao();

//required to generate unique Id
const uuidv4 = require('uuid/v4');


class Posts {

    /**
     * @description to insert post in the database by the user
     * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
     * @param {Object} data
     * @param {string} userName
     * @returns {Object} result 
     */
    async createPosts(collections, data, userName) {
        data.postId = uuidv4();
        data.timestamp = new Date();
        data.likes = [];
        data.comments = [];
        var filter = { "userName": userName };
        var content = { $push: { "posts": data } };
        var result = await dao.update(collections, filter, content)
        return data
    }

    /**
     * @description to edit post inserted in the database by the user
     * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
     * @param {Object} data
     * @param {string} userName
     * @param {string} postId
     * @returns {Object} result 
     */
    async editPosts(collection, data, userName, postid) {
        var filter = { "userName": userName, "posts.postId": postid };
        var content = { $set: { "posts.$.content": data.content } };
        var result = await dao.update(collection, filter, content)
        return result
    }

    /**
     * @description to delete post inserted in the database by the user
     * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
     * @param {string} userName
     * @param {string} postId
     * @returns {Object} result 
     */
    async deletePosts(collection, userName, postid) {
        var filter = { "userName": userName };
        var content = { $pull: { "posts": { postId: postid } } };
        var result = await dao.update(collection, filter, content)
        return result
    }

}

module.exports = Posts