function validateForm(){
    //clear previous rating if it exists
    var ratingOverwrite = "";

    document.getElementById("finalRating").innerHTML = ratingOverwrite;

    //storing form data
    var score = parseInt(document.getElementById("score").value);
    var goals = parseInt(document.getElementById("goals").value);
    var assists = parseInt(document.getElementById("assists").value);
    var saves = parseInt(document.getElementById("saves").value);
    var shots = parseInt(document.getElementById("shots").value);
    //var mvp = document.getElementById("mvp").value;
    var overtime = parseInt(document.getElementById("overtime").value);

    //form validation
    var errormsg = "";
    if (isNaN(score) || isNaN(goals) || isNaN(assists) || isNaN(saves) || isNaN(shots) || isNaN(overtime)) {
        errormsg = "Error: Please fill all fields with integer values.";
    } else if ((score < 0) || (goals < 0) || (assists < 0) || (saves < 0) || (shots < 0) || (overtime < 0)){
        errormsg = "Error: Input positive numbers only.";
    } else {
        calculate();
    }
    document.getElementById("errormsg").innerHTML = errormsg;
}
function calculate(){

    //storing form data
    var score = parseInt(document.getElementById("score").value);
    var goals = parseInt(document.getElementById("goals").value);
    var assists = parseInt(document.getElementById("assists").value);
    var saves = parseInt(document.getElementById("saves").value);
    var shots = parseInt(document.getElementById("shots").value);
    //var mvp = document.getElementById("mvp").value;
    var overtime = parseInt(document.getElementById("overtime").value);

    //setting static weights
    var adjscoreweight = 0.25;
    var goalsweight = 1;
    var assistsweight = 0.75;
    var savesweight = 0.6;
    var shotsweight = 0.4;
    var shotpercentageweight = 0.5;

    //adjustment moving RLCS median up to 1.0
    var adjustment = 1.669;

    //reset accolades values to zero before beginning calculations
    var accolades = 0;
    //var mvpscore = 0;

    //calculate score gained from accolades
    if (goals == 3){
        accolades = accolades + 25;
    } else if (goals == 6){
        accolades = accolades + 50;
    }

    if (assists == 3){
        accolades = accolades + 25;
    } else if (assists == 6){
        accolades = accolades + 50;
    }

    if (saves == 3){
        accolades = accolades + 25;
    } else if (saves == 6){
        accolades = accolades + 50;
    }

    //if (mvp === TRUE){
   //     mvpscore = 50;
   // }

    //calculate total score gained from accolades
    accolades = accolades + (goals * 50) + (assists * 25) + (saves * 25) 
            + (shots * 15);

    //calculate adjusted score
    var adjscore = (score - accolades)/100;

    //calculate shooting percentage
    var shotpercentage = shots > 0 ? (goals / shots) : 0;

    //setting full matchtime
    var matchtime = 300;
    matchtime = (matchtime + overtime)/60;

    //calculate final rating
    var rating = (((adjscore * adjscoreweight) + (goals * goalsweight) + (assists * assistsweight) + 
            (saves * savesweight) + (shots * shotsweight) + (shotpercentage * shotpercentageweight))*(1/matchtime))*adjustment;

    //shorten rating to two decimal places
    var finalrating = rating.toFixed(2);

    //setting percentile
    var percentile = "";

    if (rating <= 0.11){
        percentile = "<1";
    } else if (rating <= 0.33){
        percentile = "1-5";
    } else if (rating <= 0.45){
        percentile = "5-10";
    } else if (rating <= 0.68){
        percentile = "10-25";
    } else if (rating <= 1.00){
        percentile = "25-50";
    } else if (rating <= 1.39){
        percentile = "50-75";
    } else if (rating <= 1.81){
        percentile = "75-90";
    } else if (rating <= 2.04){
        percentile = "90-95";
    } else if (rating <= 2.57){
        percentile = "95-99";
    } else if (rating > 2.57){
        percentile = ">99";
    }

    //display percentile
    document.getElementById("percentile").innerHTML = percentile;

    //display rating
    document.getElementById("finalRating").innerHTML = finalrating; 

    //change color of rating based on rating value
    if (finalrating < 0.75){
        document.getElementById("finalRating").style.color="red";
    } else if (finalrating >= 0.75 && finalrating <= 1.25){
        document.getElementById("finalRating").style.color="orange";
    } else if (finalrating > 1.25){
        document.getElementById("finalRating").style.color="green";
    }

}