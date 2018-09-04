/**
 * @description Module for data access layer"
 * @author Himanshu Sagar
 * @exports Dao
 */

/* Native driver for mongodb */
const mongoClient = require('mongodb')

/**
 * Main class for performing operations on database
 * @author Himanshu Sagar
 */
class Dao {
    constructor() {
        this.URL = 'mongodb://localhost:27017'
        this.DB = 'capmesh'
        //console.log(this.URL)
    }

    /**
     * Function for inserting an obj in the database.
     * @param {String} collection The name of the collection in which the data is to be inserted.
     * @param {Object} obj The actual object to be inserted in the database.
     * @author Himanshu Sagar
     */
    async insert(collection, obj) {
        if (obj == undefined || obj == {})
            throw "Object is Empty"
        let mongo = await mongoClient.connect(this.URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db(this.DB)
            result = (await db.collection(collection).insertOne(obj))
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }

    
    /**
     * To find the data from the database
     * @param {String} collection Name of the collection to fetch the data
     * @param {Object} query Actual query to find the data
     * @returns {Array} Array of matched objects
     * @author Himanshu Sagar
     */
    async find(collection, query) {
        if (query == undefined)
            query = {}
        let mongo = await mongoClient.connect(this.URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db(this.DB)
            result = (await db.collection(collection).find(query).toArray())
            return result
        }
        catch (err) {
            return err
        }
        finally {
            mongo.close()
        }
    }

    /**
     * To aggregate and return the data from the database
     * @param {String} collection Name of the collection to fetch the data
     * @param {Object} query Actual query to find the data
     * @returns {Array} Array of matched objects
     * @author Himanshu Sagar
     */
    async aggregate(collection, query) {
        if (query == undefined)
            query = []
        let mongo = await mongoClient.connect(this.URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db(this.DB)
            result = (await db.collection(collection).aggregate(query).toArray())
            return result
        }
        catch (err) {
            return err
        }
        finally {
            mongo.close()
        }
    }

    /**
     * To update the data in the database
     * @param {String} collection The Name of the collection
     * @param {Object} query Actual query to find the data
     * @param {Object} newValues The new values to update the data
     * @param {Object} upsert To specify whether upsert is true or false
     * @returns Database result or err
     * @author Himanshu Sagar, Dipmalya Sen
     */
    async update(collection, query, newValues, upsert) {
        if(upsert == undefined)
            upsert = {};
        if (newValues == undefined || newValues == {})
            throw "Object is Empty"
        let mongo = await mongoClient.connect(this.URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db(this.DB)
            result = (await db.collection(collection).updateOne(query, newValues,upsert))
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }

    /**
     * To delete the data from the databae
     * @param {String} collection Name of the collection to delete the data
     * @param {Object} query Actual query to delete the data
     * @returns {Object} Database result or error
     * @author Himanshu Sagar
     */
    async delete(collection, query) {
        if (query == undefined)
            query = {}
        let mongo = await mongoClient.connect(this.URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db(this.DB)
            result = (await db.collection(collection).deleteOne(query))
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }
}

module.exports = Dao
