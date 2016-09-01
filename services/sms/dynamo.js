var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "ec2-52-88-138-186.us-west-2.compute.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Texts",
    KeySchema: [       
        { AttributeName: "text_id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "text_id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
//http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.NodeJs.01.html