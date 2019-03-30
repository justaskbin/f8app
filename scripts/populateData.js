var Parse = require('parse/node');

Parse.initialize("oss-f8-app-2017");
Parse.serverURL = `http://localhost:1337/parse`;
console.log("DEBUG!!! " + "http://localhost:1337");

let Trend = Parse.Object.extend("Trend");
let trend = new Trend();
trend.set("trendSlug", "test");
trend.save().then(
  trend => {
    console.log("New trend created with trendID" + trend.id);
  },
  error => {
    console.log(
      "Failed to create new object, with error code:" + error.message
    );
  }
);
