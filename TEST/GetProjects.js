let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let Auth = require('./Auth');

exports.handler = function (event, context, callback) {

    Auth.wrap(event, callback, (username) => {

        let response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": "..."
        };

        let projectId = event.queryStringParameters && event.queryStringParameters.projectId;

        if (!projectId) {
            console.log("Searching all projects for", username);

            ddb.query({
                TableName: 'SigmaUserProjects',
                ExpressionAttributeValues: { ':username': username },
                KeyConditionExpression: 'username = :username',
            }, function (err, data) {
                if (!err) {
                    console.log("Successfully queried", data.Items.length, "for", username);
                    response.body = JSON.stringify(data.Items);
                } else {
                    response.statusCode = 500;
                    console.error("Error occurred when searching for projects of", username, err);
                }
                callback(err, response);
            });
        } else {
            ddb.get({
                TableName: 'SigmaUserProjects',
                Key: { 'username': username, 'projectId': projectId }
            }, function (err, data) {
                if (!err) {
                    console.log("Successfully queried project %s of %s", projectId, username);
                    response.body = JSON.stringify(data.Item);
                } else {
                    console.error("Error in fecthing %s of %s", projectId, username);
                    esponse.statusCode = 500;
                }
                callback(err, response);
            });
        }
    });
}