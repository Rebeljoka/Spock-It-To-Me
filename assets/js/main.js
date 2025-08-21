// Keyboard shortcut to open How to Play modal (H)
document.addEventListener("keydown", function(e) {
    if ((e.key === "h" || e.key === "H") && !document.body.classList.contains("modal-open")) {
        var instructionsModalEl = document.getElementById('instructionsModal');
        if (instructionsModalEl) {
            var instructionsModal = new bootstrap.Modal(instructionsModalEl);
            instructionsModal.show();
        }
    }
});
    // Keyboard shortcuts for Best Of modal
    document.addEventListener("keydown", function(e) {
        const modalEl = document.getElementById("bestOfModal");
        const isOpen = modalEl && modalEl.classList.contains("show");
        if (!isOpen) return;
        if (e.key === "3") {
            const btn = document.getElementById("bestOf3Btn");
            if (btn) {
                btn.focus();
                btn.click();
            }
        }
        if (e.key === "5") {
            const btn = document.getElementById("bestOf5Btn");
            if (btn) {
                btn.focus();
                btn.click();
            }
        }
        // Use N for endless to avoid E conflict
        if (e.key === "n" || e.key === "N") {
            const btn = document.getElementById("endlessBtn");
            if (btn) {
                btn.focus();
                btn.click();
            }
        }
    });
    // Keyboard shortcuts for difficulty modal
    document.addEventListener("keydown", function(e) {
        const modalEl = document.getElementById("difficultyModal");
        const isOpen = modalEl && modalEl.classList.contains("show");
        if (!isOpen) return;
        if (e.key === "e" || e.key === "E") {
            const btn = document.getElementById("easyBtn");
            if (btn) {
                btn.focus();
                btn.click();
            }
        }
        if (e.key === "m" || e.key === "M") {
            const btn = document.getElementById("mediumBtn");
            if (btn) {
                btn.focus();
                btn.click();
            }
        }
        if (e.key === "h" || e.key === "H") {
            const btn = document.getElementById("hardBtn");
            if (btn) {
                btn.focus();
                btn.click();
            }
        }
    });

document.addEventListener("DOMContentLoaded", function () {
    // At the end of DOMContentLoaded, highlight default selections
    window.setTimeout(function() {
        var defaultBestOfBtn = document.getElementById(currentGameType);
        if (defaultBestOfBtn) defaultBestOfBtn.classList.add('selected');
        var defaultDifficultyBtn = document.getElementById(currentDifficulty);
        if (defaultDifficultyBtn) defaultDifficultyBtn.classList.add('selected');
    }, 0);

    // // Difficulty Modal JS
    // var difficultyModalEl = document.getElementById('difficultyModal');
    // var difficultyModal = difficultyModalEl ? new bootstrap.Modal(difficultyModalEl) : null;
        var difficultyBtn = document.getElementById('difficultyBtn');
        if (difficultyBtn && difficultyModal) {
            difficultyBtn.addEventListener('click', function() {
                // Remove 'selected' from all difficulty buttons
                ['easyBtn', 'mediumBtn', 'hardBtn'].forEach(function(id) {
                    var btn = document.getElementById(id);
                    if (btn) btn.classList.remove('selected');
                });
                // Add 'selected' to the current difficulty button
                var selectedBtn = document.getElementById(currentDifficulty);
                if (selectedBtn) selectedBtn.classList.add('selected');
                difficultyModal.show();
            });
        }

    // Best Of Modal JS
    var bestOfModalEl = document.getElementById('bestOfModal');
    var bestOfModal = bestOfModalEl ? new bootstrap.Modal(bestOfModalEl) : null;
    var bestOfBtn = document.getElementById('bestOfBtn');
    if (bestOfBtn && bestOfModal) {
        bestOfBtn.addEventListener('click', function() {
            // Remove 'selected' from all Best Of buttons
            ['bestOf3Btn', 'bestOf5Btn', 'endlessBtn'].forEach(function(id) {
                var btn = document.getElementById(id);
                if (btn) btn.classList.remove('selected');
            });
            // Add 'selected' to the current game type button
            var selectedBtn = document.getElementById(currentGameType);
            if (selectedBtn) selectedBtn.classList.add('selected');
            bestOfModal.show();
        });
    }

    // Difficulty modal button clicks (for future logic)
    var difficultyModalEl = document.getElementById('difficultyModal');
    var difficultyModal = difficultyModalEl ? new bootstrap.Modal(difficultyModalEl) : null;
    ['easyBtn', 'mediumBtn', 'hardBtn'].forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function(e) {
                difficultyChange(e);
                // Remove 'selected' from all difficulty buttons
                ['easyBtn', 'mediumBtn', 'hardBtn'].forEach(function(id2) {
                    var btn2 = document.getElementById(id2);
                    if (btn2) btn2.classList.remove('selected');
                });
                btn.classList.add('selected');
                setTimeout(function() {
                    if (difficultyModal) {
                        difficultyModal.hide();
                    }
                }, 1000);
            });
        }
    });

    // Best Of modal button clicks (for future logic)
    var bestOfModalEl = document.getElementById('bestOfModal');
    var bestOfModal = bestOfModalEl ? new bootstrap.Modal(bestOfModalEl) : null;
    ['bestOf3Btn', 'bestOf5Btn', 'endlessBtn'].forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function(e) {
                gameTypeChange(e);
                // Remove 'selected' from all Best Of buttons
                ['bestOf3Btn', 'bestOf5Btn', 'endlessBtn'].forEach(function(id2) {
                    var btn2 = document.getElementById(id2);
                    if (btn2) btn2.classList.remove('selected');
                });
                btn.classList.add('selected');
                if (bestOfModal) {
                    setTimeout(function() {
                        bestOfModal.hide();
                    }, 1000);
                }
            });
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

    const difficultyLevelLabels = {
        easyBtn: "Easy",
        mediumBtn: "Medium",
        hardBtn: "Hard",
    };

    // Game types
    const gameType = {
        BestOf3: "bestOf3Btn",
        BestOf5: "bestOf5Btn",
        Endless: "endlessBtn",
    };

    const gameTypeLabels = {
        bestOf3Btn: "Best of 3",
        bestOf5Btn: "Best of 5",
        endlessBtn: "Endless",
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
    const playerMoveChoices = [];
    let movesThisGame = 0;

    let playerWins = 0;
    let computerWins = 0;
    let drawnGames = 0;

    let gameComplete = false;
    let gameStarted = false;

    /**------------------------------------------------------------------
     * Get html element references
     */

    const playerScoreEl = document.getElementById("playerScore");
    const cpuScoreEl = document.getElementById("cpuScore");
    const drawScoreEl = document.getElementById("drawScore");


    /** CPU game move buttons */
    // Create an array of all the CPU button elements,
    const cpuButtonElArray = document.getElementsByClassName("CPU-btn");
    // Generate array of all user gameplay choice button elements.
    const choiceButtonsArray = document.getElementsByClassName("move-choice-btn");

    const startButtonEl = document.getElementById("startBtn");
    const restartButtonEl = document.getElementById("restartBtn");

    const gameStateMessageEl = document.getElementById("game-state-message");


    /**-------------------------------------------------------------------
     * Attach event handlers
     */


    // Add event listeners for each button - for click
    for (let button of choiceButtonsArray) {
        console.log(button.id);
        button.addEventListener("click", handleUserMoveChoice);
    }

    // Keyboard shortcuts: 1-5 for user move buttons
    document.addEventListener("keydown", function(e) {
        // User move buttons: 1-5 and Enter
        if (gameComplete === false && gameStarted === true) {
            const keyMap = {
                "1": "rock",
                "2": "paper",
                "3": "scissors",
                "4": "lizard",
                "5": "spock"
            };
            const btnId = keyMap[e.key];
            if (btnId) {
                const btn = document.getElementById(btnId);
                // Respect tabIndex=-1 (used to make move buttons non-interactive for keyboard)
                if (btn && btn.tabIndex !== -1) {
                    btn.focus();
                    btn.click();
                }
                return;
            }
            if (e.key === "Enter") {
                const active = document.activeElement;
                // Only activate Enter if the focused move button is keyboard-focusable (tabIndex !== -1)
                if (active && active.classList.contains("move-choice-btn") && active.tabIndex !== -1) {
                    active.click();
                }
                return;
            }
        }
        // Global shortcuts (always available)
        if (e.key === "s" || e.key === "S") {
            if (startButtonEl && !startButtonEl.disabled) {
                startButtonEl.focus();
                startButtonEl.click();
            }
        }
        if (e.key === "r" || e.key === "R") {
            if (restartButtonEl && !restartButtonEl.disabled) {
                restartButtonEl.focus();
                restartButtonEl.click();
            }
        }
        if (e.key === "d" || e.key === "D") {
            const difficultyBtn = document.getElementById("difficultyBtn");
            if (difficultyBtn && !difficultyBtn.disabled) {
                difficultyBtn.focus();
                difficultyBtn.click();
            }
        }
        if (e.key === "b" || e.key === "B") {
            const bestOfBtn = document.getElementById("bestOfBtn");
            if (bestOfBtn && !bestOfBtn.disabled) {
                bestOfBtn.focus();
                bestOfBtn.click();
            }
        }
    });

    // Call resetGame function on restart button element click
    startButtonEl.addEventListener("click", gameStartFunc);
    restartButtonEl.addEventListener("click", gameRestartFunc);


    /** Game state handling functions */
    function gameInitialStateFunc(){
        gameComplete = false;
        gameStarted = false;
        resetGame();
        enableStartButton();
        disableRestartButton();
        disablePlayerMoveButtons();
        disableCpuMoveButtons();
    // Ensure difficulty and best-of controls are available when no game is running
    enableDifficultyButton();
    enableBestOfButton();
    }

    function gameStartFunc(){
        gameComplete = false;
        gameStarted = true;
        resetGame();
        disableStartButton();
        enablePlayerMoveButtons();
        enableCpuMoveButtons();
        enableRestartButton();
    // While a game is running, prevent changing settings
    disableDifficultyButton();
    disableBestOfButton();
        gameStateMessageEl.innerText = "Now you've dun gone started the game...\n"
        gameStateMessageEl.innerText += `Game is ${gameTypeLabels[currentGameType]
            }, Difficulty is ${difficultyLevelLabels[currentDifficulty]}\n`;
    }

    function gameCompleteFunc(){
        gameComplete = true;
        gameStarted = false;
        enableStartButton();
        disableRestartButton();
        disablePlayerMoveButtons();
        disableCpuMoveButtons();
    // Re-enable settings when the game completes
    enableDifficultyButton();
    enableBestOfButton();
        // gameStateMessageEl.innerText = "That's it! Game completed!\n"
        // gameStateMessageEl.innerText += `${gameOutcomeMessage()}\n`;
    }

    function gameRestartFunc(){
    gameInitialStateFunc();
    gameStateMessageEl.innerText = "Game reset! You can change Best Of or Difficulty before starting.";
    }

    //--------------------------------------------------------------------------------------
    // Init game state now all varibles are declared
    //--------------------------------------------------------------------------------------

    gameInitialStateFunc();
    gameStateMessageEl.innerText = "Game initialised! Ready to start ....";
    if ( currentGameType != null && currentDifficulty != null){
        gameStateMessageEl.innerText = `Game type is ${gameTypeLabels[currentGameType]
            }, Difficulty is ${difficultyLevelLabels[currentDifficulty]}.`;
    }

    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------

    /** -----------------------------------------
     * Event handling functions
     */

    function difficultyChange(e){
        let newDifficulty = e.currentTarget.id;
        if(newDifficulty != currentDifficulty){
            gameStateMessageEl.innerText = `Difficulty changed from ${difficultyLevelLabels[currentDifficulty]
                } to ${difficultyLevelLabels[newDifficulty]}.\n`;
            gameStateMessageEl.innerText += "Game ready to start."
            currentDifficulty = newDifficulty;
            gameInitialStateFunc();
        }else{
            gameStateMessageEl.innerText = `You're already on ${
                difficultyLevelLabels[currentDifficulty]} difficulty level.`;
        }
    }

    function gameTypeChange(e){
        let newGameType = e.currentTarget.id;
        if(newGameType != currentGameType){
            gameStateMessageEl.innerText = `Game type changed from ${gameTypeLabels[currentGameType]
                } to ${gameTypeLabels[newGameType]}.\n`;
            gameStateMessageEl.innerText += "Game ready to start."
            currentGameType = newGameType;
            gameInitialStateFunc();
        }else{
            gameStateMessageEl.innerText = `You're already playing ${
                gameTypeLabels[currentGameType]}.`;
        }
    }

    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------
    /** handles user click events on game move choice buttons */
    function handleUserMoveChoice(e) {
        // If game is over, simply ignore all user move choices
        if(!gameStarted || gameComplete === true){
            return;
        }

        const playerChoiceButtonId = e.currentTarget.id;

        // Hide all other user move buttons, show only the selected one
        for (let btn of document.getElementsByClassName("move-choice-btn")) {
            if (btn.id === playerChoiceButtonId) {
                btn.style.display = "inline-block";
                btn.classList.add("selected-move-btn");
                btn.style.pointerEvents = "none";
                btn.tabIndex = -1;
            } else {
                btn.style.display = "none";
            }
        }

            // Simulate CPU thinking for 2 seconds before picking
            setTimeout(() => {
                const computerChoice = computerChoiceGenerator(currentDifficulty);

                // Hide all other CPU buttons, show only the selected one
                for (let btn of document.getElementsByClassName("CPU-btn")) {
                    if (btn.id.toLowerCase() === "cpu" + computerChoice.toLowerCase()) {
                        btn.style.display = "inline-block";
                        btn.classList.add("selected-move-btn");
                    } else {
                        btn.style.display = "none";
                    }
                }

                if (computerChoice == null) { 
                    console.error("null returned from computerChoiceGenerator(), exiting player input event handler");
                    return;
                }

                const playerOutcome = processRound(playerChoiceButtonId, computerChoice, currentGameType);
                console.log(`playerOutcome is: ${playerOutcome}`);

                // Start countdown AFTER CPU picks
                startCountdown(() => {
                    gameStateMessageEl.innerText = `You chose ${playerChoiceButtonId}! Computer chose ${computerChoice}!\n`;
                    gameStateMessageEl.innerText += `You ${playerOutcome}!\n`;
                    updateScores(playerOutcome);
                    displayScores();

                    // After round, restore all buttons and re-enable them
                    for (let btn of document.getElementsByClassName("move-choice-btn")) {
                        btn.style.display = "inline-block";
                        btn.classList.remove("selected-move-btn");
                        btn.style.pointerEvents = "auto";
                        btn.tabIndex = 0;
                    }
                    for (let btn of document.getElementsByClassName("CPU-btn")) {
                        btn.style.display = "inline-block";
                        btn.classList.remove("selected-move-btn");
                    }

                    if(gameComplete === true){
                        showWhoWonCountdown(() => {
                            gameStateMessageEl.innerText = `Game Over! ${gameOutcomeMessage().toUpperCase()}`;
                            displayWhoWonTimedMessage();
                        });
                        gameCompleteFunc();
                    }
                });

                /** DO RIGHT AT THE END in order to PREVENT IT BIASING THE CPU's GO THIS ROUND */
                playerMoveChoices.push(playerChoiceButtonId);
            }, 2000);

        // Hide all other CPU buttons, show only the selected one
        for (let btn of document.getElementsByClassName("CPU-btn")) {
            if (btn.id.toLowerCase() === "cpu" + computerChoice.toLowerCase()) {
                btn.style.display = "inline-block";
                btn.classList.add("selected-move-btn");
            } else {
                btn.style.display = "none";
            }
        }
        if (computerChoice == null) { 
            console.error("null returned from computerChoiceGenerator(), exiting player input event handler");
            return;
        }

        const playerOutcome = processRound(playerChoiceButtonId, computerChoice, currentGameType);
        console.log(`playerOutcome is: ${playerOutcome}`);


        /** DO RIGHT AT THE END in order to PREVENT IT BIASING THE CPU's GO THIS ROUND */
        playerMoveChoices.push(playerChoiceButtonId);
    }


    function showWinner() {
        gameStateMessageEl.innerText = `Game Over! ${gameOutcomeMessage()}`;
    }



    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------

    /** Processes round logic
     * Parameters:
     * - playerChoice - string representing player choice of move
     * - computerChoice - string representing computer choice of move
     * - currentGameType -  bestOf3, 5, Endless
     * Returns: 
     * - outcome of the game from the player's perspective
     */

    function processRound(playerChoice, computerChoice, currentGameType){
        // Error handling
        if(playerChoice == false || computerChoice == false) return null;
        if(gameComplete === true) console.log("Game is complete, processRound should not be called until restart");

        let playerWinOutcome = null;
        movesThisGame++;
        console.log(`Entering processRound(), num moves this game so far: ${movesThisGame}`);
       
        switch(currentGameType){
            case gameType.BestOf3:
                console.log("case: best of 3");
                if(movesThisGame < 3){
                    playerWinOutcome = checkIfPlayerWins(playerChoice, computerChoice);
                }
                else if(movesThisGame === 3){
                    playerWinOutcome = checkIfPlayerWins(playerChoice, computerChoice);
                    gameComplete = true;
                }else{
                    console.log("case: best of 3 over, game should no longer be reaching here");
                }
                break;
            case gameType.BestOf5:
                console.log("case: best of 5");
                if(movesThisGame < 5){
                    playerWinOutcome = checkIfPlayerWins(playerChoice, computerChoice);
                }
                else if(movesThisGame === 5){
                    playerWinOutcome = checkIfPlayerWins(playerChoice, computerChoice);
                    gameComplete = true;
                }else{
                    console.log("case: best of 5 over, game should no longer be reaching here");
                }
                break;
            case gameType.Endless:
                console.log("case: endless");
                playerWinOutcome = checkIfPlayerWins(playerChoice, computerChoice);
                break;
            default:
                console.log("Invalid game type passed into processRound(), no game processing done");
        }
        return playerWinOutcome;
    }

    /**gameOutComeMessage: generates a short string explaining who has won 
     * based on the scores at the time of calling 
     * */
    function gameOutcomeMessage(){
        if(playerWins > computerWins){
            return "PLAYER Wins!";
        }
        else if(computerWins > playerWins){
            return "COMPUTER wins!";
        }
        else
            {
            return "It's a DRAW!";
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
                if(playerMoveChoices.length === 0) return randomMoveChoice();
                const playerLastMove = playerMoveChoices[playerMoveChoices.length - 1];
                // Bit complex, but this should create an array (counterMovesMedium) that includes
                //  only winRules keys that include in their array lastMove as a move they beat
                const counterMovesMedium = Object.keys(winRules).filter(
                    choice => winRules[choice].includes(playerLastMove));
                cpuSelection = weightedChoice(counterMovesMedium, 0.4);
                break;
            case difficultyLevels.hard:
                if(playerMoveChoices.length === 0) return randomMoveChoice();
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


    /** Calculates which move in the playerMoveChoices is most picked / favoutire
     * Returns most commonly selected player move from playerMoveChoices array
     * If more than one shares first place, fist one of these encountered in array will be chosen
    */
    function playerFavouriteMove() {
        const countPlayerChoices = {};
        // Record number of times each choice was selected
        for (let choice of playerMoveChoices) {
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


    /** Helper functions ----------------------------------
     * 
     */

    /** Updates win/lose/draw scores 
     * Returns: nothing
    */
    function updateScores(playerOutcome) {
        if (playerOutcome === outcomes.win) {
            playerWins++;
            jsConfetti.addConfetti({
                emojis: ["🪙", "🎉", "✨", "🎊", "🍾", "🥳", "🎈", "🙌🏾", "🪅"],
                emojiSize: 100,
                confettiNumber: 500
            });
        } else if (playerOutcome === outcomes.lose) {
            computerWins++;
            jsConfetti.addConfetti({
                emojis: [ "❌", "💔"],
                confettiColors: ["#FF2A00"],
                emojiSize: 100,
                confettiNumber: 500
            });
        } else if (playerOutcome === outcomes.draw) {
            drawnGames++;
        } else {
            console.log("Error - checkIfPlayerWins() return invalid response");
        }
    }

    /** Display scores
     */
    function displayScores() {
        playerScoreEl.innerText = playerWins;
        cpuScoreEl.innerText = computerWins;
        drawScoreEl.innerText = drawnGames;
    }

    /** Reset scores / win counts then push to display suing displayScores() function
     * 
    */
    function resetGame(e) {
        playerWins = 0;
        computerWins = 0;
        drawnGames = 0;
        playerMoveChoices.length = 0;
        movesThisGame = 0;
        gameComplete = false;
        displayScores();
        console.log(`Game reset: wld: ${playerWins} ${computerWins} ${drawnGames} PMC: ${playerMoveChoices.length
            } MTG: ${movesThisGame} GC: ${gameComplete}`);
    }

    /** Buttons enabling / disabling functions
     * Buttons are greyed out when disabled
     */

    function disableStartButton(){
        startButtonEl.disabled = true;
        startButtonEl.classList.add("greyed-out");
    }

    function enableStartButton(){
        startButtonEl.disabled = false;
        startButtonEl.classList.remove("greyed-out");
    }

    function disableRestartButton(){
        restartButtonEl.disabled = true;
        restartButtonEl.classList.add("greyed-out");
    }

    function enableRestartButton(){
        restartButtonEl.disabled = false;
        restartButtonEl.classList.remove("greyed-out");
    }

    function disableCpuMoveButtons(){
        for(let el of cpuButtonElArray){
            el.disabled = true;
            el.classList.add("greyed-out");  
        }
    }

    function enableCpuMoveButtons(){
        for(let el of cpuButtonElArray){
            el.disabled = false;
            el.classList.remove("greyed-out");  
        }
    }

    function disablePlayerMoveButtons(){
        for(let el of choiceButtonsArray){
            el.disabled = true;
            el.classList.add("greyed-out");
        }
    }

    function enablePlayerMoveButtons(){
        for(let el of choiceButtonsArray){
            el.disabled = false;
            el.classList.remove("greyed-out");
        }
    }

    // Difficulty & Best-Of controls (top-level settings) - enable/disable helpers
    function disableDifficultyButton(){
        const difficultyBtn = document.getElementById('difficultyBtn');
        if(difficultyBtn){
            difficultyBtn.disabled = true;
            difficultyBtn.classList.add('greyed-out');
        }
    }

    function enableDifficultyButton(){
        const difficultyBtn = document.getElementById('difficultyBtn');
        if(difficultyBtn){
            difficultyBtn.disabled = false;
            difficultyBtn.classList.remove('greyed-out');
        }
    }

    function disableBestOfButton(){
        const bestOfBtn = document.getElementById('bestOfBtn');
        if(bestOfBtn){
            bestOfBtn.disabled = true;
            bestOfBtn.classList.add('greyed-out');
        }
    }

    function enableBestOfButton(){
        const bestOfBtn = document.getElementById('bestOfBtn');
        if(bestOfBtn){
            bestOfBtn.disabled = false;
            bestOfBtn.classList.remove('greyed-out');
        }
    }

    /** Interactive button JS code */

    // Countdown function
    function startCountdown(callback) {
        const container = document.getElementById('countdown-timer-container');
        if (!container) return;
        container.innerHTML = '';
        const countdownDiv = document.createElement('div');
    countdownDiv.id = 'countdown-timer';
    countdownDiv.classList.add('countdown-active');
        container.appendChild(countdownDiv);
        let count = 3;
        function updateCountdownDisplay(val) {
            let color = '#ff3333';
            if (val === 2) color = '#FFD700';
            if (val === 1) color = '#33cc33';
            countdownDiv.innerHTML = `<span style="color:${color}">${val}</span>`;
        }
        updateCountdownDisplay(count);
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                updateCountdownDisplay(count);
            } else if (count === 0) {
                countdownDiv.innerHTML = `<span style="color:#33cc33">GO!</span>`;
            } else {
                clearInterval(interval);
                container.innerHTML = '';
                if (typeof callback === 'function') callback();
            }
        }, 700);
    }

    /** Timer used to delay callback by 4 seconds, display "WHO WON THE GAME?"
     * while counting down
     */
    function showWhoWonCountdown(callback) {
        const container = document.getElementById("countdown-timer-container");
        if (!container) return;
        container.innerHTML = "";
        const whoWonDiv = document.createElement("div");
        whoWonDiv.id = "who-won-timer";
        whoWonDiv.style.fontSize = "4rem";
        whoWonDiv.style.fontWeight = "bold";
        whoWonDiv.style.textAlign = "center";
        whoWonDiv.style.color = "purple";
        whoWonDiv.innerText = "WHO WON THE GAME?";
        container.appendChild(whoWonDiv);

        // Show "WHO WON?" for 4 seconds, then clear and call callback
        setTimeout(() => {
            container.innerHTML = "";
            if (typeof callback === "function") callback();
        }, 4000);
    }

    /**Timer being used to display who won the game prominently for 4 seconds  */
    function displayWhoWonTimedMessage(callback) {
        const container = document.getElementById("countdown-timer-container");
        if (!container) return;
        container.innerHTML = "";
        const whoWonTimedMessageDiv = document.createElement("div");
        whoWonTimedMessageDiv.id = "display-who-won-timer";
        whoWonTimedMessageDiv.style.fontSize = "4rem";
        whoWonTimedMessageDiv.style.fontWeight = "bold";
        whoWonTimedMessageDiv.style.textAlign = "center";
        whoWonTimedMessageDiv.style.color = "red";
        whoWonTimedMessageDiv.innerText = gameOutcomeMessage();
        container.appendChild(whoWonTimedMessageDiv);

        // Show whoWonDiv.innerText for 4 seconds, then clear and call callback
        setTimeout(() => {
            container.innerHTML = "";
            if (typeof callback === "function") callback();
        }, 4000);
    }

    const userLizardBtn = document.getElementById("lizard");
    const userLizardImg = document.getElementById("UserLizardImg");
    const defaultLizardSrc = "assets/images/lizardBtn.webp";
    const selectedLizardSrc = "assets/images/lizardBtnClicked.webp";
    userLizardBtn.addEventListener("click", function () {
        if (gameComplete) return;
        userLizardImg.src = selectedLizardSrc;
        setTimeout(() => {
            userLizardImg.src = defaultLizardSrc;
        }, 200);
    });

    const userSpockBtn = document.getElementById("spock");
    const userSpockImg = document.getElementById("UserSpockImg");
    const defaultSpockSrc = "assets/images/spockBtn.webp";
    const selectedSpockSrc = "assets/images/spockBtnClicked.webp";
    userSpockBtn.addEventListener("click", function () {
        if (gameComplete) return;
        userSpockImg.src = selectedSpockSrc;
        setTimeout(() => {
            userSpockImg.src = defaultSpockSrc;
        }, 200);
    });

    const canvas = document.getElementById("confetti-canvas");
    const jsConfetti = new JSConfetti({ canvas });

        const userRockBtn = document.getElementById("rock");
    const userRockImg = document.getElementById("UserRockImg");
    const defaultRockSrc = "assets/images/rockBtn.webp";
    const selectedRockSrc = "assets/images/rockBtnClicked.webp";
    userRockBtn.addEventListener("click", function () {
        if (gameComplete) return;
        userRockImg.src = selectedRockSrc;
        setTimeout(() => {
            userRockImg.src = defaultRockSrc;
        }, 200);
    });

    const userPaperBtn = document.getElementById("paper");
    const userPaperImg = document.getElementById("UserPaperImg");
    const defaultPaperSrc = "assets/images/paperBtn.webp";
    const selectedPaperSrc = "assets/images/paperBtnClicked.webp";
    userPaperBtn.addEventListener("click", function () {
        if (gameComplete) return;
        userPaperImg.src = selectedPaperSrc;
        setTimeout(() => {
            userPaperImg.src = defaultPaperSrc;
        }, 200);
    });

    const userScissorsBtn = document.getElementById("scissors");
    const userScissorsImg = document.getElementById("UserScissorsImg");
    const defaultScissorsSrc = "assets/images/scissorsBtn.webp";
    const selectedScissorsSrc = "assets/images/scissorsBtnClicked.webp";
    userScissorsBtn.addEventListener("click", function () {
        if (gameComplete) return;
        userScissorsImg.src = selectedScissorsSrc;
        setTimeout(() => {
            userScissorsImg.src = defaultScissorsSrc;
        }, 200);
    });


});