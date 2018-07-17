let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let uuid = require('uuid');
let Auth = require('./Auth');

exports.handler = function (event, context, callback) {

    Auth.wrap(event, callback, (username) => {
        let response = {
            "isBase64Encoded": 1,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": ""
        };

        let project = JSON.parse(event.body);

        let createdTime = project.createdTime || new Date().getTime();
        let updatedTime = new Date().getTime();
        let projectId = project.projectId || (createdTime + "-" + uuid.v4());

        ddb.put({
            TableName: 'SigmaUserProjects',
            Item: {
                'name': project.name,
                username,
                projectId,
                'description': project.description || " ",
                'functions': project.functions,
                createdTime,
                updatedTime,
                region: project.region
            }
        }, function (err, data) {
            if (err) {
                console.error("Error in saving project of", username, err);
                response.statusCode = 500;
                response.body = err.message;
            } else {
                console.log("Successfully saved project of %s with id %s", username, projectId);
                response.body = JSON.stringify({
                    projectId
                });
            }
            callback(null, response);
        });
    })
}