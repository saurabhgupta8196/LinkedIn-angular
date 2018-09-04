const express = require('express');
const app = express();

const Dao = require('../data-access/data-access');
const dao = new Dao();

class Comments {

/*******************
 * @Description retrives particular comments of the post based on postId
 * @author Dnyanda Deshpande, A Haritha, Aditya Gupta
 * @params {database collection} collections
 * @params {integer} id
 * @params {object} result array of comments based on postId
 */
   /* async getComments(collections, id) {
        let query = [{ $match: { "posts.postId": id } }, { $project: { "posts.comments": 1, "posts.postId": 1 ,_id:0} }]
        let result = await dao.aggregate(collections, query);
        result=result[0].posts;
        result=result.filter(t=>{
            if(t.postId==id){
                return t;
            }
            else return 0;
        })
        let count = result[0].comments.length;
        result.push({ "count": count })

        //console.log(result[1].count);
        return (result);
    }*/


      async getComments(collections,username, id) {
        let query = [{ $project: { "userName":1,"posts.postId":1,"posts.comments": 1 } },{$unwind:"$posts"},{ $match:{$and:[{"userName":username},{ "posts.postId": id }]} } ]
        let result = await dao.aggregate(collections, query);
      
        // userName is like "dip95"

        console.log(result)
        return (result);
    }


/*******************
 * @Description adds particular comments of the post based on postId and userId
 * @author Dnyanda Deshpande, A Haritha, Aditya Gupta, Pawan Parihar
 * @params {database collection} collections
 * @params {integer} uId: id of the person who has posted..
 * @params {integer} pId: post Id
 * @params {Object} req {content:""}
 * @params {String} user: person who is logged in and wants to comment..
 * @params {object} result adds data in comments array based on postId and userId
 */

    async postComments(collections, uId, pId, requestBody, user) {
        let query = { $and: [{ "userName": uId }, { "posts.postId": pId }] };
        let newquery = { $push: { "posts.$.comments": { "commentedBy": "saurabhgupta","content": requestBody.content, "timestamp": new Date() } } }
        
                                                            // take "saurabhgupta"" from session usser that is full name of Session User
        
        let result = await dao.update(collections, query, newquery);
        return (result)
    }
}

module.exports = Comments;