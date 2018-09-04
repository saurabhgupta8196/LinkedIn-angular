const Dao = require('../data-access/data-access')
const Utils = require('./utils')
const DefaultObj = require('./schema');
const dao = new Dao()
const utils = new Utils()


//creating userManagement to export in server.js
class userManagement {

    /**
     * Query the database and gets all the demo by using Dao.find()
     * @author Soumya Nelanti, Sayali
     * @returns {Array} The array of all the documents in the collection   
     */
    constructor() {
        this.USERS = 'users',
        this.FORGET = 'forget-password'
        this.AUTH = 'auth-users'
        this.VERIFY = 'verifications'
    }

    async findAll() {
        let resultFindAll = await dao.find("users");
        return resultFindAll;
    }

    /**
     * Insert the userObj in the User collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj An object which is to be inserted in the database
     * @returns {Object} Database Result or Error
     */
    async signupInsert(userObj) {
        let date = new Date(userObj.dateOfBirth);
        userObj.dateOfBirth = date;
        console.log(userObj);
        delete userObj.password;
        console.log(userObj);
        userObj = {
            ...userObj,
            ...DefaultObj
        }
        let result;
        try {
            result = await dao.insert(this.USERS, userObj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    /**
     * Insert the email and password in the Auth Collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async authInsert(userObj) {
        let hashPassword = utils.encryptPassword(userObj.password)
        let obj = { email: userObj.email, password: hashPassword };
        let result
        try {
            result = await dao.insert(this.AUTH, obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    /**
     * Insert the verificationCode and userName into the verification collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async verifyInsert(userObj) {
        let code = utils.generateVerificationCode();
        console.log(code)
        let obj = { verificationCode: code, userName: userObj.userName };
        let result;
        try {
            result = await dao.insert(this.VERIFY, obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    /**
     * Verify the user and delete the corresponding document from the 
     * verification collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async deleteVerifiedUser(userObj) {
        let userFind = await dao.find(this.VERIFY, { userName: userObj.userName })
        console.log(userFind.length)
        if (userFind.length == 1) {
            if (userFind[0].userName == userObj.userName && userFind[0].verificationCode == userObj.verificationCode) {
                let verifyUpdate = await dao.update(this.USERS, { userName: userObj.userName }, { $set: { isVerified: true } })
                let result = await dao.delete(this.VERIFY, { userName: userObj.userName })
                return verifyUpdate;

            }
        }
        else {
            return {
                error: "Account already verified!!!"
            }
        }
    }
    /**
     * Update the verification code in the verification collection
     * for the User
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async updateVerifyCode(userName) {
        let result
        let code = utils.generateVerificationCode();
        try {
            result = await dao.update(this.VERIFY, { userName: userName }, { $set: { verificationCode: code } })
        }
        catch (err) {
            result = { err: err }
        }
        return result
    }

    /**
     * Update the verification code in the verification collection
     * for the User
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async signin(obj) {
        console.log("Hello")
        let log = await dao.find(this.USERS, { userName: obj.userName })
        console.log(log)
        if (log.length == 1) {
            if (log[0].isDeleted == false) {
                let result = await dao.find(this.AUTH, { email: log[0].email })
                if (result) {
                    let hashPassword = utils.encryptPassword(obj.password)
                    if (result[0].password == hashPassword) {
                        return "Logged In"
                    }
                }
            }
            else {
                return "Account deleted";
            }
        }
        else {
            return "Incorrect Username or Password";
        }
    }

    //forgot password verification link
    async forgotPassword(req) {
        let result = await dao.find(this.USERS, { userName: req.userName })
        if (result.length == 1) {
            if (result[0].userName == req.userName) {
                this.email = result[0].email;
                let link = utils.generateVerificationCode();
                let obj = { verificationCode: link, userName: req.userName };
                try {
                    result = await dao.insert(this.FORGET, obj);
                }
                catch (err) {
                    result = { error: err };
                }
                return result;
            }
            else {
                return ("username not found");
            }
        }
    }
    //change password
    async changePassword(userName, verificationCode, password) {
        let verified = await dao.find(this.FORGET, { verificationCode: verificationCode, userName: userName })
        if (verified.length) {
            let emailObj = await dao.find(this.USERS, { userName: verified[0].userName })
            if (emailObj.length) {
                let result = await this.updatePasswordUtil(emailObj[0].email, password)
                let log = await dao.delete(this.FORGET, { verificationCode: verificationCode })
               return (log);
            }
        }
    }

    async updatePassword(userName, password) {
        let user = await dao.find(this.USERS, {userName:userName})
        if(user.length) {
            let result = await this.updatePasswordUtil(user[0].email, password)
            return result
        }
    }
    async updatePasswordUtil(email, password) {
        let hashPassword = utils.encryptPassword(password)
        let result = await dao.update(this.AUTH, { email: email}, {$set: { password: hashPassword}})
        return result
    }

    
    //fetching verification data of user
    async findVerificationData(userObj){
        let userFind=await dao.find(this.VERIFY,{userName: userObj.userName})
        console.log(userFind);
        return userFind;
    }

   
   async uniqueUserName(userName){
        let user = await dao.find(this.USERS, {userName: userName})
        if(user.length)
            return false
        return true
   }

      //unique user email checking 
   async uniqueEmail(email){
        let user=await dao.find(this.USERS,{email: email})
        if(user.length)
            return false
        return true
   }
   

}
module.exports = userManagement;
