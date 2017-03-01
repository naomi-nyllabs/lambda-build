'use strict';

var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();


module.exports.sample = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: JSON.stringify({
            message: "This is a simple serverless function"
        }),
    };

    callback(null, response);
};