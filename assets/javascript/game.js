// Eventually, this file will be populated with code. That code will accomplish a handful of things:
// General gameplay mechanic:
// 1. Player is presented with a series of blanks ("_"); each blank represents a letter in an unknown word (unkWord)
//    1a. unkWords are stored in an array and are selected at random
//    1b. once used, they move into another array until all are used (no repeats until all are used)
// 1. when the user touches a key on the keyboard, the game will determine the letter/key pressed by the user
//    1a. in bounds letters are a-z only
//    1b. unguessed letters will be stored in an array
// 2. the game will then determine if that letter has already been guessed by seeing if it's in the array
// 3. if the letter is unguessed, it will be compared to the letters in unknown word
//    3a. if it is in the word, it's revealed
//    3b. if not, the available lives is reduced by one
// Endgame:
// Player Wins: All letters in unknown word are guessed before lives are reduced to 0 (0 is not a life). Score increased by 1. Game restarts.
// Player Loses: Player lives are reduced to 0. Loses increased by 1. Game restarts.
//
//----------------------------------------------------------------------------------------------
//                                        Main game object
//----------------------------------------------------------------------------------------------


var hangmanGame = {
    author: "Alexander Szeliga",
    unkWordArray: ["dog", "cat", "taco", "pebble", "calisthenics", "orange", "airplane", "tomato", "crazy", "merry", "strenuous", "portend", "eminent", "immense"],
    legalLetters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    //the following seven are type-defined, but will be populated by the game init.
    gameWord: "",
    gameWordArray: [],
    unguessedLetters: [],
    guessedLetters: [],
    gameBoolArray: [],
    playerLives: 0,
    gameOver: true,
    // these next two are only touched when the player wins or loses.
    playerWins: 0,
    playerLosses: 0,
    undTarget: document.getElementById("und-display"),
    consoleText: document.getElementById("console-output"),
    livesDisplay: document.getElementById("player-lives"),
    winsDisplay: document.getElementById("player-wins"),
    lossesDisplay: document.getElementById("player-losses"),
    gameInit: function () {
        // set/reset all game variables
        this.playerLives = 9;
        this.gameWord = this.randomWord(),
            this.guessedLetters = [];
        this.unguessedLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
        this.gameWordArray = this.wordArray(this.gameWord);
        this.gameBoolArray = this.genBoolWordArray(this.gameWord)
        this.gameOver = false;
        this.consoleText.textContent = "Press any key on your keyboard to guess a letter!";
    },
    letterCheck: function (userLetter) {
        // checks if a letter is in the legal letters array, which is precursor to checking if it's
        // already been guessed, which is precursor to determining if it's in the unkWord
        if (this.legalLetters.indexOf(userLetter) < 0) {
            return false;
        } else {
            return true;
        }
    },
    confLetterUnguessed: function (userLetter) {
        // checks if letter is in the unguessedLetters array, returns boolean true if it is
        if (this.unguessedLetters.indexOf(userLetter) < 0) {
            return false;
        } else {
            return true;
        }
    },
    randomWord: function () {
        // returns a random word from the unkWordArray
        var arrInd = Math.floor(Math.random() * this.unkWordArray.length);
        return this.unkWordArray[arrInd];
    },
    wordArray: function (word) {
        // lets try turning a string into an array of it's composite letters
        var wordAsArray = []
        for (i = 0; i < word.length; i++) {
            wordAsArray.push(word.charAt(i));
        }
        return wordAsArray;
    },
    genBoolWordArray: function (word) {
        // this function will generate an array that has as many boolean items as there are letters
        // with a default value of 'false'. this will be used to control a lot of the game mechanics
        // i.e. searching for the indexOf(false) returning -1 will indicate the word is done
        var boolArray = []
        for (i = 0; i < word.length; i++) {
            boolArray.push(false);
        }
        return boolArray;
    },
    genUnderscoreView: function (word, array) {
        // this function generates a string that is made up of the 
        var outputString = "";
        for (i = 0; i < word.length; i++) {
            if (array[i]) {
                outputString = outputString + " " + word.charAt(i) + " ";
            } else {
                outputString = outputString + " _ ";
            }
        }
        return outputString;
    },

    updateOutput: function () {
        this.undTarget.textContent = this.genUnderscoreView(this.gameWord, this.gameBoolArray);
        this.livesDisplay.textContent = "Lives remaining: " + this.playerLives;
        this.winsDisplay.textContent = "Wins: " + this.playerWins;
        this.lossesDisplay.textContent = "Losses: " + this.playerLosses;
    }
};
//
//----------------------------------------------------------------------------------------------
//                                       Test Function - to deprecate
//----------------------------------------------------------------------------------------------
//
function consoleTest() {
    // outputs basic game functions in console for testing
    console.clear();
    console.log("The game word is: " + hangmanGame.gameWord);
    console.log("Remaining lives: " + hangmanGame.playerLives);
    console.log(hangmanGame.genUnderscoreView(hangmanGame.gameWord, hangmanGame.gameBoolArray));
    console.log("Player wins: " + hangmanGame.playerWins);
    console.log("Player losses: " + hangmanGame.playerLosses);
       
}
//
//----------------------------------------------------------------------------------------------
//                                       Main gameplay routine
//----------------------------------------------------------------------------------------------
//
hangmanGame.consoleText.textContent = "Press any key to begin...";
console.log("Press any key to begin...");
// user presses any key
document.onkeyup = function (event) {
    if (hangmanGame.gameOver == false) {
        // set the key to a variable and turn it lower case
        var userInput = event.key.toLowerCase();
        // confirming that the userInput is a legal letter, and is unguessed
        if (hangmanGame.letterCheck(userInput) && hangmanGame.confLetterUnguessed(userInput)) {
            // we're going to add the guessed letter to the array of guessed letters and remove it from
            // the list of unguessed letters
            hangmanGame.guessedLetters.push(userInput);
            hangmanGame.unguessedLetters.splice(hangmanGame.unguessedLetters.indexOf(userInput), 1);
            //is the guessed letter in the game word?
            if (hangmanGame.gameWordArray.indexOf(userInput) < 0) {
                // if not, do this: subtract one player life
                hangmanGame.playerLives = hangmanGame.playerLives - 1;
                hangmanGame.updateOutput();
                consoleTest();
                hangmanGame.updateOutput();
                // test if lives remain:
                if (hangmanGame.playerLives > 0) {
                    hangmanGame.consoleText.textContent = "Wrong!";
                    console.log("Wrong!");
                } else {
                    // add a playerLoss
                    hangmanGame.playerLosses++;
                    hangmanGame.consoleText.textContent = "game lose, press any key to play again";
                    console.log("game lose, press any key to play again");
                    hangmanGame.gameOver = true;
                }
            } else {
                // iterate through the boolean array, flipping where necessary.
                for (i = 0; i < hangmanGame.gameBoolArray.length; i++) {
                    if (userInput == hangmanGame.gameWordArray[i]) {
                        hangmanGame.gameBoolArray[i] = true;
                    }
                }
                hangmanGame.updateOutput();
                consoleTest();
                // check if the word is complete:
                if (hangmanGame.gameBoolArray.indexOf(false) == -1) {
                    // add a win:
                    hangmanGame.playerWins++;
                    hangmanGame.consoleText.textContent = "game win, press any key to play again";
                    console.log("game win, press any key to play again");
                    hangmanGame.gameOver = true;
                } else {
                    hangmanGame.consoleText.textContent = "Correct";
                    console.log("Correct");
                }
            }
        }
        else if (hangmanGame.letterCheck(userInput) && hangmanGame.confLetterUnguessed(userInput) == false) {
            // confirms user letter is good, but it's not on the unguessed list, which implies it's already been guessed
            hangmanGame.updateOutput();
            consoleTest();
            hangmanGame.consoleText.textContent = "You've already guessed this letter."
            console.log("You've already guessed this letter");
        }
        else if (hangmanGame.letterCheck(userInput) == false) {
            // illegal input
            hangmanGame.updateOutput();
            consoleTest();
            hangmanGame.consoleText.textContent = "Illegal input";
            console.log("Illegal input");
        }
    } else {
        // this code only runs if the user presses a key while hangmanGame.gameOver = false
        // it re-inits all the game variables with a new random word and starts the game over again.
        hangmanGame.gameInit();
        hangmanGame.updateOutput();
        consoleTest();
    }
};