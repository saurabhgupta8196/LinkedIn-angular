const express = require('express');
const app = express();

const Dao = require('../data-access/data-access');
const dao = new Dao();

class NewsFeed {
    /**
    * @description to sort the post in given timestamp order and to retrieve the posts of the connections and following company
    * @author Saurabh Gupta,Mayank Raj
    * @param {string} userName
    * @param {object} collections
    * @returns {Object} result 
    */
    async getNewsFeed(collections, userName) {
        let result = await dao.aggregate(collections, [{ $match: { "userName": userName } },
        { $project: { allValues: { $setUnion: ["$connections", "$followingCompany"] }, _id: 0 } }])

        var getPosts;
        var array = []
        var postsArray = []

        result = result[0].allValues;
        result.push(userName);

        for (var i of result) {
            getPosts = await dao.aggregate(collections, [{ $match: { "userName": i } },
            { $project: { "posts": 1, _id: 0,"userName":1,"name":1, "profile.image":1} }])
            getPosts.map(temp => {
                let userName=temp.userName
                let name=temp.name
                let image = temp.profile.image
                temp.posts.map(t => {
                    t.userName=userName
                    t.name=name
                    t.image = image
                    postsArray.push(t);
                    
                })
                return temp.posts;
            })
        }

        postsArray.sort((a, b) => {
            if (a.timestamp > b.timestamp) {
                return -1;
            }
            else if (a.timestamp < b.timestamp) {
                return 1;
            }
            else
                return 0;
        })

        return postsArray;
    }

}
module.exports = NewsFeed;
