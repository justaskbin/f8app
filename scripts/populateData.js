let Parse = require("parse/node");

Parse.initialize("oss-f8-app-2017");
Parse.serverURL = "http://localhost:1337/parse";
console.log("DEBUG!!! " + "http://localhost:1337");

let Trend = Parse.Object.extend("Trend");
// let trend = new Trend();

let i;
// const companyHero = ['./img/1.png', './img/2.png', './img/3.png', './img/4.png', './img/5.png',
//     './img/6.png', './img/7.png', './img/8.png', './img/9.png' , './img/10.png']
for (i = 0; i < 10; i++) {
    let trend = new Trend();
    trend.set("trendSlug", "slug" + i.toString() );
    trend.set("trendTitle", "title" + i.toString());
    trend.set("onMySchedule", false);
    let j = i + 1;
    // const companyHero = './img/' + j.toString() + '.png'
    // var parseFile = new Parse.File('image.png', companyHero[i], 'image/png');
    // trend.set("trendImage", parseFile);
    trend.set("trendDescription", "I am the " + i.toString() + "item");
    trend.set("hasDetails", true);
    trend.set("location", "New York");
    trend.set("tags", ["fun", "play" , "food"]);
    trend.set("year", 2019);
    if (i < 4) {
        trend.set("featured", true);
    }
    else {
        trend.set("featured", false);
    }
    trend.set("organizations", ["Binbin", "Fengfeng"]);

    trend.save().then(
        trends => {
            console.log("New trend created with trendID" + trends.id);
        },
        error => {
            console.log(
                "Failed to create new object, with error code:" + error.message
            );
        }
    );
}

// trend.set("trendSlug", "");
//
// trend.save().then(
//   trends => {
//     console.log("New trend created with trendID" + trends.id);
//   },
//   error => {
//     console.log(
//       "Failed to create new object, with error code:" + error.message
//     );
//   }
// );
// let query = new Parse.Query(GameScore);
// query.get("xWMyZ4YEGZ")
//     .then((gameScore) => {
//         // The object was retrieved successfully.
//     }, (error) => {
//         // The object was not retrieved successfully.
//         // error is a Parse.Error with an error code and message.
//     });
