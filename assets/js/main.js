document.addEventListener("DOMContentLoaded", function () {
    // Choices available in the game,
    const moveChoices = {
        rock: "rock",
        paper: "paper",
        scissors: "scissors",
        spock: "spock",
        lizard: "lizard",
    };

    const winRules = {
        rock: [moveChoices.scissors, moveChoices.lizard],
        paper: [moveChoices.spock, moveChoices.rock],
        scissors: [moveChoices.paper, moveChoices.lizard],
        spock: [moveChoices.scissors, moveChoices.rock],
        lizard: [moveChoices.spock, moveChoices.paper],
    };

    //Obj containing all possible game outcomes:
    const outcomes = { win: "win", lose: "lose", draw: "draw" };

    // Generate array of all user gameplay choice button elements.
    const choiceButtonsArray =
        document.getElementsByClassName("move-choice-btn");
    // Add event listeners for each button - for click and for Enter key down
    for (let button of choiceButtonsArray) {
        console.log(button.id);
        button.addEventListener("click", handleUserChoice);
    }

    /** handles user click events on move choice buttons */
    function handleUserChoice(e) {
        const buttonId = e.currentTarget.id;
        const computerChoice = opponentChoiceGenerator();
        console.log(
            `Player selected ${buttonId}\nComputer selected ${computerChoice}`
        );

        const outcome = checkIfPlayerWins(buttonId, computerChoice);
        console.log(outcome);

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
    function opponentChoiceGenerator() {
        const moveChoicesArray = Object.values(moveChoices);
        let randomIndex = Math.floor(Math.random() * moveChoicesArray.length); // Get pseudorandom number of 1 - 5 to select opponent choice from array

        const selection = moveChoicesArray[randomIndex];
        return selection;
    }

    
    /** Code for handling interactive JS styling */
    const userRockBtn = document.getElementById("rock");
    const userRockImg = document.getElementById("UserRockImg");
    const defaultSrc = "assets/images/stoneBtn.webp";
    const selectedSrc = "assets/images/stoneBtnClicked.webp";

    userRockBtn.addEventListener("click", function () {
        userRockImg.src = selectedSrc;
        setTimeout(() => {
            userRockImg.src = defaultSrc;
        }, 200); // 200ms delay before switching back
    });
});
