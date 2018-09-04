const express = require('express');
const app = express();

const Dao = require('../data-access/data-access');
const dao = new Dao();

/*
*Description:when the user clicks on 'Like':Based on postuserId and postid
*       the name of the particular user will be added to the like section
*       of that particular post along with time.
*(postuserId,postid,username,timestamp)
*@author (P.Puneeth,Sajida)
*@param {Database collection} collections 
*@param {number} postuserId
*@param {number} postid
*@param {string} username
*@param {date} timestamp
*@returns {object} result
*/

/*
*Description:when the user again clicks on 'Like':Based on postuserId and postid
*       the name of the particular user will be removed from the like section
*       of that particular post along with time.
*(postuserId,postid,username,timestamp)
*@author (P.Puneeth,Sajida)
*@param {Database collection} collections 
*@param {number} postuserId
*@param {number} postid
*@param {string} username
*@param {date} timestamp
*@returns {object} result
*/


class likes {

      async getLike(collections,userName, postedBy, postId) {
       let result = await dao.update(collections, {$and:[{"userName":postedBy},{"posts.postId":postId}]},{$push:{"posts.$.likes":{"likedBy":userName,"timestamp":new Date()}}});
        return (result);
    }

    async removeLike(collections,userName,postedBy,postId) {
        
       let result = await dao.update(collections, {$and:[{"userName":postedBy},{"posts.postId":postId}]},{$pull:{"posts.$.likes":{"likedBy":userName}}});
        return (result);
    }


    async getLikeDetails(collections,userName,id) {
    let query = [{ $match: {$and:[{"userName":userName},{ "posts.postId": id }]} }, { $project: {"posts.postId": 1, "posts.likes": 1,_id:0} }]
        let result=await dao.aggregate(collections,query);
      result=result[0].posts;
        result=result.filter(t=>{
            if(t.postId==id){
                return t;
            }
            else return 0;
        })
        return(result);
     }
}
module.exports = likes