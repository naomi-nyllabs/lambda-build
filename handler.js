'use strict';
var webpack = require('webpack');
// Import the AWS SDK
var AWS = require('aws-sdk');
var path = require('path');

// Set credentials and region
// This can also be done directly on the service client
// AWS.config.update({region: 'us-west-1', credentials: {YOUR_CREDENTIALS}});

var s3 = new AWS.S3();
var configFile;

module.exports.buildPOC = (event, context, callback) => {

    console.log(event);
    var srcBucket = event.Records[0].s3.bucket.name;
    var srcKey    =
        decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    console.log(srcBucket + " " + srcKey)

    s3.listObjects({
            Bucket: srcBucket
        },function(err, data) {
        // Handle any error and exit
        if (err) {
            console.log(err);
        } else {
            console.log('S3 Objects in ' + srcBucket + ':');
            // Print the Key for each returned Object
            data.Contents.forEach(function (metadata) {
            console.log('Key: ' + path.join(__dirname,metadata.Key));
            });
        }
        configFile = path.join(__dirname,"webpack.config.js");
        console.log(configFile);
        const compiler = webpack(configFile);
    });



    // compiler.run((err, stats) => {
    //     if (err){
    //         console.log(err);
    //         const response = {
    //         statusCode: 500,
    //             body: JSON.stringify({
    //             message: 'Error in building the project',
    //             input: event,
    //         }),
    //     };
    //     }
    //     else{
    //         const response = {
    //             statusCode: 200,
    //             body: JSON.stringify({
    //                 message: 'Go Serverless v1.0! Your function executed successfully!',
    //                 input: event,
    //             }),
    //         };
    //     }
    // });

    const response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Go Serverless v1.0! Your function executed successfully!',
                        input: event,
                    }),
                };
  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
