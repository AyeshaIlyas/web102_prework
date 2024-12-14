/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

function addGamesToPage(games) {

    // loop over each item in the data
    for (const game of games) {

        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        // <div style="background-color: red; width: 100%; height: 5px; 
        // margin: 5px 10px 5px 0; border-radius: 5px">
        //         <div style="width: 75%;  height: 5px; background-color: blue;"></div>
        // </div>
        // rounded to 1 decimal place
        const fundingPercentage = Math.round((game.pledged / game.goal) * 1000) / 10;

        let color = "";
        if (fundingPercentage <= 30) {
            color = "#d91c1c"; // red
        } else if (fundingPercentage <= 60) {
            color = "#ffef0a"; // yellow
        } else if (fundingPercentage <= 100) {
            color = "#42ad00"; // dark green
        } else { // over 100%
            color = "#00ff15"; // bright green
        }

        console.log(color);

        const gameInfo = `
            <div class="game-info">
                <img class="game-img" src=${game.img} />
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <p>Backers: ${game.backers}</p>
            </div>
            <div class="progress-status">
                <div class="progress-bar">
                    <div class="progress-fill" 
                        style="width: ${fundingPercentage > 100 ? 100 : fundingPercentage}%; 
                        background-color: ${color}"></div>
                </div>
                <div>${fundingPercentage.toFixed(1)}%</div>
            </div>
        `;
        gameCard.innerHTML = gameInfo;
        

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributors = GAMES_JSON.reduce((acc, game) => acc + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributors.toLocaleString("en-US")}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `${totalRaised.toLocaleString("en-US")}`;


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// global state
let query = "";
let filterStatus = "all";

// search games by looking for matching substring in name and description
function search() {  
    // search for matches based on the filter currently selected
    // ie, look for matches in set of unfunded games only, funded games only, or all games  
    let gamesToSearch = GAMES_JSON;
    if (filterStatus == "unfunded") {
        gamesToSearch = GAMES_JSON.filter(game => game.pledged < game.goal);;
    } else if (filterStatus == "funded") {
        gamesToSearch = GAMES_JSON.filter(game => game.pledged >= game.goal);;
    }
    return gamesToSearch.filter(game => game.name.toLowerCase().includes(query) || game.description.toLowerCase().includes(query));
}

// show games that match the search query
function displaySearch() {
    deleteChildElements(gamesContainer);
    const matches = search();
    addGamesToPage(matches);
}

// show only games that do not yet have enough funding, that also match search query
function filterUnfundedOnly() {
    filterStatus = "unfunded";
    deleteChildElements(gamesContainer);
    addGamesToPage(search());
}

// show only games that are fully funded, that also match search query
function filterFundedOnly() {
    filterStatus = "funded";
    deleteChildElements(gamesContainer);
    addGamesToPage(search());
}


// show all games, that also match search query
function showAllGames() {
    filterStatus = "all";
    deleteChildElements(gamesContainer);
    addGamesToPage(search());
}

const searchInput = document.getElementById("search");
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with to control elements
searchInput.addEventListener("input", e => {
    query = e.target.value.toLowerCase();
    displaySearch();
});

searchInput.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        searchInput.blur(); // remove focus from input 
    }
});

unfundedBtn.addEventListener("click", e => filterUnfundedOnly());
fundedBtn.addEventListener("click", e => filterFundedOnly());
allBtn.addEventListener("click", e => showAllGames());


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let numUnfunded = GAMES_JSON.reduce((acc, game) => game.pledged < game.goal ? acc + 1 : acc, 0);
// const numUnfunded = GAMES_JSON.filter(game => game.pledged < game.goal).length;
const totalPledged = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalPledged.toLocaleString("en-US")} has been raised for 
    ${GAMES_JSON.length} games. Currently, ${numUnfunded} ${numUnfunded == 1 ? "game remains" : "games remain"} unfunded.
    We need your help to fund these amazing games!
    `;

// create a new DOM element containing the template string and append it to the description container
const descriptionParagraph = document.createElement("p");
descriptionParagraph.innerHTML = displayStr;
descriptionContainer.appendChild(descriptionParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
// we don't need to use spead operator since we never use the rest of the games
// we can just destructure and get the first two games instead
// with the spread operator: const [topGame, runnerUpGame, ..rest] = sortedGames;
const [first, second] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameParagraph = document.createElement("p");
firstGameParagraph.innerHTML = first.name;
firstGameContainer.appendChild(firstGameParagraph);

// do the same for the runner up item
const secondGameParagraph = document.createElement("p");
secondGameParagraph.innerHTML = second.name;
secondGameContainer.appendChild(secondGameParagraph);
