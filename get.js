'use strict';
// var webpack = require('webpack');
// Import the AWS SDK
var AWS = require('aws-sdk');
// var path = require('path');

// Set credentials and region
// This can also be done directly on the service client
// AWS.config.update({region: 'us-west-1', credentials: {YOUR_CREDENTIALS}});
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.requests = function(event, context, callback) {
    console.log(event);
    // console.log(process.env);
    var params = {
        TableName : process.env.DYNAMODB_TABLE,
        FilterExpression: "#stat = :status",
        ExpressionAttributeNames:{
            "#stat": "Status"
        },
        ExpressionAttributeValues: {":status": "Assigned"},
        ReturnConsumedCapacity: "TOTAL"
    };

    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            // data.Items.forEach(function(item) {
            //     console.log(" -", item.name + ": " + item.college);
            // });

            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
                     },
                body: JSON.stringify({
                    message: data ,
                    // input: event,
                }),
            };

            callback(null, response);
        }
    });
};