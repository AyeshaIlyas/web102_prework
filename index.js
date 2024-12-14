// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);


/*********************** Element references *********************************/
const gamesContainer = document.getElementById("games-container");
const contributionsCard = document.getElementById("num-contributions");
const raisedCard = document.getElementById("total-raised");
const gamesCard = document.getElementById("num-games");
// index 0 - unfunded, 1 - funded, 2 - all
const filterBtns = document.getElementById("controls-container").querySelectorAll("button");
const searchInput = document.getElementById("search");
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");
const descriptionContainer = document.getElementById("description-container");


/***************************** Global State **********************************/
let query = "";
let filterStatus = "all";


/*********************** DOM Manipulation Functions ***************************
* Skills used: DOM manipulation, for loops, template literals, functions
*/

// remove active class from all filter buttons
function removeActive() {
    for (const btn of filterBtns) {
        btn.classList.remove("active");
    }
}

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// add the specified list of games to the DOM
function addGamesToPage(games) {
    if (games.length == 0) {
        const emptyPara = document.createElement("p");
        emptyPara.innerHTML = "No games found...";
        gamesContainer.appendChild(emptyPara);
    }

    // loop over each item in the data
    for (const game of games) {

        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");
        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // calculate percentage of goal reached
        const fundingPercentage = Math.round((game.pledged / game.goal) * 1000) / 10;

        // select a color to the progress bar based on the percentage 
        let color = "";
        if (fundingPercentage <= 30) {
            color = "#d91c1c"; // red
        } else if (fundingPercentage <= 60) {
            color = "#ffef0a"; // yellow
        } else { // > 60%
            color = "#42ad00"; // dark green
        }

        const gameInfo = `
            <div class="game-info">
                <img class="game-img" src=${game.img} />
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <p>Backers: ${game.backers}</p>
            </div>
            ${ 
                fundingPercentage >= 100 ?
                 "<p>⭐ Fully Funded ⭐</p>" : 
                `
                <div class="progress-status">
                    <div class="progress-bar">
                        <div class="progress-fill" 
                            style="width: ${fundingPercentage}%; 
                            background-color: ${color}"></div>
                    </div>
                    <div>${fundingPercentage.toFixed(1)}%</div>
                </div>
                `
            }
        `;
        gameCard.innerHTML = gameInfo;
        
        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}


/*************************************************************************************
 * Add information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// use filter or reduce to count the number of unfunded games
const numUnfunded = GAMES_JSON.reduce((acc, game) => game.pledged < game.goal ? acc + 1 : acc, 0);
// could also use filter, which is more readable : const numUnfunded = GAMES_JSON.filter(game => game.pledged < game.goal).length;
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


/*************************************************************************************
 * Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// calculate and display the total number of contributors/backers
const totalContributors = GAMES_JSON.reduce((acc, game) => acc + game.backers, 0);
contributionsCard.innerHTML = `${totalContributors.toLocaleString("en-US")}`;

// calculate and display the funding total
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);
raisedCard.innerHTML = `$${totalRaised.toLocaleString("en-US")}`;

// display the number of games 
gamesCard.innerHTML = GAMES_JSON.length;


/************************************************************************************
 * Display the top 2 games
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

const firstGameParagraph = document.createElement("p");
firstGameParagraph.innerHTML = first.name;
firstGameContainer.appendChild(firstGameParagraph);

const secondGameParagraph = document.createElement("p");
secondGameParagraph.innerHTML = second.name;
secondGameContainer.appendChild(secondGameParagraph);


/*************************************************************************************
 * Add functions to search games and filter by funding.
 * Skills used: functions, filter
*/

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

    // set style of filter to active
    removeActive();
    filterBtns[0].classList.add("active");

    deleteChildElements(gamesContainer);
    addGamesToPage(search());
}

// show only games that are fully funded, that also match search query
function filterFundedOnly() {
    filterStatus = "funded";

    // set style of filter to active
    removeActive();
    filterBtns[1].classList.add("active");

    deleteChildElements(gamesContainer);
    addGamesToPage(search());
}

// show all games, that also match search query
function showAllGames() {
    filterStatus = "all";

    // set style of filter to active
    removeActive();
    filterBtns[2].classList.add("active");

    deleteChildElements(gamesContainer);
    addGamesToPage(search());
}


/*************************************************************************************
 * Add event listeners to input field and filter buttons
 * Skills used: event listeners
*/

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


// initially display all games
addGamesToPage(GAMES_JSON);