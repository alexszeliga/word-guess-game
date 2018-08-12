// Eventually, this file will be populated with code. That code will accomplish a handful of things:
// General gameplay mechanic:
// 1. Player is presented with a series of blanks ("_"); each blank represents a letter in an unknown word
//    1a. unknown words are stored in an array and are selected at random
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