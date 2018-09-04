/**
 * Class for managing the session. i.e. Login manager.
 * @author Himanshu Sagar
 */
class SessionManager {
    /**
     * Initialize the session 
     * @author Himanshu Sagar
     * @returns {Object} required for session
     */
    init() {
        let sess = {
            secret: 'f9883422eb49321744ee3e1e8297af3451e8d812887d0e39fbe9b1960ac98b6b',
            cookie: {},
            saveUninitialized: false,
            resave: false
        }
        return sess
    }

    /**
     * Set the user in the session
     * @author Himanshu Sagar
     * @param {Object} req Http Request
     * @param {String} userName userName of the user logged in
     */
    setUser(req, userName) {
        req.session.user = userName
    }

    /**
     * Return the current logged in User
     * @author Himanshu Sagar
     * @param {Object} req Http Requrest
     * @returns {String} userName of the user logged in
     */
    getUserOrError401(req, res) {
        if(req.session.user) 
            return req.session.user
        else
        {
            res.status(401).send("UNAUTHORIZED")
            return undefined
        }
    }

    /**
     * Remove the previously logged in user from the session
     * @author Himanshu Sagar
     * @param {Object} req  Http Request
     */
    resetUser(req) {
        delete req.session.user
    }
}

module.exports = SessionManager