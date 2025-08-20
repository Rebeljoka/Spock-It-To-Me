document.addEventListener("DOMContentLoaded", function () {
    // Also override console.error and console.warn to log to browser-console div
    const originalConsoleError = console.error;
    console.error = function (...args) {
        originalConsoleError.apply(console, args);
        const el = document.getElementById('browser-console');
        if (el) {
            el.innerHTML += '<span style="color:#ff5555">' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '</span><br>';
        }
    };

    const originalConsoleWarn = console.warn;
    console.warn = function (...args) {
        originalConsoleWarn.apply(console, args);
        const el = document.getElementById('browser-console');
        if (el) {
            el.innerHTML += '<span style="color:#ffd700">' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '</span><br>';
        }
    };
    // Override console.log to also log to the browser-console div
    const originalConsoleLog = console.log;
    console.log = function (...args) {
        originalConsoleLog.apply(console, args);
        const el = document.getElementById('browser-console');
        if (el) {
            el.innerHTML += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '<br>';
        }
    };

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
            btn.addEventListener('click', difficultyChange);
        }
    });

    // Best Of modal button clicks (for future logic)
    ['bestOf3Btn', 'bestOf5Btn', 'endlessBtn'].forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', gameTypeChange);
        }
    });


    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------

    /** Data structures*/

    // Choices available in the game,
    const moveOptions = {
        rock: "rock",
        paper: "paper",
        scissors: "scissors",
        spock: "spock",
        lizard: "lizard",
    };

    /** winRules - array holds values that the property will beat */
    const winRules = {
        rock: [moveOptions.scissors, moveOptions.lizard],
        paper: [moveOptions.spock, moveOptions.rock],
        scissors: [moveOptions.paper, moveOptions.lizard],
        spock: [moveOptions.scissors, moveOptions.rock],
        lizard: [moveOptions.spock, moveOptions.paper],
    };

    // all possible game outcomes:
    const outcomes = { win: "win", lose: "lose", draw: "draw" };

    // difficulty levels - map to ids of difficult buttons in difficulty modal
    const difficultyLevels = {
        easy: "easyBtn",
        medium: "mediumBtn",
        hard: "hardBtn",
    };

    // Game types
    const gameType = {
        BestOf3: "bestOf3Btn",
        BestOf5: "bestOf5Btn",
        Endless: "endlessBtn",
    };

    //------------------------------------------------------------
    /** Global Variables - keep to minimum */

    // Sensible defaults for current difficulty and currentGameType
    let currentDifficulty = difficultyLevels.medium;
    let currentGameType = gameType.BestOf3;

    /** Array containing list of choices that the player has made 
     * DO NOT update with current event move selection until AFTER
     * all calculations relating to CPU have been done or will
     * HEAVILY advantage CPU move choice in favour of the CPU
    */
    const playerChoices = [];

    let playerWins = 0;
    let computerWins = 0;
    let drawnGames = 0;

    /**------------------------------------------------------------------
     * Get html element references
     */

    const playerScoreEl = document.getElementById("playerScore");
    const cpuScoreEl = document.getElementById("cpuScore");
    const drawScoreEl = document.getElementById("drawScore");

    /**-------------------------------------------------------------------
     * Attach event handlers
     */

    // Generate array of all user gameplay choice button elements.
    const choiceButtonsArray = document.getElementsByClassName("move-choice-btn");
    // Add event listeners for each button - for click and for Enter key down
    for (let button of choiceButtonsArray) {
        console.log(button.id);
        button.addEventListener("click", handleUserMoveChoice);
    }

    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------
    /** handles user click events on game move choice buttons */
    function handleUserMoveChoice(e) {
        const buttonId = e.currentTarget.id;
        console.log(`Player choices array: ${playerChoices}`);

        const computerChoice = computerChoiceGenerator(currentDifficulty);
        if (computerChoice == null) {
            console.error("null returned from computerChoiceGenerator(), exiting player input event handler");
            return;
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

        /** DO RIGHT AT THE END in order to PREVENT IT BIASING THE CPUS GO THIS ROUND
         * Especially a huge problem for MEDIUM difficulty
         */
        playerChoices.push(buttonId);
    }

    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------

    function difficultyChange(e){

        console.log('Difficulty selected:', e.currentTarget.id);
        let newDifficulty = e.currentTarget.id;
        if(newDifficulty === currentDifficulty){
            console.log("User selected same difficulty level again, nothing changed or reset");
        }
        else{
            console.log(`Difficult level change from ${currentDifficulty} to ${newDifficulty}\nresetting scores and history.`);
            currentDifficulty = newDifficulty;
            resetGame();
        }
    }

    function gameTypeChange(e){
        const buttonId = e.currentTarget.id;
        let newGameType = e.currentTarget.id;
        if(newGameType === currentGameType){
            console.log(`User selected the same game type ${currentGameType} again - continuing`);
        }
        else{
            console.log(`User changed game type from to ${currentGameType} to ${newGameType} - restarting`);
            currentGameType = newGameType;
            resetGame();
        }
    }


    /** CPU choice function: returns one of the five options as a CPU choice 
     * Difficultly parameter options are easy, medium and hard as per the difficultyLevels object
     *  - Easy: straight random choice
     *  - Medium: 40% chance of CPU counter against the last used player move
     *  - Hard: 70% chance of CPU counter against the most used / favourite player move
     * Returns: a cpu move choise based upon the difficulty level
    */
    function computerChoiceGenerator(difficulty) {
        let cpuSelection = null;

        switch (difficulty) {
            case difficultyLevels.easy:
                cpuSelection = randomMoveChoice();
                break;
            case difficultyLevels.medium:
                if(playerChoices.length === 0) return randomMoveChoice();
                const playerLastMove = playerChoices[playerChoices.length - 1];
                // Bit complex, but this should create an array (counterMovesMedium) that includes
                //  only winRules keys that include in their array lastMove as a move they beat
                const counterMovesMedium = Object.keys(winRules).filter(
                    choice => winRules[choice].includes(playerLastMove));
                cpuSelection = weightedChoice(counterMovesMedium, 0.4);
                break;
            case difficultyLevels.hard:
                if(playerChoices.length === 0) return randomMoveChoice();
                const playerMostFrequent = playerFavouriteMove();
                // See medium difficulty switch case (above) for explanation
                const counterMovesHard = Object.keys(winRules).filter(
                    choice => winRules[choice].includes(playerMostFrequent));
                cpuSelection = weightedChoice(counterMovesHard, 0.7);
                break;
        }

        if(cpuSelection === null) return randomMoveChoice();        
        else return cpuSelection;
    }

    /** Generates a random move, 1/moveOptions probability of any moveOption being selected 
     * 
    */
    function randomMoveChoice() {
        const arrayOfMoveOptions = Object.keys(moveOptions);
        let randomIndex = Math.floor(Math.random() * arrayOfMoveOptions.length);
        return arrayOfMoveOptions[randomIndex];
    }


    /** Calculates which move in the playerChoices is most picked / favoutire
     * Returns most commonly selected player move from playerChoices array
     * If more than one shares first place, fist one of these encountered in array will be chosen
    */
    function playerFavouriteMove() {
        const countPlayerChoices = {};
        // Record number of times each choice was selected
        for (let choice of playerChoices) {
            countPlayerChoices[choice] = (countPlayerChoices[choice] || 0) + 1;
        }
        // console.log(`countPlayerChoices: ${JSON.stringify(countPlayerChoices)}`);

        // Find the most-picked choice
        const entries = Object.entries(countPlayerChoices);
        if (entries.length === 0) return null;

        entries.sort(function (a, b) {
            return b[1] - a[1]; // Sort by count, descending
        });

        const favouriteMove = entries[0][0]; // The choice with the highest count
        console.log(`Player's favourite move is: ${favouriteMove}`)
        return favouriteMove;
    }


    /** Create array of move options, based on moveOptions, with duplicate entries
     * for those options that you are biasing towards
     * Parameters:
     * preferred - array of 
     * 
     */
    function weightedChoice(preferred, weight = 0.5) {

        // This function returns an array with the move repeated more times if it's preferred,
        // just the once if its no preferred
        function expandIfPreferred(moveOption) {
            if (preferred.includes(moveOption)) {
                // If moveOption is in preferred array, creates and returns new array 
                //  of size (weight * 10), and fills all elements with moveOption
                return Array(Math.round(weight * 10)).fill(moveOption);
            } else {
                // If not in preferred array, just include it once
                return [moveOption];
            }
        }

        var biasedMoveOptionsArray = [];
        const moveOptionsArray = Object.keys(moveOptions);
        // Go through every possible move
        for (var i = 0; i < moveOptionsArray.length; i++) {
            // Get the expanded array for this move
            var expanded = expandIfPreferred(moveOptionsArray[i]);
            // Add each item from the expanded array into the pool
            for (var j = 0; j < expanded.length; j++) {
                biasedMoveOptionsArray.push(expanded[j]);
            }
        }

        // Pick a random move from the pool
        if (biasedMoveOptionsArray.length === 0) return null;
        return biasedMoveOptionsArray[Math.floor(Math.random() * biasedMoveOptionsArray.length)];
    }


    /**Parameters: strings for player and computer choices,
     * returns outcome of game from the player's perspective
     */
    function checkIfPlayerWins(playerChoice, computerChoice) {
        let outcome = outcomes.draw; // defaults to draw, change only if needed

        if(playerChoice == null || computerChoice == null){
            console.error("null reference passed into checkIfPlayerWins, returning from function");
            return;
        }

        if (winRules[playerChoice].includes(computerChoice)) {
            outcome = outcomes.win;
        } else if (winRules[computerChoice].includes(playerChoice)) {
            outcome = outcomes.lose;
        }
        return outcome;
    }

    /** Updates win/lose/draw scores 
     * Returns: nothing
    */
    function updateScores(playerOutcome) {
        if (playerOutcome === outcomes.win) {
            playerWins++;
        } else if (playerOutcome === outcomes.lose) {
            computerWins++;
        } else if (playerOutcome === outcomes.draw) {
            drawnGames++;
        } else {
            console.log("Error - checkIfPlayerWins() return invalid response");
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
        playerScoreEl.innerText = playerWins;
        cpuScoreEl.innerText = computerWins;
        drawScoreEl.innerText = drawnGames;
    }

    /** Reset scores / win counts 
     * 
    */
    function resetGame() {
        playerWins = 0;
        computerWins = 0;
        drawnGames = 0;
        playerChoices.length = 0;
        displayScores();
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
