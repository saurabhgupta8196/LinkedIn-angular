/**
 * @author Nandkumar Gangai and Harshita Shrivastava
 * @version 1.0
 * @since 26-08-2018
 * 
 * Service layer to interact with the frontend
 */
const env = require('dotenv')
env.load()
const express = require('express')
const cors = require('cors');
var parser = require("body-parser");
const session = require('express-session')
const app = express()

//const Connection = require('./connection');
const Connection = require('./modules/connection-management/connection');
const Dao = require('./modules/data-access/data-access')
var Company = require("./modules/company-management/company");

const postlikes = require('./modules/newsfeed/likes');//puneeth
const likecollection = new postlikes();

const connection = new Connection();
const dao = new Dao()

const company = new Company();
const connCollection = "users";
const orgCollection = "organizations"

const SessMan = require('./modules/user-management/session')
const sessManager = new SessMan()

app.use(session(sessManager.init()))


app.use(parser.json());
app.use(cors());

//-----------------Account Management-------------------//

const UserManagement = require('./modules/user-management/user_management')
const OrganizationManagement = require('./modules/organization-management/organization-management')

//const dao = new Dao()
const users = new UserManagement()
const orgs = new OrganizationManagement()


/*********************user signup***********************/
app.get('/rest-api/users/get', async (req, res) => {
    let result = await users.findAll();
    res.send(result)
})
app.use(parser.json());

//method on clicking signUp 
/**
 * @required @tested
 */
/*
    name,  userName,  password,  email,  mobile,  dateOfBirth,  gender,
 */
app.post('/rest-api/users/signup', async (req, res) => {
    let authData = await users.authInsert(req.body);
    let result = await users.signupInsert(req.body);
    let verifyUser = await users.verifyInsert(req.body);
    let verficationData = await users.findVerificationData(req.body);
    res.send(verficationData);
})

/**
 * @required @tested
 */
//To activate the account
app.delete('/rest-api/users/activate/:userName/:verificationCode', async (req, res) => {
    let result = await users.deleteVerifiedUser(req.params)
    res.send(result)
})

/**
 * @required @tested
 */
//updated Code for verification
app.patch('/rest-api/users/update/verificationCode', async (req, res) => {
    let result = await users.updateVerifyCode(req.body.userName)
    res.send(result)
})

/*********************organization signup***********************/
app.get('/rest-api/orgs/get', async (req, res) => {
    let result = await orgs.findAll();
    res.send(result)
})
app.use(parser.json());
//method on clicking signUp 
/**
 * @required @tested
 */
app.post('/rest-api/orgs/signup', async (req, res) => {
    let authData = await orgs.authInsert(req.body);
    let result = await orgs.signupInsert(req.body);
    let verifyUser = await orgs.verifyInsert(req.body);
    let verficationData = await orgs.findVerificationData(req.body);
    res.send(verificationData)

})
//after activating the link
/**
 * @required @tested
 */
app.delete('/rest-api/orgs/activate/:companyID/:verificationCode', async (req, res) => {
    let result = await orgs.deleteVerifiedUser(req.params)
    res.send(result)
})

//updated link for verification
/**
 * @required @tested
 */
app.patch('/rest-api/orgs/update/verificationCode', async (req, res) => {
    let result = await orgs.updateVerifyCode(req.body.companyID)
    res.send(result)
})

/*
//method on clicking signUp 
app.post('/rest/api/users/add', async (req, res) => {
    let authData = await users.authInsert(req.body);
    let result = await users.signupInsert(req.body);  
    let verifyUser = await users.verifyInsert(req.body);
    
})
*/

/**
 * @required @tested
 */
app.post('/rest/api/users/uniqueUserName', async (req, res) => {
    let isUniqueUser = await users.uniqueUserName(req.body.userName);
    //let isUniqueOrg = await orgs.uniqueUserName(req.body.userName)
    res.send(isUniqueUser);
})

/**
 * @required @tested
 */
app.post('/rest/api/orgs/uniqueUserName', async (req, res) => {
    //let isUniqueUser = await users.uniqueUserName(req.body.companyID);
    let isUniqueOrg = await orgs.uniqueUserName(req.body.companyID)
    res.send((isUniqueOrg));
})

/**
 * @required @tested
 */
//unique email check
app.post('/rest/api/users-orgs/uniqueEmail', async (req, res) => {
    let isUniqueUser = await users.uniqueEmail(req.body.email);
    let isUniqueOrg = await orgs.uniqueEmail(req.body.email)
    res.send((isUniqueUser && isUniqueOrg));
})



/*
//method on clicking signUp 
app.post('/rest/api/orgs/add', async (req, res) => {
    let authData = await orgs.authInsert(req.body);
    let result = await orgs.signupInsert(req.body);  
    let verifyUser = await orgs.verifyInsert(req.body);
    
})
*/

/*********************login***********************/
/*********************users**********************/
//method on clicking login
/**
 * @required @tested
 */
app.post('/rest-api/user/login', async (req, res) => {
    let result = await users.signin(req.body);
    if (result == "Logged In")
        sessManager.setUser(req, req.body.userName)
    res.send(result);
})

/**
 * @required @tested
 */
app.post('/rest-api/user/logout', async (req, res) => {
    console.log(sessManager.getUserOrError401(req, res))
    sessManager.resetUser(req)
    res.send('Logged Out')
})

//method on clicking forgot password
/**
 * @required @tested
 */
app.post('/rest-api/user/forget-password', async (req, res) => {
    let result = await users.forgotPassword(req.body);
    res.send(result)
})


//method to update new Password
/**
 * @required @tested
 */
app.patch('/rest-api/user/change-password/:userName/:verificationCode', async (req, res) => {
    let result = await users.changePassword(req.params.userName, req.params.verificationCode,
        req.body.password);
    res.send(result)
})

//method to change password for logged In user
/**
 * @required @tested
 */
app.patch('/rest-api/user/update-password', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await users.updatePassword(user, req.body.password)
        res.send(result)
    }
})
/****************************org**************************/
//method on clicking loginIn
/**
 * @required @tested
 */
app.post('/rest-api/orgs/login', async (req, res) => {
    let result = await orgs.signin(req.body);
    if (result == "Logged In")
        sessManager.setUser(req, req.body.companyID)
    res.send(result);
})

/**
 * @required @tested
 */
app.post('/rest-api/orgs/logout', async (req, res) => {
    console.log(sessManager.getUserOrError401(req))
    sessManager.resetUser(req)
    res.send('Logged Out')
})

//method on clicking forgot password
/**
 * @required @tested
 */
app.post('/rest-api/orgs/forget-password', async (req, res) => {
    let result = await orgs.forgotPassword(req.body);
    res.send(result)
})

//method to update new Password
/**
 * @required @tested
 */
app.patch('/rest-api/orgs/change-password/:companyID/:verificationCode', async (req, res) => {
    let result = await orgs.changePassword(req.params.companyID, req.params.verificationCode,
        req.body.password);
    res.send(result)
})


//method to change password for logged In org
/**
 * @required @tested
 */
app.patch('/rest-api/orgs/update-password', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await orgs.updatePassword(user, req.body.password)
        res.send(result)
    }
})


/**
 * @author Nandkumar
 */
app.post('/rest-api/user/getData', async (req, res) => {
    try {
        let result = await connection.getData(connCollection, req.body.user);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
* Getting count of connections
*/
app.post('/rest-api/user/get-count/connections', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.getConnectionCount(connCollection, user);
            res.end(result);
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
 * Sending Connect request
 * (receiver)
 */
/**
 * @required
 */
app.post('/rest-api/user/send-invitation', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result1 = await connection.connect(connCollection, user, req.body.receiver);
            res.end("Request Sent");
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
 * Accepting follow request
 * (user - requester)
 */
/**
 * @required
 */
app.post('/rest-api/user/accept-invitation', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.acceptInvitation(connCollection, user, req.body.requester);
            res.end("Request Accepted");
        }
        catch (err) {
            res.end({
                err: err
            });
        }
    }
})


/**
 * removing connection
 * (user - connection)
 */
/**
 * @required
 */
app.post('/rest-api/user/remove-connection', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.removeConnection(connCollection, user, req.body.connection);
            res.end("Removed");
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
 * Blocking connection
 * (user - blockee)
 */
/**
 * @required
 */
app.post('/rest-api/user/block', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.blockConnection(connCollection, user, req.body.blockee);
            res.end("Blocked");
        }
        catch (err) {
            res.end("Error 404");
        }

    }
})


/**
* Unblocking connection
*(user-blockee)
*/
/**
 * @required
 */
app.post('/rest-api/user/unblock', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result1 = await connection.unblock(connCollection, user, req.body.blockee);
            res.end("Unblocked");
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
 * Ignoring Invitation Received
 * (sender)
 */
/**
 * @required
 */
app.post('/rest-api/user/ignore-invitation', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result1 = await connection.ignoreRequest(connCollection, user, req.body.sender);
            res.end("Request Ignored");
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
 * View Invitations Sent Count
 * (user)
 */
app.post('/rest-api/user/get-invitation-count/sent', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.invitationsSentCount(connCollection, user);
            res.end(JSON.stringify(result));
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
 * View Invitations Received Count
 */
app.post('/rest-api/user/get-invitation-count/received', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.invitationsReceivedCount(connCollection, user);
            res.end(JSON.stringify(result));
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
* View Invitations Sent
*/
app.post('/rest-api/user/get-invitations/sent', async (req, res) => {
    try {
        let result = await connection.invitationsSent(connCollection, req.body);
        var sentData = [];
        console.log(result[0].sent.length);
        for (let s of result[0].sent) {

            sentData.push(await connection.getNameAndImage(connCollection, s))
        }
        res.end(JSON.stringify(sentData));
    }
    catch (err) {
        res.end("Error 404");
    }
})

/**
* View Invitations Received
*/
app.post('/rest-api/user/get-invitations/received', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.invitationsReceived(connCollection, user);
            var receivedData = [];
            console.log(result[0].receive.length);
            for (let r of result[0].receive) {

                receivedData.push(await connection.getNameAndImage(connCollection, r))
            }
            res.end(JSON.stringify(receivedData));
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})


/**
 * View All Connections
 */
app.post('/rest-api/user/get-all-connections', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.getConnectionsList(connCollection, user);
            var receivedData = [];
            console.log(result[0].connections.length);
            for (let c of result[0].connections) {
                receivedData.push(await connection.getNameAndImage(connCollection, c))
            }
            res.end(JSON.stringify(receivedData));
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})

/**
 * Follow a company
 */
/**
 * @required
 */
app.post('/rest-api/user/follow-company', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        try {
            let result = await connection.followCompany(connCollection, orgCollection, user, req.body.companyID);
            res.end(JSON.stringify(result));
        }
        catch (err) {
            res.end("Error 404");
        }
    }
})

//--------------------------

/**
 * Getting data of a company based on ID
 * (companyId)
 * CO
 */
app.post('/rest-api/user/orgs/get', async (req, res) => {
    let result = await company.getData(orgCollection, req.body);
    res.send(result);
})
/**
 * List of Jobs
 * (companyId)
 * CO
 */
app.post('/rest-api/user/orgs/getJobList', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await company.jobList(orgCollection, req.body);
        res.send(result);
    }
});

/**
 * Getting specific job post
 * (companyId,jobId)
 * CO
 */

app.post('/rest-api/user/orgs/getJob', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await company.getJobDetails(orgCollection, req.body);
        res.send(result);
    }
});

/**
 * Adding job post details
 * (companyId, jobId, jobPosition, postDate, lastDate, applicants*)
 * CO
 */
/**
 * @required @tested
 */
app.post('/rest-api/orgs/postJob', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result;
        try {
            result = await company.addJobPost(orgCollection, user, req.body);
        }
        catch (err) {
            result = { "err": err };
        }
        res.send(result);
    }
})
/**
 * Removing job post details
 * (companyId, jobId)
 * CO
 */
/**
 * @required @tested
 */
app.delete('/rest-api/orgs/removeJob', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result;
        try {
            result = await company.removeJobPost(orgCollection, user, req.body);
        }
        catch (err) {
            result = { "err": err };
        }
        res.send(result);
    }
})

/**
 * Adding new post
 * (companyId, postId, content)
 * CO
 */
/**
 * @required @tested
 */
app.post('/rest-api/orgs/add-post', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result;
        try {
            result = await company.addPost(orgCollection, user, req.body);
        }
        catch (err) {
            result = { "err": err };
        }
        res.send(result);
    }
})

/**
 * Add like to post
 * (companyId, postId, user)
 * CO
 */
/**
     * @required @tested
     */
app.post('/rest-api/user/orgs/like-post', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result;
        try {
            result = await company.likePost(orgCollection, req.body, user);
        }
        catch (err) {
            result = { "err": err };
        }
        res.send(result);
    }
})

/**
 * List of applicants
 *  (companyId, jobId)
 */
app.post('/rest-api/orgs/applicant-list', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await company.applicantList(orgCollection, user, req.body);
        res.send(result);
    }
})


/**
 * Getting applicant count
 *  (companyId, jobId)
 */
app.post('/rest-api/orgs/applicant-count', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result;
        try {
            result = await company.getApplicantCount(orgCollection, user, req.body)
        }
        catch (err) {
            result = { err: err }
        }
        res.send(result);
    }
});


/**
*@description Add applicant to the applicant list
* (companyId, jobId, applicant)
*/
/**
 * @required @tested
 */
app.post('/rest-api/user/orgs/add-applicant', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result;
        try {
            result = await company.addApplicantToList(orgCollection, req.body, user)
            console.log(result)
        }
        catch (err) {
            result = { err: err }
        }
        res.send(result);
    }
});

//_---------------------------------------------------------//




//-----------------Chat module-------------------//
const Chats = require('./modules/chat-management/chats');
const chats = new Chats();


// insert new conversation if not exist else add message in older conversation

/*The format of req body for addChatsBetweenUsers
{
  "receiver":102,
  "content":"Hello"
}*/
/**
 * @required
 */
app.post('/rest-api/chats/addChatsBetweenUsers', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let previousConversationStatus = await chats.conversationExist(user, req.body.receiver);
        console.log(previousConversationStatus)
        if (previousConversationStatus) {
            let result = {
                "val": await chats.addMessageInConversation(user, req.body.receiver, req.body.content)
            }

            res.send(result);
        }
        else {
            let result = {
                "val": await chats.newConversation(user, req.body.receiver, req.body.content)
            }
            res.send(result);
        }
    }
})
//get chats between two user1 and user2

/*The format of req body for addChatsBetweenUsers
{
  "user2":102
}*/
/**
 * @required
 */
app.post('/rest-api/chats/getchatsBetweenUsers', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = {}
        result.val = await chats.getChatsBetweenUsers(user, req.body.user2)
        res.send(result)
    }
})

//deletes a single message of given timestamp between user1 and user2
/*The format of req body for deleteSingleMessage
{
  "user2":102,
  "timestamp":
}*/
app.delete('/rest-api/chats/deleteSingleMessage', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        var result = await chats.deleteSingleMessage(user, req.body.user2, req.body.timestamp);
        console.log(result)
        res.send(result)
    }
})

//gets the users and the last message the given user has conversed with
/*The format of req body for hasConversationsWith */
/**
 * @required
 */
app.post('/rest-api/chats/hasConversationsWith', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = {}
        result.val = await chats.hasConversationsWith(user)
        res.send(result)
    }
})


//------------------------Profile-Management---------------//

const Controller = require('./modules/profile-management/user-details');

var control = new Controller();

/*
    @desc : "This link will get the user's name and will call getUserByUserName()"
    @author :  Shrishti 
*/
/**
 * @required
 */
app.get('/rest-api/users/get/:un', async (req, res) => {
    let result = await control.getUserByUserName(req.params.un);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addAwards()"
    @author :  Shrishti
*/
/**
 * @required
 */
app.put('/rest-api/users/addAward', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.addAwards(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call updateAward()"
    @author :  Shrishti
*/
/**
 * @required
 */
app.put('/rest-api/users/changeAward/:awardId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.updateAwards(user, req.params.awardId, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call removeAwards()"
    @author :  Parag Badala
*/
/**
 * @required
 */
app.put('/rest-api/users/removeAward/:awardId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.removeAwards(user, req.params.awardId);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call addCertifications()"
    @author :  Dipmalya Sen
*/
/**
 * @required
 */
app.put('/rest-api/users/addCertificate', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.addCertifications(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call updateCertifications()"
    @author :  Dipmalya Sen
*/
/**
 * @required
 */
app.put('/rest-api/users/changeCertificate/:certificateId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.updateCertifications(user, req.params.certificateId, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call removeCertifications()"
    @author :  Himani Jain
*/
/**
 * @required
 */
app.put('/rest-api/users/removeCertificate/:certificateId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.removeCertifications(user, req.params.certificateId);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call addpublications()"
    @author :  Himani Jain
*/
/**
 * @required
 */
app.put('/rest-api/users/addPublication', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.addPublications(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call updatePublications()"
    @author :  Lalithya Satya
*/
/**
 * @required
 */
app.put('/rest-api/users/changePublication/:publicationId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.updatePublications(user, req.params.publicationId, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call removePublications()"
    @author :  Lalithya Satya
*/
/**
 * @required
 */
app.put('/rest-api/users/removePublication/:publicationId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.removePublications(user, req.params.publicationId, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call addEndorsement()"
    @author :  Soumyodipta Majumdar
*/
/**
 * @required
 */
app.put('/rest-api/users/addEndorsement', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.addEndorsement(user, req.body);
        result = await control.getUserByUserName(req.body.user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and skill and will call addSkill()"
    @author :  Soumyodipta Majumdar
*/
/**
 * @required
 */
app.put('/rest-api/users/addSkill/:skill', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.addSkill(user, req.params.skill);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and skill and will call deleteSkill()"
    @author :  Somya Burman
*/
/**
 * @required
 */
app.put('/rest-api/users/deleteSkill/:skill', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.deleteSkill(user, req.params.skill);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call updateBio()"
    @author :  Somya Burman
*/
/**
 * @required
 */
app.put('/rest-api/users/updateBio', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.updateBio(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call addExperience()"
    @author :  Anubha Joshi
*/
/**
 * @required
 */
app.put('/rest-api/users/addExperience', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.addExperience(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call updateExperience()"
    @author :  Anubha Joshi
*/
/**
 * @required
 */
app.put('/rest-api/users/updateExperience/:experienceId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res)
    if (user) {
        let result = await control.updateExperience(user, req.params.experienceId, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call removeExperience()"
    @author :  Veshnavee 
*/
/**
 * @required
 */
app.put('/rest-api/users/removeExperience/:experienceId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.removeExperience(user, req.params.experienceId);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call addEducation()"
    @author :  Veshnavee 
*/
/**
 * @required
 */
app.put('/rest-api/users/addEducation', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.addEducation(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call updateEducation()"
    @author :  Supriya Patil
*/
/**
 * @required
 */
app.put('/rest-api/users/updateEducation/:educationId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.updateEducation(user, req.params.educationId, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and user Id and will call removeEducation()"
    @author :  Supriya Patil
*/
/**
 * @required
 */
app.put('/rest-api/users/removeEducation/:educationId', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.removeEducation(user, req.params.educationId);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call countConnection()"
    @author :  Parag Badala
*/

app.get('/rest-api/users/countConnection', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.countConnection(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call updateName()"
    @author :  Somya Burman
*/
/**
 * @required
 */
app.put('/rest-api/users/updateName', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.updateName(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result)
    }
});

/*
    @desc : "This link will get the user's name and will call updateDOB()"
    @author :  Parag Badala
*/

/**
 * @required
 */
app.put('/rest-api/users/updateDob', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.updateDOB(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result);
    }
});

/*
    @desc : "This link will get the user's name and will call upateEmail()"
    @author :  Parag Badala
*/

app.put('/rest-api/users/updateEmail', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.updateEmail(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result)
    }
});

/*
    @desc : "This link will get the user's name and will call updateMobile()"
    @author :  Parag Badala
*/
/**
 * @required
 */
app.put('/rest-api/users/updateMobile', async (req, res) => {
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        let result = await control.updateMobile(user, req.body);
        result = await control.getUserByUserName(user);
        res.send(result)
    }
});



//-------------------------NewsFeed-------------------------//


//fetching the updated posts of a particular person who has logged in based on username 

const NewsFeed = require('./modules/newsfeed/newsfeed')
const newsFeed = new NewsFeed();


//searching person based on username
const Search = require('./modules/newsfeed/search');
const search = new Search();


//add, update and delete the posts of a particular user
const Posts = require('./modules/newsfeed/posts');
const post = new Posts();

const newsFeedCollection = "users";              //name of my collection


//Likes and Unlikes done by user
const Likes = require('./modules/newsfeed/likes');//puneeth
const likes = new Likes();


//add and delete comments
const Comment = require('./modules/newsfeed/comment')
const comments = new Comment();


//fetching the updated posts of a particular person who has logged in based on username
/**
 * @required
 */
app.get("/rest-api/users/post/load", async (req, res) => {
    //console.log('Load Invoked');
    //let user = sessManager.getUserOrError401(req, res);

    let result = await newsFeed.getNewsFeed(newsFeedCollection, "saurabhgupta");
    //take username from session
    res.send(result)

})



//add, delete and update the posts


/**
 * content
 * @description to insert post in database by a user
*/
/**
 * @required
 */
app.patch('/rest-api/users/create/post', async (req, res) => {
    let result;
    //let user = sessManager.getUserOrError401(req, res);

    // try {
    result = await post.createPosts(newsFeedCollection, req.body, "saurabhgupta");
    result = await newsFeed.getNewsFeed(newsFeedCollection, "saurabhgupta")
    //}
    //catch (err) {
    //result = { err: err }
    // }
    res.send(result)

});

/**
 * @description to edit post inserted in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/edit/post/:postId', async (req, res) => {
    let result;
    let postId = req.params.postId;
    //let user = sessManager.getUserOrError401(req, res);
    // if (user) {
    //   try {
    result = await post.editPosts(newsFeedCollection, req.body, "saurabhgupta", postId);
    result = await newsFeed.getNewsFeed(newsFeedCollection, "saurabhgupta");
    //  }
    //  catch (err) {
    //     result = { err: err }
    // }
    res.send(result)
    //}
})

/**
 * @description to delete post inserted in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/delete/posts/:postId', async (req, res) => {
    let result
    let postId = req.params.postId;
    //let user = sessManager.getUserOrError401(req, res);
    //if (user) {
    //try {
    result = await post.deletePosts(newsFeedCollection, "saurabhgupta", postId);
    result = await newsFeed.getNewsFeed(newsFeedCollection, "saurabhgupta")
    // }
    // catch (err) {
    //    result = { err: err }
    // }
    res.send(result)
    // }
})

/**
 * @description to search people in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/search/people', async (req, res) => {
    let result;
    // let user = sessManager.getUserOrError401(req, res);
    //if (user) {
    // try {
    result = await search.searchPeople(newsFeedCollection, req.body.query);
    // }
    // catch (err) {
    //   result = { err: err }
    // }
    res.send(result)
    //}
})

/**
 * @description to search companies in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/search/companies', async (req, res) => {
    let result;
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        try {
            result = await search.searchCompanies(newsFeedCollection, req.body.query);
        }
        catch (err) {
            result = { err: err }
        }
        res.send(result)
    }
})


//Likes and dislikes
/**
 * @required
 */
app.post('/rest-api/users/post/like', async (req, res) => {
  let result
    try {
        var store=req.body;
        
        result = await likecollection.getLike(newsFeedCollection,store.userName,store.postedBy,store.postId)
    } 
    catch (err) {
        result = {err:err}
    } 
    res.send(result)
})
/**
 * @required
 */
app.post('/rest-api/users/post/unlike', async (req, res) => {
    let result
    try {
        var store=req.body;
        result = await likecollection.removeLike(newsFeedCollection,store.userName,store.postedBy,store.postId)
    } 
    catch (err) {
        result = {err:err}
    } 
    res.send(result)
})


 app.get('/rest-api/users/post/getLikesdetails/:userName/:postId', async (req, res) => {
    var id=req.params.postId
    var userName=req.params.userName
    let result = await likecollection.getLikeDetails(newsFeedCollection,userName,id)
    res.send(result)
})


/***
 * @Description calling getComments() method of Comments class in comments.js file 
 */
/*app.get('/rest-api/users/post/getComments/:postId', async (req, res) => {
    let pId = req.params.postId;
    let result = await comments.getComments(newsFeedCollection, pId);
    res.send(result);
})
*/

app.get('/rest-api/users/post/getComments/:uname/:pid', async (req, res) => {
    let pId = req.params.pid;
    let username = req.params.uname;

        //uname is userName like ="dip95",  whose post is displayed
    //pid is Post Id 

    let result = await comments.getComments(newsFeedCollection, username, pId);

    res.send(result);
})




/***
 * @Description calling postComments() method of Comments class in comments.js file 
 */
/*app.use(parser.json());

app.put('/rest-api/users/post/updateComments/:uName/:postId', async (req, res) => {
    let result
    let uName = req.params.uName
    let postId = req.params['postId']
    let user = sessManager.getUserOrError401(req, res);
    if (user) {
        try {
            let result = await comments.postComments(newsFeedCollection, uName, postId, req.body, user)

            res.send(result)
        }
        catch (err) {
            result = { err: err }
        }
    }
})
*/



app.use(parser.json());

app.put('/rest-api/users/post/updateComments/:uname/:pid', async (req, res) => {
    let result
    let uId = req.params['uname'];
    let pId = req.params['pid']
    
    //uname is userName like ="dip95",  whose post is displayed
    //pid is Post Id 

    try {
        let result = await comments.postComments(newsFeedCollection, uId, pId, req.body,"saurabhgupta")

        
                                      // take "saurabhgupta"" from session that is fullname of a session user

        let updatedResult = await comments.getComments(newsFeedCollection, uId, pId);
        res.send(updatedResult)
    }
    catch (err) {
        result = { err: err }
    }


})


//-------------------------END-----------------------------//

app.listen('8080', () => console.log('Listening on port 8080'));
