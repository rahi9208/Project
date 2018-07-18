let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let Auth = require('../Auth');

exports.handler = function (event, context, callback) {

    Auth.wrap(event, callback, (username) => {

        let response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": "..."
        };

        console.log("Searching all widgets for", username);

        ddb.query({
            TableName: 'DashboardWidgets',
            ExpressionAttributeValues: { ':username': username },
            KeyConditionExpression: 'username = :username',
        }, function (err, data) {
            if (!err) {
                console.log("Successfully queried", data.Items.length, "for", username);
                response.body = JSON.stringify(data.Items);
            } else {
                response.statusCode = 500;
                console.error("Error occurred when searching for widgets of", username, err);
            }
            callback(err, response);
        });
    });
}