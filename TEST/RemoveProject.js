let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let Auth = require('./Auth');

exports.handler = function (event, context, callback) {

    Auth.wrap(event, callback, (username) => {
        let response = {
            "isBase64Encoded": 1,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": "..."
        }

        let projectId = event.queryStringParameters.projectId;

        ddb.delete({
            TableName: 'SigmaUserProjects',
            Key: { username, projectId }
        }, function (err, data) {
            if (!err) {
                response.body = "Successfully deleted " + projectId;
            } else {
                response.statusCode = 500;
            }
            callback(err, response);
        });
    });
}