var page_token = ("EAAFQkb6BPdgBAIPhSrJmInVV1RqwxTYNI0R2lbINfla7CT1EDzc006e2dSXG1Pvg57ZCsURU6DR5OBpgseCEUnDYcutFiY4sZBIkhOR5Cl1RycaDKvKWJANNNvzZBujOPZC5knltguySElHfk8h9Q9ZATODT5OgSQME1JWFyd5AZDZD");
var verify_token = ("nVBz2s2E6i0");
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');

//////////////////////////////////////////////////
var Botkit = require('./lib/Botkit.js');
var controller = Botkit.facebookbot({
    debug: true,
    access_token: page_token,
    verify_token: verify_token
});

var bot = controller.spawn({

});


// read the CSV file
csvStrData = fs.readFileSync("PhysicianScheduling.csv"); // read the csv file
csvStrArray = CSVToArray(csvStrData, ','); // pass this array for conversion to stringArray


// var physician = "Jodi Dodds";

controller.hears(['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],['message_received'],function(bot,message) {
  bot.startConversation(message, initialStep);
});

initialStep = function(response, convo) {
    convo.say('Welcome to Duke Health scheduling buddy. \nIf it is an emergency, call 911 else please answer the following questions.');
    convo.ask('Please enter your name:', function(name, convo){
    	convo.next();
    	convo.ask('Are you first time patient to our hospital?', function(response, convo){
    	var resp_str = String(response.text);
    	console.log(resp_str);

    if(resp_str.match(/^(Yes|yes)$/)){
        convo.ask('Please enter your information on following form and type "done" when you are finished.\n\n https://docs.google.com/forms/d/e/1FAIpQLSdz-IND-a_US0CZA9xR5WHycQXjZyr6O-5RchuCUY2gRAtA9w/viewform?c=0&w=1&usp=send_form', function(opt_response, convo){

            if(String(opt_response.text).match(/^(done|Done)$/)){
                convo.ask('Enter specific letters for your department options:\n a - Cardiology\n b - Neurology\n c - Pediatrics\n d - Family Medicine', function(deptId, convo){

                // passing department info to nextStep
                if(String(deptId.text).match(/^(a|A)$/)){
                    var department = 'Cardiology';
                    console.log("helllllllooooooooooo!!!!!");
                    console.log(department);
                    nextStep(department, name, convo);

                }else if(String(deptId.text).match(/^(B|b)$/)){
                    var department = "Neurology";
                    nextStep(department, name, convo);

                }else if(String(deptId.text).match(/^(C|c)$/)){
                    var department = "Pediatrics";
                    nextStep(department, name, convo);

                }else if(String(deptId.text).match(/^(D|d)$/)){
                    var department = "Family Medicine";
                    nextStep(department, name, convo);
                }
    
                convo.next();
            });
            }
            convo.next();
        });
        
        // response to returning patient to hospital
    }else if(resp_str.match(/^(No|no)$/)){
        convo.ask('Are you coming for\n a - return visit\n b - new visit ?', function(new_response, convo){
            if(String(new_response.text).match(/^(a|A)$/)){

                convo.ask("Please enter your physician's name - you can look it up in the physician's directory using the link below.\n\n https://www.dukehealth.org/find-doctors-physicians/", function(physician, convo){
                nextStep(String(physician.text), name, convo); // calling next step
                convo.next();
            });

                convo.next();
            }else if (String(new_response.text).match(/^(B|b)$/)){

                convo.ask('Enter specific letters for your department options:\n a - Cardiology\n b - Neurology\n c - Pediatrics\n d - Family Medicine', function(deptId, convo){

                    if(String(deptId.text).match(/^(a|A)$/)){
                        var department = 'Cardiology';
                        nextStep(department, name, convo);

                    }else if(String(deptId.text).match(/^(b|B)$/)){
                        var department = "Neurology";
                        nextStep(department, name, convo);

                    }else if(String(deptId.text).match(/^(C|c)$/)){
                        var department = "Pediatrics";
                        nextStep(department, name, convo);

                    }else if(String(deptId.text).match(/^(D|d)$/)){
                        var department = "Family Medicine";
                        nextStep(department, name, convo);
                    }

                    convo.next();
                });
                convo.next();
            }else{
            	convo.say("You did not enter the available options");
            	convo.next();
            }

            convo.next();
        });
    }       
    convo.next();
  });

 });

}


nextStep = function(physician, name, convo){
    convo.ask('Are you looking for appointment for:\n a - ASAP\n b - in the next year?', function(response, convo){

        if(String(response.text).match(/^(a|A)$/)){
            printingOut(physician, "ASAP", name, convo);
        
        }else if(String(response.text).match(/^(b|B)$/)){
            convo.ask('Which month in next year?', function(month, convo){
                // pass the month information to Python for comparison
                console.log(physician);
                console.log(String(month.text));
                printingOut(physician, String(month.text), name, convo);
                convo.next();

            });
            convo.next();
        }

        convo.next();
    });
}


printingOut = function(dept_phys, datetime, name, convo){
    strReturn = scheduleApp(csvStrArray, dept_phys, datetime);
    console.log(strReturn);

    if(strReturn == undefined){//.includes("Invalid input")){
        convo.say("Sorry, we do not have any matching appointments for that physician in our record. Check back again later.")
    }else{
        var response_list = strReturn.split(';');
        response_list.push(" None of these work for me");

        var abc = ["a - " ,"b - ", "c - ", "d - "];
        var answer = "";
                        
        convo.say("Please select one of the available appointments below: ");

        for(i = 0; i < abc.length; i++){
            answer += abc[i]+response_list[i]+'\n';
                                                  
        }
        // answer += "d - None of these work for me\n";
                        
        convo.ask(answer, function(response, convo){
            if(String(response.text).match(/^(D|d)$/)){
                convo.say("Sorry, " + String(name.text) + " those are the only available options. Please check back later.")
                convo.next();
        
            }else if (String(response.text).match(/^(a|b|c|A|B|C)$/)) {
            	// http://petershi.maps.arcgis.com/apps/webappviewer/index.html?id=78161d2e6d8b44ff8b36051262425b9e
                convo.say("Thank you " + String(name.text) +"! You are registered in the system");
                convo.say('To get the directions to the hospital: \n - Click the following link \n http://www.arcgis.com/home/webmap/viewer.html?webmap=f02f094c92a54f90b855efb19265c820&extent=-79.1163,35.8792,-78.7417,36.057');// \n\n - Click directions icon \n - Enter your starting point address \n - Click on the star to make Duke Hospital as your destination');
                convo.next();

            }else{
            	convo.say("Your selection did not match the available options.")
            	convo.next();
            }
            convo.next();
        });

    }
}


function CSVToArray(strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
    strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );

        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;

        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );
            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];
            }

            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }


// function to output string for users
function scheduleApp(appArray, provider,date){
    var col
    var app
    var i
    var j

    for(i = 0; i < appArray[0].length; i++){
        if (appArray[0][i]==date){
            col=i;
            break;
        }

    }
    for(j = 1; j < appArray.length; j++){
        if (appArray[j][1]==provider || appArray[j][0]==provider){
            app=appArray[j][col];
            break;
        }
    }

    if (app==""){
        return "Invalid input.";
    }

    return app
}

//added to stop the debug tick remarks in console
controller.on('tick', function(bot, event) {});

controller.setupWebserver(process.env.port || 7000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');

    });
});
