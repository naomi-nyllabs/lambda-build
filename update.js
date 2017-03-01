/**
 * Created by naomijoshi on 1/26/17.
 */
'use strict';

var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Updating records in INS_20_USER_REQUEST table.");

module.exports.assignToEmp = function(event, context, callback) {
    console.log(event);
    var body = JSON.parse(event.body);
    var error;
    var response;
    for (var i in body) {
        var emp = body[i].EmployeeId;
        var req = body[i].RequestId;
        var params = {
            TableName : process.env.DYNAMODB_TABLE,
            Key: {"RequestId" : req},
            ExpressionAttributeNames:{
                "#stat": "Status"
            },
            UpdateExpression: "set EmployeeId = :emp, #stat = :stat",
            ExpressionAttributeValues: {
                ":emp" : "1",
                ":stat" : "Assigned",
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                error = "Unable to query. Error in Request ID" + req;

            } else {
                console.log("Update succeeded.");
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            };
        });
    }
    if (error){
        response = {
            statusCode: 502,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            },
            body: JSON.stringify({
                message: error ,
            }),
        };
    } else {
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            },
            body: JSON.stringify({
                message: "Successfully updated the Requests",
            }),
        };
    }
    callback(null, response);

};
