document.addEventListener("DOMContentLoaded", function() {
   
    // Choices available in the game,
    const moveChoices = {
        rock: "rock",
        paper: "paper", 
        scissors: "scissors",
        spock: "spock",
        lizard: "lizard",
        };

    //Obj containing all possible game outcomes:
    const outcomes = {win: "win", lose: "lose", draw: "draw"};

    // Generate array of all user gameplay choice button elements.
    const choiceButtonsArray = document.getElementsByClassName("move-choice-btn");    

    // Add event listeners for each button, populate array of move choices from button id
    for(let button of choiceButtonsArray){
        console.log(button.id);
        button.addEventListener("click", handleUserChoice);
    }

    /** handles user click events on move choice buttons */
    function handleUserChoice(e){
        const buttonId = e.currentTarget.id;
        const computerChoice = opponentChoiceGenerator();

        const outcome = checkIfPlayerWins(buttonId, computerChoice);
        console.log(outcome);
    }

    /**Pass strings for player1 and player2 in to func, 
     * validates string against moveChoiceArray, returns winner */
    function checkIfPlayerWins(playerChoice, computerChoice){
        console.log(`Player choice is: ${playerChoice}\nComputer choice is ${computerChoice}`);

        let outcome = outcomes.draw; // defaults to draw, change only if needed
        
        if(playerChoice === moveChoices.rock){
            if(computerChoice === moveChoices.scissors || computerChoice === moveChoices.lizard){
                outcome = outcomes.win;
            }
            else if(computerChoice === moveChoices.paper || computerChoice === moveChoices.spock){
                outcome = outcomes.lose;
            }
        }
        else if(playerChoice === moveChoices.paper){
            if(computerChoice === moveChoices.rock || computerChoice === moveChoices.spock){
                outcome = outcomes.win;
            }
            else if(computerChoice === moveChoices.scissors || computerChoice === moveChoices.lizard){
                outcome = outcomes.lose;
            }
        }
        else if(playerChoice === moveChoices.scissors){
            if(computerChoice === moveChoices.paper || computerChoice === moveChoices.lizard){
                outcome = outcomes.win;
            }
            else if(computerChoice === moveChoices.rock || computerChoice === moveChoices.spock){
                outcome = outcomes.lose;
            }
        }
        else if(playerChoice === moveChoices.spock){
            if(computerChoice === moveChoices.scissors || computerChoice === moveChoices.rock){
                outcome = outcomes.win;
            }
            else if (computerChoice === moveChoices.lizard || computerChoice === moveChoices.paper){
                outcome = outcomes.lose;
            }
        }
        else if(playerChoice === moveChoices.lizard){
            if(computerChoice === moveChoices.scissors || computerChoice === moveChoices.paper){
                outcome = outcomes.win;
            }
            else if(computerChoice === moveChoices.scissors || computerChoice === moveChoices.rock){
                outcome = outcomes.lose;
            }
        }
        
        return outcome;
    }



    /** CPU choice function: returns one of the five options as a CPU choice */
    function opponentChoiceGenerator(){
        
        const moveChoicesArray = Object.values(moveChoices);
        let randomIndex = Math.floor(Math.random() * moveChoicesArray.length);  // Get pseudorandom number of 1 - 5 to select opponent choice from array

        const selection = moveChoicesArray[randomIndex];
        return selection;
    }

});