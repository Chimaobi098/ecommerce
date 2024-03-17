"use strict";

//object to hold common board variables
var board = {
  matrix: [], //empty array where the matrix will go
  boardSize: {
    rows: config.board.rows,
    columns: config.board.columns
  }
}; //rent word being fit into matrix
var currentWord = {
  viablePaths: [], //array of orientations the word can take
  wordFitted: false, //whether the word has been set into grid
};

function WordSearchLogic(list) {
  //empty object to hold the locations of each fitted word
  var wordLocations = {};

  this.setUpGame = function () {
    board.matrix = createMatrix(board.boardSize);
    // if(typeof config.board.initGridStyling === 'function'){
    // config.board.initGridStyling(config.gameContainerId);
    // }
    countdownTimer(config.timer.duration, config.timer.timerCallback);
    fitWordsIntoMatrix(list, board.matrix);
    fillWithRandomLetters(board.matrix);
  };

  function createMatrix(boardSize) {
    var matrix = new Array(boardSize.rows);
    for (var i = 0; i < boardSize.rows; i++) {
      matrix[i] = new Array(boardSize.columns);
    }
    return matrix;
  }

  function fitWordsIntoMatrix(wordList, matrix) {
    for (var i = 0; i < wordList.length; i++) {
      for (var j = 0; j < wordList[i].length; j++) {
        //removes spaces/apostrophes/the like from the word
        var trimmedWord = trimWord(wordList[i][j]);
        //tries 50 times to fit the word into the matrix
        for (var k = 0; currentWord.wordFitted == false && k < 100; k++) {
          insertWordIntoMatrix(trimmedWord, matrix);
        }
        //if the word could not be fitted
        if (currentWord.wordFitted == false) {
          //removes it from the given row of words
          wordList[i] = remove(wordList[i], wordList[i][j]);
          //decrement j so that it doesnt skip any words (since wordList because smaller)
          j--;
        }
        //otherwise, set it to false for next iteration
        else {
          currentWord.wordFitted = false;
        }
      }
    }
  }

  function insertWordIntoMatrix(word, matrix) {
    //random row and column value
    var randX = getRandomNum(matrix.length);
    var randY = getRandomNum(matrix.length);
    //if the index is empty or if the index has the value as the word's starting letter
    if (
      jQuery.isEmptyObject(matrix[randX][randY]) ||
      matrix[randX][randY] == word.charAt(0)
    ) {
      checkPossibleOrientations(word, matrix, randX, randY);
    }
  }

  function checkPossibleOrientations(w, m, x, y) {
    Object.keys(paths).forEach(function (i) {
      doesOrientationFit(w, m, x, y, paths[i]);
    });

    //if valid directions for the word were found
    if (currentWord.viablePaths.length != 0) {
      //randomly choose a path to set the word into
      var randIndex = getRandomNum(currentWord.viablePaths.length);
      var finalOrientation = currentWord.viablePaths[randIndex];

      //empty the array of possible paths
      currentWord.viablePaths = [];

      /** add the x-coordinate, y-coordinate, and the final path the word
       * will take into wordLocations (a handy reference for where all the
       * words are!)
       */
      wordLocations[w] = { x: x, y: y, p: finalOrientation };

      //finally sets the word inside the matrix!
      setWordIntoMatrix(w, m, x, y, finalOrientation);
    }
  }

  function setWordIntoMatrix(w, m, x, y, p) {
    /** initialized variables: k - for word length
     *						   x - for matrix row
     *						   y - for matrix column
     *
     * conditions: k - less than total length of word
     *			   x & y - stay within recommended bounds for orientation p
     *
     * increments: k incremented by 1,
     *			   x and y incremented by values determined for path p inside
     *			   object 'incr'
     */
    for (
      var k = 0, x, y;
      k < w.length;
      k++, x = incr[p](x, y).x, y = incr[p](x, y).y
    ) {
      m[x][y] = w.charAt(k); //sets the index as the respective character
    }

    //sets whether word is fitted or not to true
    currentWord.wordFitted = true;
  }

  /** checks if the given word fits inside the matrix with the passed in orientation
   *
   * @param {String} w word to check
   * @param {Array[]} m matrix to check against
   * @param {Number} x starting row
   * @param {Number} y starting column
   * @param {String} p orientation/path to check
   */
  function doesOrientationFit(w, m, x, y, p) {
    //how many letters fit
    var letterCount = 0;

    //variable to store word length
    var wl = w.length;

    //variable to store matrix length
    var ml = m.length;

    /** initialized variables: k - for word length
     *						   x - for matrix row
     *						   y - for matrix column
     *
     * conditions: k - less than total length of word
     *			   x & y - stay within recommended bounds for path p
     *
     * increments: k - incremented by 1,
     *			   x & y - incremented by values determined for path p inside
     *			   object 'incr'
     */
    for (
      var k = 0, x, y;
      k < wl && bounds[p](x, y, ml);
      k++, x = incr[p](x, y).x, y = incr[p](x, y).y
    ) {
      //check if index is empty or is equal to the letter being checked
      if (jQuery.isEmptyObject(m[x][y]) || m[x][y] == w.charAt(k)) {
        letterCount++;
      }
    }

    //if number of letters that can fit equal the total length of the word
    if (letterCount == wl) {
      //insert the path name into the array for viable paths
      currentWord.viablePaths.push(p);
    }
  }

  /** fills empty indices in the 2D array with randomly generated letters
   *
   * @param {Array[]} matrix
   */
  function fillWithRandomLetters(matrix) {
    //loops through rows
    for (var i = 0; i < matrix.length; i++) {
      //loops through columns
      for (var j = 0; j < matrix[i].length; j++) {
        //if empty
        if (jQuery.isEmptyObject(matrix[i][j])) {
          //set index equal to random uppercase letter
          matrix[i][j] = String.fromCharCode(65 + Math.random() * 26);
        }
      }
    }
  }

  function remove(array, indexElement) {
    return array.filter((i) => i !== indexElement);
  }

  function getRandomNum(bound) {
    return Math.floor(Math.random() * bound);
  }
  function trimWord(word) {
    return word.replace(/\W/g, "");
  }
  this.getMatrix = function () {
    return board.matrix;
  };

  this.getWordLocations = function () {
    return wordLocations;
  };
  this.getListOfWords = function () {
    return list;
  };
}
