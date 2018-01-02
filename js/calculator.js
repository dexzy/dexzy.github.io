"use strict";

function getFormValues() {
    return {
        score: parseInt(document.getElementById("score").value),
        goals: parseInt(document.getElementById("goals").value),
        assists: parseInt(document.getElementById("assists").value),
        saves: parseInt(document.getElementById("saves").value),
        shots: parseInt(document.getElementById("shots").value),
        overtime: parseInt(document.getElementById("overtime").value),
        //mvp: parseInt(document.getElementById("mvp").value),
    };
}

function validateForm() {
    //clear previous rating if it exists
    var ratingOverwrite = "";

    document.getElementById("finalRating").innerHTML = ratingOverwrite;

    //storing form data
    var formValues = getFormValues();
    var score = formValues.score;
    var goals = formValues.goals;
    var assists = formValues.assists;
    var saves = formValues.saves;
    var shots = formValues.shots;
    var overtime = formValues.overtime;

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

function calculateAccolades(goals, assists, saves, shots) {
    var accolades = 0;

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

    //calculate total score gained from accolades
    return accolades + (goals * 50) + (assists * 25) + (saves * 25) + (shots * 15);
}

function getPercentile(rating) {
    if (rating <= 0.11){
        return "<1";
    } else if (rating <= 0.33){
        return "1-5";
    } else if (rating <= 0.45){
        return "5-10";
    } else if (rating <= 0.68){
        return "10-25";
    } else if (rating <= 1.00){
        return "25-50";
    } else if (rating <= 1.39){
        return "50-75";
    } else if (rating <= 1.81){
        return "75-90";
    } else if (rating <= 2.04){
        return "90-95";
    } else if (rating <= 2.57){
        return "95-99";
    } else if (rating > 2.57){
        return ">99";
    }
    return "";
}

function formatRating(rating) {
    return rating.toFixed(2);
}

function getRatingColor(rating) {
    if (rating < 0.75){
        return "red";
    } else if (rating >= 0.75 && rating <= 1.25){
        return "orange";
    } else if (rating > 1.25){
        return "green";
    }
    return "black";
}

function getWeightedGoals(goals) {
    var GOALS_WEIGHT = 1;
    return goals * GOALS_WEIGHT;
}

function getWeightedShots(shots) {
    var SHOTS_WEIGHT = 0.4;
    return shots * SHOTS_WEIGHT;
}

function getWeightedSaves(saves) {
    var SAVES_WEIGHT = 0.6;
    return saves * SAVES_WEIGHT;
}

function getWeightedShotPercentage(shotPercentage) {
    var SHOT_PERCENTAGE_WEIGHT = 0.5;
    return shotPercentage * SHOT_PERCENTAGE_WEIGHT;
}

function getWeightedAssists(assists) {
    var ASSISTS_WEIGHT = 0.75;
    return assists * ASSISTS_WEIGHT;
}

function getWeightedAdjustedScore(adjustedScore) {
    var ADJUSTED_SCORE_WEIGHT = 0.25;
    return adjustedScore * ADJUSTED_SCORE_WEIGHT;
}

function getFullMatchTime(overtime) {
    var MATCH_TIME = 300;
    return (MATCH_TIME + overtime) / 60;
}

function calculateShootingPercentage(shots, goals) {
    return shots > 0 ? (goals / shots) : 0;
}

function calculateAdjustedScore(score, accolades) {
    return (score - accolades) / 100;
}

function calculate() {
    //storing form data
    var formValues = getFormValues();
    var score = formValues.score;
    var goals = formValues.goals;
    var assists = formValues.assists;
    var saves = formValues.saves;
    var shots = formValues.shots;
    var overtime = formValues.overtime;

    // adjustment moving RLCS median up to 1.0
    var ADJUSTMENT = 1.669;
    
    var accolades = calculateAccolades(goals, assists, saves, shots);
    var adjustedScore = calculateAdjustedScore(score, accolades);
    var shotPercentage = calculateShootingPercentage(shots, goals);
    var matchTime = getFullMatchTime(overtime);
    var weightedAdjustedScore = getWeightedAdjustedScore(adjustedScore);
    var weightedGoals = getWeightedGoals(goals);
    var weightedAssists = getWeightedAssists(assists);
    var weightedSaves = getWeightedSaves(saves);
    var weightedShots = getWeightedShots(shots);
    var weightedShotPercentage = getWeightedShotPercentage(shotPercentage);
    //calculate final rating
    var rating = ((weightedAdjustedScore + weightedGoals + weightedAssists + weightedSaves + weightedShots + weightedShotPercentage) * (1 / matchTime)) * ADJUSTMENT;
    var finalrating = formatRating(rating);
    var percentile = getPercentile(rating);
    var ratingColor = getRatingColor(finalrating);

    //display percentile
    document.getElementById("percentile").innerHTML = percentile;

    //display rating
    document.getElementById("finalRating").innerHTML = finalrating; 

    //change color of rating based on rating value
    document.getElementById("finalRating").style.color = ratingColor;
}