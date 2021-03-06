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
    unkWordArray: ["cowboy", "horse", "saloon", "highnoon", "draw", "railroad", "gold", "railroad", "whiskey", "bandanna", "boots", "spurs", "saddle", "desert"],
    legalLetters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    //the following seven are type-defined, but will be populated by the game init.
    gameWord: "",
    gameWordArray: [],
    unguessedLetters: [],
    guessedLetters: [],
    gameBoolArray: [],
    usedLetters: "Used Letters: ",
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
    usedLetterDiplay: document.getElementById("used-letters-container"),
    introSong: document.getElementById("intro-song"),
    correctSound: document.getElementById("correct-sound"),
    wrongSound: document.getElementById("wrong-sound"),
    gameInit: function () {
        // set/reset all game variables
        this.playerLives = 8;
        this.gameWord = this.randomWord();
        this.guessedLetters = [];
        this.unguessedLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
        this.gameWordArray = this.wordArray(this.gameWord);
        this.gameBoolArray = this.genBoolWordArray(this.gameWord)
        this.gameOver = false;
        this.consoleText.textContent = "Choose any letter to get going!";
        this.usedLetters = "Used Letters: ";
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
        this.livesDisplay.textContent = "Lives: " + this.playerLives;
        this.winsDisplay.textContent = "Wins: " + this.playerWins;
        this.lossesDisplay.textContent = "Losses: " + this.playerLosses;
        this.usedLetterDiplay.textContent = this.usedLetters;

    }
};
//
//----------------------------------------------------------------------------------------------
//                                       Test Function - to deprecate
//----------------------------------------------------------------------------------------------
//
function consoleTest() {
    //------------------------------------------------------------------------------------------
    //                                   TO DEBUG, UNCOMMENT THE FOLLOWING FUNCTION
    //                                   CHEAT: THE GAME WORD WILL DISPLAY IN CONSOLE
    //------------------------------------------------------------------------------------------
    // console.clear();
    // console.log("The game word is: " + hangmanGame.gameWord);
    // console.log("Remaining lives: " + hangmanGame.playerLives);
    // console.log(hangmanGame.genUnderscoreView(hangmanGame.gameWord, hangmanGame.gameBoolArray));
    // console.log("Player wins: " + hangmanGame.playerWins);
    // console.log("Player losses: " + hangmanGame.playerLosses);
    // console.log("Used Letters: " + hangmanGame.usedLetters);

}
//
//----------------------------------------------------------------------------------------------
//                                       Main gameplay routine
//----------------------------------------------------------------------------------------------
//
hangmanGame.consoleText.textContent = "Hey, I'm cowboy Boring Bill. Press any key on your keyboard!";

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
            hangmanGame.usedLetters += userInput + " "
            // console.log(hangmanGame.usedLetters)

            hangmanGame.unguessedLetters.splice(hangmanGame.unguessedLetters.indexOf(userInput), 1);
            //is the guessed letter in the game word?
            if (hangmanGame.gameWordArray.indexOf(userInput) < 0) {
                // if not, do this: subtract one player life
                hangmanGame.playerLives = hangmanGame.playerLives - 1;
                // also, add the current letter to the "guessedLetters" string

                // test if lives remain:
                if (hangmanGame.playerLives > 0) {
                    hangmanGame.consoleText.textContent = "Tarnation! That ain't it.";
                    // console.log("Wrong!");
                } else {
                    // add a playerLoss
                    hangmanGame.playerLosses++;
                    hangmanGame.consoleText.textContent = "You've failed me, amigo! Press any key...";
                    // console.log("game lose, press any key to play again");
                    hangmanGame.gameOver = true;
                }
                hangmanGame.updateOutput();
            } else {
                // iterate through the boolean array, flipping where necessary.
                for (i = 0; i < hangmanGame.gameBoolArray.length; i++) {
                    if (userInput == hangmanGame.gameWordArray[i]) {
                        hangmanGame.gameBoolArray[i] = true;
                    }
                }
                
                consoleTest();
                // check if the word is complete:
                if (hangmanGame.gameBoolArray.indexOf(false) == -1) {
                    // add a win:
                    hangmanGame.playerWins++;
                    hangmanGame.consoleText.textContent = "Well get along little doggie! You win!";
                    // console.log("game win, press any key to play again");
                    hangmanGame.gameOver = true;
                } else {
                    hangmanGame.consoleText.textContent = "Well hoooo-ee! You got one!";
                    hangmanGame.correctSound.play();
                    // console.log("Correct");
                }
                hangmanGame.updateOutput();
            }
        }
        else if (hangmanGame.letterCheck(userInput) && hangmanGame.confLetterUnguessed(userInput) == false) {
            // confirms user letter is good, but it's not on the unguessed list, which implies it's already been guessed
            hangmanGame.updateOutput();
            consoleTest();
            hangmanGame.consoleText.textContent = "C'mon pardner, you tried this one already."
            // console.log("You've already guessed this letter");
        }
        else if (hangmanGame.letterCheck(userInput) == false) {
            // illegal input
            hangmanGame.updateOutput();
            consoleTest();
            hangmanGame.consoleText.textContent = "That...that's not a letter.";
            hangmanGame.wrongSound.play();
            // console.log("Illegal input");
        }
    } else {
        // this code only runs if the user presses a key while hangmanGame.gameOver = false
        // it re-inits all the game variables with a new random word and starts the game over again.
        hangmanGame.introSong.play()
        hangmanGame.gameInit();
        hangmanGame.updateOutput();
        consoleTest();
    }
};