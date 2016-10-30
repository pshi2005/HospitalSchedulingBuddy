
function scheduleApp(appArray, provider,date){}

	var col
	var app
	var i
	var j

	for(i = 0; i < appArray[0].length; i++){
		if (appArray[0][i]==date){
			col=i;
			break;
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