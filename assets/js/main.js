document.addEventListener("DOMContentLoaded", function () {
    // Boilerplate JS for instructions modal (can be expanded later)
    var instructionsModal = document.getElementById('instructionsModal');
    if (instructionsModal) {
        // Example: Show modal programmatically
        // var modal = new bootstrap.Modal(instructionsModal);
        // modal.show();
    }

    
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

    const playerChoices = [];   // Array containing list of choices that the player has made

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

        const computerChoice = computerChoiceGenerator(difficultyLevels.easy);
        console.log(
            `Player selected ${buttonId}\nComputer selected ${computerChoice}`
        );

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

        switch(difficulty){
            case difficultyLevels.easy:
                const moveChoicesArray = Object.values(moveChoices);
                selection = moveChoicesArray[randomMoveIndex()];
            break;
        }

        return selection;
    }

    function randomMoveIndex()
    {
        let randomIndex = Math.floor(Math.random() * (Object.keys(moveChoices).length)); // Get pseudorandom number of 1 - 5 to select opponent choice from array
        return randomIndex;
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
