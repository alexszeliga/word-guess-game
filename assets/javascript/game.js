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
    unkWordArray: ["dog", "cat", "taco", "pebble"],
    legalLetters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    unguessedLetters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    guessedLetters: [],

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




};

//
//----------------------------------------------------------------------------------------------
//                                       Main gameplay routine
//----------------------------------------------------------------------------------------------
//

// Generate a random word from the list
var gameWord = hangmanGame.randomWord();
// turn that word into an array of the constituent letters
var gameWordArray = hangmanGame.wordArray(gameWord);
// create an array with one boolean for each letter in the gameWord
var gameBoolArray = hangmanGame.genBoolWordArray(gameWord);
// initialize the 'number of remaining letters' variable
var cntRemainingLetters = gameWordArray.length;
// init value for underscore view of word ( Taco = __c_ )
var undView = genUnderscoreView(gameWord, gameBoolArray);
// init value for player lives
var userLives = 9;

function genUnderscoreView(word, array) {
    var outputString = "";
    for (i = 0; i < word.length; i++) {
        if (array[i]) {
            outputString = outputString + word.charAt(i);
        } else {
            outputString = outputString + "_";
        }
    }
    return outputString;
}

function consoleTest() {
    console.clear();
    console.log("The game word is: " + gameWord);
    console.log(genUnderscoreView(gameWord, gameBoolArray));

}
console.log("The game word is: " + gameWord);
// user presses a key
document.onkeyup = function (event) {

    // set the key to a variable and turn it lower case
    var userInput = event.key.toLowerCase();

    // confirming that the userInput is a legal letter, and is unguessed
    if (hangmanGame.letterCheck(userInput) && hangmanGame.confLetterUnguessed(userInput)) {

        // we're going to add the guessed letter to the array of guessed letters and remove it from
        // the list of unguessed letters
        hangmanGame.guessedLetters.push(userInput);
        hangmanGame.unguessedLetters.splice(hangmanGame.unguessedLetters.indexOf(userInput), 1);

        //is the guessed letter in the game word?
        if (gameWordArray.indexOf(userInput) < 0) {
            consoleTest();
            console.log("Wrong!");
            // things that need to happen here
            // decrement number of lives by 1
            // add next 'body part' to hangman
        } else {
            // iterate through the boolean array, flipping where necessary.
            for (i = 0; i < gameBoolArray.length; i++) {
                if (userInput == gameWordArray[i]) {
                    gameBoolArray[i] = true;
                }
            }
            consoleTest();
            console.log("Correct");

        }

    }
    // confirms user letter is good, but it's not on the unguessed list, which implies it's already been guessed
    else if (hangmanGame.letterCheck(userInput) && hangmanGame.confLetterUnguessed(userInput) == false) {
        consoleTest();
        console.log("You've already guessed this letter");
    }
    // illegal input
    else if (hangmanGame.letterCheck(userInput) == false) {
        consoleTest();
        console.log("Illegal input");
    }


};