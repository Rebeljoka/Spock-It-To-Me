document.addEventListener("DOMContentLoaded", function () {
    // Difficulty Modal JS
    var difficultyModalEl = document.getElementById('difficultyModal');
    var difficultyModal = difficultyModalEl ? new bootstrap.Modal(difficultyModalEl) : null;
    var difficultyBtn = document.getElementById('difficultyBtn');
    if (difficultyBtn && difficultyModal) {
        difficultyBtn.addEventListener('click', function() {
            difficultyModal.show();
        });
    }

    // Best Of Modal JS
    var bestOfModalEl = document.getElementById('bestOfModal');
    var bestOfModal = bestOfModalEl ? new bootstrap.Modal(bestOfModalEl) : null;
    var bestOfBtn = document.getElementById('bestOfBtn');
    if (bestOfBtn && bestOfModal) {
        bestOfBtn.addEventListener('click', function() {
            bestOfModal.show();
        });
    }

    // Difficulty modal button clicks (for future logic)
    ['easyBtn', 'mediumBtn', 'hardBtn'].forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function() {
                console.log('Difficulty selected:', btn.textContent.trim());
            });
        }
    });

    // Best Of modal button clicks (for future logic)
    ['bestOf3Btn', 'bestOf5Btn', 'endlessBtn'].forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function() {
                console.log('Best Of selected:', btn.textContent.trim());
            });
        }
    });

    /** Data structures*/

    // Choices available in the game,
    const moveChoices = {
        rock: "rock",
        paper: "paper",
        scissors: "scissors",
        spock: "spock",
        lizard: "lizard",
    };

    /** winRules - array holds values that the property will beat */
    const winRules = {
        rock: [moveChoices.scissors, moveChoices.lizard],
        paper: [moveChoices.spock, moveChoices.rock],
        scissors: [moveChoices.paper, moveChoices.lizard],
        spock: [moveChoices.scissors, moveChoices.rock],
        lizard: [moveChoices.spock, moveChoices.paper],
    };

    // all possible game outcomes:
    const outcomes = { win: "win", lose: "lose", draw: "draw" };

    // difficulty levels
    const difficultyLevels = {
        easy: "easy",
        normal: "normal",
        hard: "hard",
    };

    /** Global Variables - keep to minimum */
    let playerWins = 0;
    let computerWins = 0;
    let drawnGames = 0;

    const playerChoices = []; // Array containing list of choices that the player has made

    // Generate array of all user gameplay choice button elements.
    const choiceButtonsArray =
        document.getElementsByClassName("move-choice-btn");
    // Add event listeners for each button - for click and for Enter key down
    for (let button of choiceButtonsArray) {
        console.log(button.id);
        button.addEventListener("click", handleUserMoveChoice);
    }

    /** handles user click events on game move choice buttons */
    function handleUserMoveChoice(e) {
        const buttonId = e.currentTarget.id;
        playerChoices.push(buttonId);
        console.log(`Player choices array: ${playerChoices}`);

        const computerChoice = computerChoiceGenerator(difficultyLevels.easy);
        if (computerChoice == null) {
            throw new Error(
                "Null reference passed back from computerChoiceGenerator()"
            );
        }
        console.log(
            `Player selected ${buttonId}\nComputer selected ${computerChoice}`
        );
        playerFavouriteMove(); //Debug call

        const playerOutcome = checkIfPlayerWins(buttonId, computerChoice);
        console.log(playerOutcome);
        updateScores(playerOutcome);
        displayScores();

        // TODO: Reflect outcome of game in the html from here:
    }

    /**Parameters: strings for player1 and player2 choices,
     * returns outcome of game from the player's perspective
     */
    function checkIfPlayerWins(playerChoice, computerChoice) {
        let outcome = outcomes.draw; // defaults to draw, change only if needed

        if (winRules[playerChoice].includes(computerChoice)) {
            outcome = outcomes.win;
        } else if (winRules[computerChoice].includes(playerChoice)) {
            outcome = outcomes.lose;
        }
        return outcome;
    }

    /** CPU choice function: returns one of the five options as a CPU choice */
    function computerChoiceGenerator(difficulty) {
        let selection = null;

        switch (difficulty) {
            case difficultyLevels.easy:
                const moveChoicesArray = Object.values(moveChoices);
                selection = moveChoicesArray[randomMoveIndex()];
                break;
        }

        return selection;
    }

    /** Generates a random index number between 0 - (number of choices - 1) */
    function randomMoveIndex() {
        let randomIndex = Math.floor(
            Math.random() * Object.keys(moveChoices).length
        ); // Get pseudorandom number of 1 - 5 to select opponent choice from array
        return randomIndex;
    }

    /** Returns most commonly selected player choice from playerChoices array */
    function playerFavouriteMove() {
        const countPlayerChoices = {};

        // Record number of times each choice was selected
        for (let choice of playerChoices) {
            countPlayerChoices[choice] = (countPlayerChoices[choice] || 0) + 1;
            console.log(
                `countPlayerChoices: ${JSON.stringify(countPlayerChoices)}`
            );
        }

        // Find the most-picked choice
        const entries = Object.entries(countPlayerChoices);
        // Below: all possible choices should have been added even if no instance of their use have been counted
        if (entries.length === 0) return null;

        entries.sort(function (a, b) {
            return b[1] - a[1]; // Sort by count, descending
        });

        const favouriteMove = entries[0][0]; // The choice with the highest count
        console.log(`Player's favourite move is: ${favouriteMove}`)
        return favouriteMove;
    }

    /** Updates win/lose/draw scores */
    function updateScores(playerOutcome) {
        if (playerOutcome === outcomes.win) {
            playerWins++;
        } else if (playerOutcome === outcomes.lose) {
            computerWins++;
        } else if (playerOutcome === outcomes.draw) {
            drawnGames++;
        } else {
            console.log(
                "Error - checkIfPlayerWins() returned invalid response"
            );
        }
    }

    /** Display scores
     * TODO: Make scores display on page istead of console.
     * This function has placeholder functionality until html page is ready
     */
    function displayScores() {
        console.log(
            `Player Score is: ${playerWins}\nComputer score is: ${computerWins}\nDraws is: ${drawnGames}`
        );
    }

    /** Reset scores / win counts */
    function resetGame() {
        playerWins = 0;
        computerWins = 0;
        drawnGames = 0;

        playerChoices.length = 0;
    }

    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    /** Code for handling interactive JS styling */
    // const userRockBtn = document.getElementById("rock");
    // const userRockImg = document.getElementById("UserRockImg");
    // const defaultSrc = "assets/images/stoneBtn.webp";
    // const selectedSrc = "assets/images/stoneBtnClicked.webp";

    // userRockBtn.addEventListener("click", function () {
    //     userRockImg.src = selectedSrc;
    //     setTimeout(() => {
    //         userRockImg.src = defaultSrc;
    //     }, 200); // 200ms delay before switching back
    // });
});
