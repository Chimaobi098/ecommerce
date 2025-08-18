import $ from "jquery";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useShoppingCart } from "../../context/shoppingCart";
import useAppAuth, { FbUser } from "../../utils/firebase";

const WordSearchGame = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({});
  const { wsgDetails, updateWSGDetails } = useShoppingCart();
  const [reward, setReward] = useState(wsgDetails.reward);
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [win, setWin] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(true);

  const { getUserFromLocalStorage, updateFieldsInFirebase } = useAppAuth();

  function getUserDetails() {
    let user = getUserFromLocalStorage();

    setUserDetails(JSON.parse(user));
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  async function gameStart() {
    let attempts = --userDetails.attemptsBalance;
    // FAIL SAFE IN CASE ATTEMPTS BALANCE EVER ENTERS NEGATIVE
    if (attempts < 0) {
      attempts = 0;
      setTimeUp(true);
    }
    setAttemptsLeft(attempts);
    await updateFieldsInFirebase(userDetails.email, {
      attemptsBalance: attempts,
    });
  }

  useEffect(() => {
    document.querySelector(".footer").style.visibility = "hidden";

    if (Object.keys(userDetails).length != 0) {
      gameStart();
      // CONFIG
      const config = {
        //function to run before game runs return boolean
        validateGamePlay: () => {
          if (userDetails.attemptsBalance < 0) {
            return false;
          }
          return true;
        },
        board: {
          boardSize: 9,
          rows: 8,
          columns: 10, //this value has to be greater than or equal to the number of rows
          initGridStyling: function (gridContainerId) {
            const gridContainer = document.querySelector(gridContainerId);
            gridContainer.style.setProperty(
              "--gridColumnSize",
              `${this.columns}`
            );
            gridContainer.style.setProperty("--gridRowSize", `${this.rows}`);
          },
        },
        gameContainerId: "#grid-container",
        listOfWords: {
          containerId: "#found-words",
          wordLength: 4,
          rowOfWords: 1,
        },
        numberOfWordsToFind: 4,
        showSolution: {
          show: false,
          solveButtonId: "#solveButton",
        },
        newGameButtonId: "#newGame",
        newGameCallback: function () {
          setTimeUp(false);
        },
        instructionsId: "instructions",
        themeId: "#wordTheme",
        timer: {
          duration: 20,
          containerId: "#timer",
          timerCallback: function () {
            $('.hint').removeClass('hint')
            revealAnswers(solutionsPositions)
            
          },
        },
        onSuccess: function () {
          setWin(true);

          stopCountdownTimer();
        },
      };
      let solutionsPositions = [[], [], [], [], [], [], [], []];
      let hintCountdown;

      function revealAnswers(answers){
        clearTimeout(hintCountdown)
        $('#grid-container').css('pointer-events', 'none')
        $('.cell').css('color', 'gray').css('transition', 'color 1s')
        answers.forEach((word, wordIndex) => {
          word.forEach((letter) => {
            let target = $(`button[row=${letter.x}][column=${letter.y}]`)
            if(target.hasClass('foundCell')){
              target.css('color', 'black')
            }
            if(!(target.hasClass('foundCell'))){
              if(wordIndex == 0){
                target.addClass('foundCell-green').css('color', 'black')
              }
              if(wordIndex == 1){
                target.addClass('foundCell-yellow').css('color', 'black')
              }
              if(wordIndex == 2){
                target.addClass('foundCell-red').css('color', 'black')
              }
              if(wordIndex == 3){
                target.addClass('foundCell-purple').css('color', 'black')
              }
            }
            
          });
        });
        setTimeout(() => {
          $('#grid-container').css('pointer-events', 'all')
          $('.cell').css('color', 'black').css('transition', 'color 0s')
          setTimeUp(true)
        }, 6000);
      }

      //   TIMER
      let countdownInterval = null;

      function countdownTimer(seconds, callback) {
        let currentSeconds = seconds;
        stopCountdownTimer();
        countdownInterval = setInterval(function () {
          document.querySelector("#timer").innerText = `0:${currentSeconds}`;
          if (currentSeconds === 0) {
            stopCountdownTimer(); // Stop the timer when it reaches 0
            if (typeof callback === "function") {
              callback();
            }
          } else {
            currentSeconds--;
          }
        }, 1000);
      }

      function stopCountdownTimer() {
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null; // Reset the interval variable
        }
      }

      //   UTILS
      var convertToUpperCase = (wordList) => {
        for (var i = 0; i < wordList.length; i++) {
          for (var j = 0; j < wordList[i].length; j++) {
            wordList[i][j] = wordList[i][j].toUpperCase();
          }
        }
      };

      function selectWorsBasedOnWordLength(wordsObject) {
        // Extract words from the object
        const allWords = Object.values(wordsObject).flatMap((theme) =>
          theme.flatMap((words) => words)
        );

        const fourLetterWords = allWords.filter(
          (word) => word.length === config.listOfWords.wordLength
        );

        return fourLetterWords;
      }

      function removeDuplicates(arr) {
        return arr.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
      }

      function getDeviceType() {
        var documentWidth = window.screen.availWidth;
        var tabletWidth = 768;
        var phoneWidth = 576;
        if (documentWidth >= tabletWidth) {
          return "Laptop";
        } else if (documentWidth >= phoneWidth) {
          return "Tablet";
        } else {
          return "Phone";
        }
      }

      //   WORDPATHS
      ("use strict");

      /** the different directions/orientations a word can flow in the word grid!
       *
       * note: vertical - left -> right
       *		 horizontal - top > bottom
       *		 primary diagonal - upper left corner -> lower right corner
       * 		 secondary diagonal - upper right corner -> lower left corner
       *
       * 'backwards' at the end of the string refers to it going the opposite direction (so
       *  bottom -> top or lower left -> upper right)
       */
      var paths = {
        vert: "vertical",
        horizon: "horizontal",
        priDiag: "primaryDiagonal",
        secDiag: "secondaryDiagonal",

        vertBack: "verticalBackwards",
        horizonBack: "horizonBackwards",
        priDiagBack: "primaryDiagonalBackwards",
        secDiagBack: "secondaryDiagonalBackwards",
      };

      /** this object sets up the matrix bounds for each orientation (just to ensure when inserting
       * a word into the board in a given path, the word doesnt exceed the size of the matrix)
       *
       * @param {Number} x row of current matrix index
       * @param {Number} y column of current matrix index
       * @param {Number} s size (width or height, either one as they should be equal) of the matrix of letters
       */
      var bounds = {
        [paths.vert]: (x, y, s) => x < s,
        [paths.horizon]: (x, y, s) => y < s,
        [paths.priDiag]: (x, y, s) => x < s && y < s,
        [paths.secDiag]: (x, y, s) => x < s && y >= 0,

        [paths.vertBack]: (x, y, s) => x >= 0,
        [paths.horizonBack]: (x, y, s) => y >= 0,
        [paths.priDiagBack]: (x, y, s) => x >= 0 && y >= 0,
        [paths.secDiagBack]: (x, y, s) => x >= 0 && y < s,
      };

      /** this object takes the given matrix row/colum and increments it in the
       * direction of the path given
       *
       * @param {Number} x matrix row to increment
       * @param {Number} y matrix column to increment
       * @return incremented x and y coordinates (by a factor of 1)
       */
      var incr = {
        [paths.vert]: (x, y) => ({ x: x + 1, y: y }),
        [paths.horizon]: (x, y) => ({ x: x, y: y + 1 }),
        [paths.priDiag]: (x, y) => ({ x: x + 1, y: y + 1 }),
        [paths.secDiag]: (x, y) => ({ x: x + 1, y: y - 1 }),

        [paths.vertBack]: (x, y) => ({ x: x - 1, y: y }),
        [paths.horizonBack]: (x, y) => ({ x: x, y: y - 1 }),
        [paths.priDiagBack]: (x, y) => ({ x: x - 1, y: y - 1 }),
        [paths.secDiagBack]: (x, y) => ({ x: x - 1, y: y + 1 }),
      };

      // WORDSEARCHCONTROLLER
      ("use strict");

      /** This object sets up the word search game, as well as button functions (for solving
       * and for refreshing/setting up a new game).
       *
       * @author Nikechukwum Ene, Ugege Daniel
       *
       * @param {String} config.gameContainerId ID of the word search game div (where the actual grid of letters goes)
       * @param {String} config.listOfWords.containerId ID of the div where the list of words to find goes
       * @param {String} config.showSolution.solveButtonId ID for button to solve the puzzle
       * @param {String} config.newGameButtonId ID for button to start a new game
       * @param {String} config.instructionsId ID for the h2 heading (to allow us to update it's text with ease)
       * @param {String} config.themeId ID for part of the h3 heading (to show the theme of the word search)
       */

      function WordSearchController() {
        //variables to store game logic and it's view
        var game;
        var view;

        //instructions to display in h2 header
        var mainInstructions =
          "Search for the list of words inside the box and click-and-drag to select them!";

        //function call to start the word search game
        setUpWordSearch();

        function setUpWordSearch() {
          var themesOfWords = Object.keys(wordsToSearch);
          var randIndex = Math.floor(Math.random() * themesOfWords.length);
          var listOfWords = wordsToSearch[themesOfWords[randIndex]];
          const flattenedArray = listOfWords.flat();
          const wordsToAddToMatrixArray = [];
          const wordsToFindArray = [];
          const decoyArray = [];
          const alphabets = ['a','b','c','d','e','f','g','q','x','z']
          const array1 = [];
          const array2 = [];
          while (array1.length + array2.length < config.numberOfWordsToFind) {
            const randomIndex = Math.floor(
              Math.random() * flattenedArray.length
            );

            const randomWord = flattenedArray.splice(randomIndex, 1)[0];
            
            if (array1.length <= array2.length) {
              array1.push(randomWord);
            } else {
              array2.push(randomWord);
            }
            if(array1.length + array2.length <= 2){
              // Pushing to decoy Array
              let validDecoyLetter = false
              let decoy = [...randomWord]

              while(!validDecoyLetter){
                const randomIndexForDecoys = Math.floor(Math.random() * alphabets.length)
                const randomLetterForDecoys = alphabets.splice(randomIndexForDecoys, 1)[0]
                if(decoy[(randomWord.length-1)] == randomLetterForDecoys){
                  // Don't include the letter
                  }else{
                    // Include the fake last letter
                    decoy[(randomWord.length-1)] = randomLetterForDecoys
                    validDecoyLetter = true
                  }
              }
              decoyArray.push(decoy.join(''))
            }
            
            }
          

          wordsToAddToMatrixArray.push(array1, array2, decoyArray);
          wordsToFindArray.push(array1,array2)
          countdownTimer(config.timer.duration, config.timer.timerCallback);
          convertToUpperCase(wordsToAddToMatrixArray);
          convertToUpperCase(wordsToFindArray);

          //sets the headings to reflect the instructions and themes
          updateHeadings(mainInstructions, themesOfWords[randIndex]);

          //generates the view of the game and sets up mouse events for clicking and dragging
          game = new WordSearchLogic(wordsToAddToMatrixArray.slice(), wordsToFindArray.slice());
          game.setUpGame();
          view =
            getDeviceType() === "Phone" || getDeviceType() === "Tablet"
              ? new WordSearchMiniView(game.getMatrix(), game.getListOfWords())
              : new WordSearchView(game.getMatrix(), game.getListOfWords());
          view.setUpView();
          getDeviceType() === "Phone" || getDeviceType() === "Tablet"
            ? view.triggerTouchDrag()
            : view.triggerMouseDrag();
        }

        /** updates the instructions (h2) and theme (h3) headings according to the given
         * text parameters
         *
         * @param {String} instructions text to set the h2 heading to
         * @param {String} theme text to set the h3 theme element to
         */
        function updateHeadings(instructions, theme) {
          $(config.instructionsId).text(instructions);
          $(config.themeId).text(theme);
        }

        /** solves the word search puzzle when the solve button is clicked
         *
         * @event WordSearchController#click
         * @param {function} function to execute on mouse click
         */
        if (config.showSolution.show) {
          $(config.showSolution.solveButtonId).click(function () {
            view.solve(game.getWordLocations(), game.getMatrix());
          });
        }

        /** empties the game and list divs and replaces them with a new setup, modelling
         * a 'refresh' effect when button is clicked
         *
         * @param {function} function to execute on mouse click to generate a new puzzle
         */
        $(config.newGameButtonId).click(function () {
          //empties the game and list elements, as well as the h3 theme span element

          $(config.gameContainerId).empty();
          $(config.listOfWords.containerId).empty();
          $(config.themeId).empty();
          if (typeof config.newGameCallback === "function") {
            config.newGameCallback();
          }
          //calls the set up to create a new word search game
          setUpWordSearch();
        });
      }

      //   WORDSEARCHLOGIC
      ("use strict");

      //object to hold common board variables
      var board = {
        matrix: [], //empty array where the matrix will go
        boardSize: {
          rows: config.board.rows,
          columns: config.board.columns,
        },
      }; //rent word being fit into matrix
      var currentWord = {
        viablePaths: [], //array of orientations the word can take
        wordFitted: false, //whether the word has been set into grid
      };

      function WordSearchLogic(list, findList) {
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
          let key = 0;
          for (var i = 0; i < wordList.length; i++) {
            for (var j = 0; j < wordList[i].length; j++) {
              //removes spaces/apostrophes/the like from the word
              var trimmedWord = trimWord(wordList[i][j]);
              //tries 50 times to fit the word into the matrix
              for (var k = 0; currentWord.wordFitted == false && k < 100; k++) {
                insertWordIntoMatrix(trimmedWord, matrix, key);
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
              key += 1;
            }
          }
        }

        function insertWordIntoMatrix(word, matrix, key) {
          //random row and column value
          var randX = getRandomNum(matrix.length);
          var randY = getRandomNum(matrix.length);
          //if the index is empty or if the index has the value as the word's starting letter
          if (
            $.isEmptyObject(matrix[randX][randY]) ||
            matrix[randX][randY] == word.charAt(0)
          ) {
            checkPossibleOrientations(word, matrix, randX, randY, key);
          }
        }

        function checkPossibleOrientations(w, m, x, y, key) {
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
            setWordIntoMatrix(w, m, x, y, finalOrientation, key);
          }
        }

        function setWordIntoMatrix(w, m, x, y, p, key) {
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
            solutionsPositions[key].push({ x: x, y: y });
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
            if ($.isEmptyObject(m[x][y]) || m[x][y] == w.charAt(k)) {
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
              if ($.isEmptyObject(matrix[i][j])) {
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
          return findList;
        };
      }

      //  WORDSEARCHMINIVIEW
      ("use strict");

      /** This object contains the necessary functions to create the 'view' of the word search,
       * which essentially refers to displaying the puzzle and handling mouse events!
       *
       * @author Nikechukwum Ene, Ugege Daniel
       *
       * @param {Array[]} matrix - 2D array containing the filled word search grid
       * @param {Array[]} list - 2D array containing the list of words in the grid
       * @param {String} config.gameContainerId - div ID for the word search container
       * @param {String} config.listOfWords.containerId - div ID for the container displaying list of words to find
       * @param {String} config.instructionsId - ID for the h2 heading, to update as necessary
       */

      /** this function encapsulates all the touch events for making a move by breaking it down
       * into three main parts: touching down (touchstart), moving (touchmove),
       * and releasing the touch (touchend)!
       */

      function WordSearchMiniView(matrix, list) {
        //variable to store if the puzzle was solved by the player or by the solve button!
        var selfSolved = true;

        //object to hold oft-used class/id/attribute names!
        var names = {
          cell: "cell",
          pivot: "pivot",
          selectable: "selectable",
          selected: "selected",
          path: "path",
        };

        //object to hold oft-used class/id selectors
        var select = {
          cells: "." + names.cell,
          pivot: "#" + names.pivot,
          selectable: "." + names.selectable,
          selected: "." + names.selected,
        };

        var searchGrid = {
          row: "row",
          column: "column",
        };

        /* creates the word search puzzle grid and the table containing the list
         * of words to find
         */
        this.setUpView = function () {
          createSearchGrid(
            matrix,
            names.cell,
            searchGrid.row,
            searchGrid.column,
            config.gameContainerId
          );
          createListOfWords(list, config.listOfWords.containerId);
        };

        /** used buttons because <td> would expand when adding border when found - stylistic purposes**/

        /** this funcion makes a 'table' of divs to store each letter in the matrix of letters
         * created in wordsearchlogic.js
         *
         * @param {Array[]} matrix
         * @param {String} cellName
         * @param {String} rowAttr
         * @param {String} colAttr
         * @param {String} boardId
         */
        function createSearchGrid(matrix, cellName, rowAttr, colAttr, boardId) {
          //loops through rows
          for (var i = 0; i < matrix.length; i++) {
            //creates a div for the table row and gives it a row class
            var row = $("<div/>");
            row.attr({ class: "boardRow" }); //only really used once, so it's not in a variable

            //loops through columns
            for (var j = 0; j < matrix[i].length; j++) {
              //each letter in the row is a button element
              var letter = $("<button/>"); //i hearbuttons are preferred for clickable actions

              letter.data("text", matrix[i][j]);

              //the letter is given a cell class, and given row and column attributes!
              letter.attr({
                class: cellName,
                [rowAttr]: i,
                [colAttr]: j,
              });

              let hideLetterChance = Math.round(Math.random()*99)
              
              if(hideLetterChance < 29){
                letter.text('?')
              }else{letter.text(matrix[i][j])}
              
            //adds letter to the larger row element
            letter.appendTo(row);
          }

            //adds the row of letters to the larger game board element
            row.appendTo($(boardId));
          }
          
          let challengeWord = Math.floor(Math.random()*3.9) // Used to randomly pick one of the 4 words to find and make the challenge word
          let secondHiddenLetter = 2 // Used to randomly pick which the second letter to hide in the challenge word

          // For each word
          solutionsPositions.forEach((word, wordKey) => {
            // For each letter in the words
            word.forEach((letter, letterIndex, arr) => {
              if(secondHiddenLetter == 3){
                secondHiddenLetter = word.length-1 // anytime secondHiddenLetter value is 3, that will represent the last letter of the word
              }
              if (wordKey == (challengeWord) && (letterIndex == 0 || letterIndex == secondHiddenLetter)) {
                $(`button[row=${letter.x}][column=${letter.y}]`).text("?");
              } 
              else {
                $(`button[row=${letter.x}][column=${letter.y}]`).text(
                  matrix[letter.x][letter.y]
                );
              }
            });
          });
        }

        hintsManagement()

        function hintsManagement(){
          clearTimeout(hintCountdown)
          let foundWords = document.querySelectorAll(".listWord.foundWord")
          if(foundWords.length > 0 && foundWords.length < 3){
            
              $('.hint').removeClass('hint')
              let controller = true
              hintCountdown = setTimeout(() => {
                solutionsPositions.forEach((word, wordIndex) => {
                  if(controller){
                    word.forEach((letter) => {
                      let target = $(`button[row=${letter.x}][column=${letter.y}]`)              
                      if(!(target.hasClass('foundCell')) && wordIndex < 4){
                        target.addClass('hint')
                          setTimeout(() => {
                            target.removeClass('hint')
                          }, 5000);
                          controller = false
                      }
                    });
                  }
                });
              }, 5*1000)
          }
          else{
            let first = Math.floor(Math.random()*4)
              let second = Math.floor(Math.random()*4)
              hintCountdown = setTimeout(() => {
                solutionsPositions.forEach((word, wordIndex) => {
                  word.forEach((letter) => {
                    let target = $(`button[row=${letter.x}][column=${letter.y}]`)              
                      if(wordIndex == first){
                        target.addClass('hint')
                      }
                      if(wordIndex == second){
                        target.addClass('hint')
                      }
                      setTimeout(() => {
                        target.removeClass('hint')
                      }, 5000);
                  });
                });
              }, 10*1000);
          }
        }
        
        /** This function creates a table-type object to insert all the words
         * contained in the word search puzzle! players refer to this table
         * when looking for words to find
         *
         * @param {Array[]} wordList a matrix of words to insert into list container
         * @param {String} wordListId the ID of the container!
         */
        function createListOfWords(wordList, wordListId) {
          // Clear existing content of the container
          $(wordListId).empty();

          // Loop through rows
          // Create a div for the row
          var row = $("<div/>");
          row.attr({ class: "listRow" }); // Give the rows a list row class
          for (var i = 0; i < wordList.length; i++) {
            // Loop through columns (words in the row)
            for (var j = 0; j < wordList[i].length; j++) {
              var word = $("<span/>");

              // Check if the word is not empty
              if (wordList[i][j]) {
                // Give the word a class and set its text
                word.attr({
                  class: "listWord",
                  text: wordList[i][j].replace(/\W/g, ""),
                });

                // Set the text of the word
                word.text(wordList[i][j]);

                // Add the word to the row
                word.appendTo(row);
              }
            }

            // Add the row of words to the larger word list div
            row.appendTo($(wordListId));
          }
        }

        this.solve = function (wordLoc, matrix) {
          /** converts the object into an array and loops through each index to find
           * the word with the coordinates/orientation properties, setting the words to found!
           *
           * @param {String} word - the (trimmed) word placed in the puzzle
           */
          Object.keys(wordLoc).forEach(function (word) {
            //path of the word
            var p = wordLoc[word].p;

            //the x and y value the word starts from
            var startX = wordLoc[word].x;
            var startY = wordLoc[word].y;

            /** initialized variables: k - for word length
             *						   x - for starting x/row
             *						   y - for starting y/column
             *
             * conditions: k - less than total length of word
             *
             * increments: k - incremented by 1,
             *			   x & y - incremented by x & y functions for path p inside
             *			   object 'incr'
             */
            for (
              var k = 0, x = startX, y = startY;
              k < word.length;
              k++, x = incr[p](x, y).x, y = incr[p](x, y).y
            ) {
              //finds the puzzle cell with the respective x and y value and sets it as found
              $(
                select.cells + "[row = " + x + "][column = " + y + "]"
              ).addClass("found");
            }

            //set to false since the program solved it for the player
            selfSolved = false;

            //checks if valid word made (which it was)
            validWordMade(list, word, config.instructionsId);
          });
        };

        this.triggerTouchDrag = function () {
          // Empty array to store the selected cells in a move
          var selectedLetters = [];

          // Empty string to store the word made by a move
          var wordMade = "";

          // Variable to store if the touch is active
          var touchIsActive = false;

          // Function to handle the touchstart event
          function handleTouchStart(event) {
            // Prevent default touch behavior
            event.preventDefault();

            // Get the touch coordinates
            var touchX = event.touches[0].clientX;
            var touchY = event.touches[0].clientY;

            // Get the cell element under the touch coordinates
            var touchedCell = document.elementFromPoint(touchX, touchY);

            // Ensure that the touched element is a valid cell
            if (touchedCell && touchedCell.classList.contains(names.cell)) {
              // Set touch as active
              touchIsActive = true;

              // Select the touched cell
              touchedCell.classList.add(names.selected);

              // Set the touched cell as the pivot
              touchedCell.id = names.pivot;

              // Highlight valid directions
              highlightValidDirections(
                $(touchedCell),
                matrix,
                names.selectable
              );
            }
          }

          // Function to handle the touchmove event
          function handleTouchMove(event) {
            // Prevent default touch behavior
            event.preventDefault();

            // Check if touch is active
            if (touchIsActive) {
              // Get the touch coordinates
              var touchX = event.touches[0].clientX;
              var touchY = event.touches[0].clientY;

              // Get the cell element under the touch coordinates
              var touchedCell = document.elementFromPoint(touchX, touchY);

              // Ensure that the touched element is a valid cell and selectable
              if (
                touchedCell &&
                touchedCell.classList.contains(names.selectable)
              ) {
                // Clear previous selection
                selectedLetters.forEach(function (cell) {
                  if (cell && cell[0].classList.contains(names.selected)) {
                    cell[0].classList.remove(names.selected);
                  }
                });
                selectedLetters = [];

                // Reset word made
                wordMade = "";

                // Select range of cells
                var cells = selectCellRange(
                  select.cells,
                  $(touchedCell),
                  names.path,
                  touchedCell.getAttribute(names.path),
                  selectedLetters,
                  wordMade
                );

                wordMade = cells.word;
                selectedLetters = cells.array;
              }
            }
          }

          // Function to handle the touchend event
          function handleTouchEnd(event) {
            // Prevent default touch behavior
            event.preventDefault();

            // Check if touch was active
            if (touchIsActive) {
              // Set touch as inactive
              touchIsActive = false;

              // End the touch move
              endTouch();
            }
          }

          /* highlights all the valid directions in the matrix from where mouse is first clicked, like
           * top -> bottom, left -> right, and both diagonals!
           *
           * @param {jQuery} selectedCell - DOM element the mouse pressed down on (a cell in the word search puzzle!)
           * @param {Array[]} matrix - the puzzle 2D array
           * @param {String} makeSelectable - selector to make an element selectable
           */
          function highlightValidDirections(
            selectedCell,
            matrix,
            makeSelectable
          ) {
            //gets the row and column of where the cell the mouse pressed on is
            var cellRow = parseInt(selectedCell.attr(searchGrid.row));
            var cellCol = parseInt(selectedCell.attr(searchGrid.column));

            //converts the global paths object into an array
            Object.keys(paths).forEach(function (path) {
              //path - each property's name (e.g. 'vert', 'priDiagBack')

              //makes each cell in each of the paths selectable
              makeRangeSelectable(
                cellRow,
                cellCol,
                matrix.length,
                paths[path],
                makeSelectable
              );
            });
          }
          function makeRangeSelectable(x, y, l, p, selectable) {
            /** initialized variables: x - starting row, incremented to exclude the pivot
             *						   y - starting column, incremented to exclude the pivot
             *
             * condition: x & y to stay within recommended bounds for path p
             *			  (determined by object bounds)
             *
             * increments: x & y - incremented by function determined for path p (by
             *			   object 'incr')
             */
            for (
              var i = incr[p](x, y).x, j = incr[p](x, y).y; //initialized variables
              bounds[p](i, j, l); //condition
              i = incr[p](i, j).x, j = incr[p](i, j).y
            ) {
              //increments

              //select the specific DOM elements with the specific row/column attribute values
              $(
                "[" +
                  searchGrid.row +
                  "= " +
                  i +
                  "][" +
                  searchGrid.column +
                  "= " +
                  j +
                  "]"
              )
                .addClass(selectable) //makes it selectable
                .attr({ [names.path]: p }); //gives it a path attribute with the value of p
            }
          }

          // Add touch event listeners to the game container
          document
            .querySelector(config.gameContainerId)
            .addEventListener("touchstart", handleTouchStart);
          document
            .querySelector(config.gameContainerId)
            .addEventListener("touchmove", handleTouchMove);
          document
            .querySelector(config.gameContainerId)
            .addEventListener("touchend", handleTouchEnd);

          $(select.cells).mouseup(function () {
            endTouch();
          });

          // Function to end touch movement
          function endTouch() {
            // Check if a valid word was made
            //checks if a word on the list was selected
            if (validWordMade(list, wordMade, config.instructionsId)) {
              // alert('endTouch')
              $(select.selected).addClass("foundCell");
              // document.querySelectorAll(".foundCell").forEach((foundCell) => {
              //   foundCell.style.backgroundColor = "#6D7CFF";
              // });
            }

            setTimeout(() => {
              $(select.selected).removeClass(names.selected);
            }, 300);

            //removes the direction attributes of any cells (prevents strange behavior)
            $(select.cells).removeAttr(names.path);

            //removes the pivot's ID so a new pivot can be selected
            $(select.pivot).removeAttr("id");

            //remove selectability of selectable cells
            $(select.selectable).removeClass(names.selectable);

            //empties the word string and selected cells' array
            wordMade = "";
            selectedLetters = [];
          }
          function selectCellRange(
            cellsSelector,
            hoveredCell,
            pathAttr,
            path,
            selectedCells,
            wordConstructed
          ) {
            //variable to hold index of cell hovered on
            var hoverIndex;

            //variable to hold index of pivot
            var pivotIndex;

            //selector for cells in the particular path the mouse is on
            var cellRange = cellsSelector + "[" + pathAttr + " =" + path + "]";

            //setting indices depending on how the paths flow
            switch (path) {
              case paths.vert:
              case paths.horizon:
              case paths.priDiag:
              case paths.secDiag:
                //hoverIndex > pivotIndex
                hoverIndex = hoveredCell.index(cellRange) + 1;
                pivotIndex = 0;

                //sets up wordConstructed with the pivot's letter (to start it off)
                wordConstructed = $(select.pivot).data("text");

                //using the pivot text, selects cells and adds their text to wordConstructed
                wordConstructed = selectLetters(
                  selectedCells,
                  wordConstructed,
                  cellRange,
                  pivotIndex,
                  hoverIndex
                );

                break;

              case paths.vertBack:
              case paths.horizonBack:
              case paths.priDiagBack:
              case paths.secDiagBack:
                //hoverIndex < pivotIndex
                hoverIndex = hoveredCell.index(cellRange);
                pivotIndex = $(cellRange).length;

                //selects range of cells between the pivot and the cell the mouse is on
                wordConstructed += selectLetters(
                  selectedCells,
                  wordConstructed,
                  cellRange,
                  hoverIndex,
                  pivotIndex
                );
                // legitto
                //adds pivot text to the end
                wordConstructed += $(select.pivot).data("text");

                break;
            }

            return { word: wordConstructed, array: selectedCells };
          }

          /** this function selects the range of cells between the pivot cell and the
           * the cell the mouse is hovered, and adds their text to the constructed word's string
           *
           * @param {Array} selectedCells - array to hold
           * @param {String} wordConstructed - word being created by user
           * @param {String} range - the path on which to select cells
           * @param {Number} lowerIndex - index of the lower cell
           * @param {Number} upperIndex - index of the higher cell
           * @return returns the word made during the selection process!
           */
          function selectLetters(
            selectedCells,
            wordConstructed,
            range,
            lowerIndex,
            upperIndex
          ) {
            //only goes through the the range between the pivot and wherever the mouse is on the path!
            $(range)
              .slice(lowerIndex, upperIndex)
              .each(function () {
                //selects the cell
                $(this).addClass(names.selected);

                //adds it to the array of cells
                selectedCells.push($(this));

                //updates the word being made to include the newest cell's letter
                wordConstructed += $(this).data("text");
              });

            return wordConstructed;
          }

          /** checks if the word a user made after a move is an actual word to find, and
           * if so, sets the word as found! otherwise, nothing happens (so the move is
           * essentially ignored)
           *
           * @param {Array[]} wordList - matrix of words in the grid
           * @param {String} wordToCheck - word to check for validity
           * @param {String} config.instructionsId - selector for the h2 heading
           * @return true if the word made is a word in the list
           */
          function validWordMade(list, wordToCheck) {
            //loops through rows
            for (var i = 0; i < list.length; i++) {
              //loops through columns
              for (var j = 0; j < list[i].length; j++) {
                //trims the word at the index (to make comparison easier)
                var trimmedWord = list[i][j].replace(/\W/g, "");

                //if the word user made is the same as the trimmed word, or the reverse of it
                if (
                  wordToCheck == trimmedWord ||
                  wordToCheck == reversedWord(trimmedWord)
                ) {
                  //sets the word inside the list div as found (changes color, strikethroughs text)
                  $(".listWord[text = " + trimmedWord + "]").addClass(
                    "foundWord"
                  );

                  //checks if the last word to find was found
                  checkPuzzleSolved(".listWord", ".listWord.foundWord");
                  //hint system
                  hintsManagement(".listWord.foundWord")
                  return true;
                }
              }
            }
          }

          /** checks if all the words in the puzzle have been found, what method was used to
           * solve the puzzle, and updates the h2 instructions heading accordingly
           *
           * @param {String} fullList - selector for words in the wordlist div
           * @param {String} foundWordsList - selector found words in the wordlist div
           * @param {String} config.instructionsId - selector for h2 instructions heading
           * @return true if the entire word search has been solved
           */
          function checkPuzzleSolved(fullList, foundWordsList) {
            //if all the words in the list to find have been found (no. of words to find == no. of found words)
            if (
              document.querySelectorAll(fullList).length ==
              document.querySelectorAll(foundWordsList).length
            ) {
              //if user solved the puzzle themselves
              if (selfSolved) {
                console.log("Solved");
                config.onSuccess();
              } else {
                console.log("You clicked the auto solve button");
              }

              return true;
            }

            return false;
          }

          /** reverses a string! (e.g. 'muscat' becomes 'tacsum')
           *
           * @param {String} word - word to reverse
           * @return the reversed word
           */
          function reversedWord(word) {
            //creates empty string to store reversed word
            var reversedWord = "";

            //loops through from end of word to the beginning (instead of traditional beginning to end)
            for (var i = word.length - 1; i >= 0; i--) {
              //adds the character to reversed word
              reversedWord += word.charAt(i);
            }

            return reversedWord;
          }
        };
      }

      //   VIEW
      ("use strict");

      /** This object contains the necessary functions to create the 'view' of the word search,
       * which essentially refers to displaying the puzzle and handling mouse events!
       *
       * @author Nikechukwum Ene, Ugege Daniel
       *
       * @param {Array[]} matrix - 2D array containing the filled word search grid
       * @param {Array[]} list - 2D array containing the list of words in the grid
       * @param {String} config.gameContainerId - div ID for the word search container
       * @param {String} config.listOfWords.containerId - div ID for the container displaying list of words to find
       * @param {String} config.instructionsId - ID for the h2 heading, to update as necessary
       */

      function WordSearchView(matrix, list) {
        //variable to store if the puzzle was solved by the player or by the solve button!
        var selfSolved = true;

        //object to hold oft-used class/id/attribute names!
        var names = {
          cell: "cell",
          pivot: "pivot",
          selectable: "selectable",
          selected: "selected",
          path: "path",
        };

        //object to hold oft-used class/id selectors
        var select = {
          cells: "." + names.cell,
          pivot: "#" + names.pivot,
          selectable: "." + names.selectable,
          selected: "." + names.selected,
        };

        var searchGrid = {
          row: "row",
          column: "column",
        };

        /* creates the word search puzzle grid and the table containing the list
         * of words to find
         */
        this.setUpView = function () {
          createSearchGrid(
            matrix,
            names.cell,
            searchGrid.row,
            searchGrid.column,
            config.gameContainerId
          );
          createListOfWords(list, config.listOfWords.containerId);
        };

        /** used buttons because <td> would expand when adding border when found - stylistic purposes**/

        /** this funcion makes a 'table' of divs to store each letter in the matrix of letters
         * created in wordsearchlogic.js
         *
         * @param {Array[]} matrix
         * @param {String} cellName
         * @param {String} rowAttr
         * @param {String} colAttr
         * @param {String} boardId
         */
        function createSearchGrid(matrix, cellName, rowAttr, colAttr, boardId) {
          //loops through rows
          for (var i = 0; i < matrix.length; i++) {
            //creates a div for the table row and gives it a row class
            var row = $("<div/>");
            row.attr({ class: "boardRow" }); //only really used once, so it's not in a variable

            //loops through columns
            for (var j = 0; j < matrix[i].length; j++) {
              //each letter in the row is a button element
              var letter = $("<button/>"); //i hearbuttons are preferred for clickable actions

              //the letter is given a cell class, and given row and column attributes!
              letter
                .attr({
                  class: cellName,
                  [rowAttr]: i,
                  [colAttr]: j,
                })
                .text(matrix[i][j]); //sets text of button to the respective matrix index

              //adds letter to the larger row element
              letter.appendTo(row);
            }

            //adds the row of letters to the larger game board element
            row.appendTo($(boardId));
          }
        }

        /** This function creates a table-type object to insert all the words
         * contained in the word search puzzle! players refer to this table
         * when looking for words to find
         *
         * @param {Array[]} wordList a matrix of words to insert into list container
         * @param {String} wordListId the ID of the container!
         */
        function createListOfWords(wordList, wordListId) {
          // Clear existing content of the container
          $(wordListId).empty();

          // Loop through rows
          // Create a div for the row
          var row = $("<div/>");
          row.attr({ class: "listRow" }); // Give the rows a list row class
          for (var i = 0; i < wordList.length; i++) {
            // Loop through columns (words in the row)
            for (var j = 0; j < wordList[i].length; j++) {
              var word = $("<span/>");

              // Check if the word is not empty
              if (wordList[i][j]) {
                // Give the word a class and set its text
                word.attr({
                  class: "listWord",
                  text: wordList[i][j].replace(/\W/g, ""),
                });

                // Set the text of the word
                word.text(wordList[i][j]);

                // Add the word to the row
                word.appendTo(row);
              }
            }

            // Add the row of words to the larger word list div
            row.appendTo($(wordListId));
          }
        }

        /** this function solves the puzzle for the player!
         *
         * @param {Object} loc an object containing the locations of all the words to find in the puzzle!
         * @param {Array[]} matrix the grid in which the words are placed in!
         */
        this.solve = function (wordLoc, matrix) {
          /** converts the object into an array and loops through each index to find
           * the word with the coordinates/orientation properties, setting the words to found!
           *
           * @param {String} word - the (trimmed) word placed in the puzzle
           */
          Object.keys(wordLoc).forEach(function (word) {
            //path of the word
            var p = wordLoc[word].p;

            //the x and y value the word starts from
            var startX = wordLoc[word].x;
            var startY = wordLoc[word].y;

            /** initialized variables: k - for word length
             *						   x - for starting x/row
             *						   y - for starting y/column
             *
             * conditions: k - less than total length of word
             *
             * increments: k - incremented by 1,
             *			   x & y - incremented by x & y functions for path p inside
             *			   object 'incr'
             */
            for (
              var k = 0, x = startX, y = startY;
              k < word.length;
              k++, x = incr[p](x, y).x, y = incr[p](x, y).y
            ) {
              //finds the puzzle cell with the respective x and y value and sets it as found
              $(
                select.cells + "[row = " + x + "][column = " + y + "]"
              ).addClass("found");
            }

            //set to false since the program solved it for the player
            selfSolved = false;

            //checks if valid word made (which it was)
            validWordMade(list, word, config.instructionsId);
          });
        };

        /** this function encapsulates all the mouse events for making a move by breaking it down
         * into three main parts: pressing the mouse down (mousedown), dragging it (mouseenter),
         * and finally releasing the mouse (mouseup)!
         */
        this.triggerMouseDrag = function () {
          //empty array to store the selected cells in a move
          var selectedLetters = [];

          // //empty string to store the word made by a
          var wordMade = "";

          //variable to store if the mouse is down
          var mouseIsDown = false;

          /** executes when the mouse is pressed down on a letter in the
           * search grid
           */
          $(select.cells).mousedown(function () {
            //sets true that mouse is down
            mouseIsDown = true;

            //selects the pressed cell
            $(this).addClass(names.selected);

            //sets the pressed cell to be the 'pivot' of the move
            $(this).attr({ id: names.pivot });

            //highlights all the possible paths the user may go to select more letters
            highlightValidDirections($(this), matrix, names.selectable);
          });

          /** this code executes when the mouse is down and the user starts moving their
           * mouse inside the puzzle container!
           */
          $(select.cells).mouseenter(function () {
            //ensures the mouse is down and the cell the mouse is on is on a valid path
            if (mouseIsDown && $(this).hasClass(names.selectable)) {
              //holds the direction of the path the mouse is currently on
              var currentDirection = $(this).attr(names.path);

              //unselects selected cells
              for (var i = 0; i < selectedLetters.length; i++) {
                selectedLetters[i].removeClass(names.selected);
              }

              //empties the array of selected letters
              selectedLetters = [];

              //empties string of the word being constructed
              wordMade = "";

              //resets the range of cells to select
              var cells = selectCellRange(
                select.cells,
                $(this),
                names.path,
                currentDirection,
                selectedLetters,
                wordMade
              );

              wordMade = cells.word;
              selectedLetters = cells.array;
            }
          });

          /** this code calls the endMove function when the mouse is released - it mostly checks
           * the word made and whether it's a word to be found, as well as resetting variables
           * to allow another move
           */
          $(select.cells).mouseup(function () {
            endMove();
          });

          /** if the user is playing the game and moves their mouse out of the word grid, this function
           * makes it so that the move automatically ends - this makes pressing the mouse down and
           * accidentally/purposely leaving the board less annoying to deal with!
           */
          $(config.gameContainerId).mouseleave(function () {
            if (mouseIsDown) {
              //checks that the user is indeed pressing their mouse down (therefore, playing)

              endMove();
            }
          });

          /** this function handles everything ending a move should consist of - resetting variables
           * for a new move and checking if a proper word to find has been made
           */
          function endMove() {
            //sets mouse down as false since the mouse is now up
            mouseIsDown = false;

            //checks if a word on the list was selected
            if (validWordMade(list, wordMade, config.instructionsId)) {
              // alert('endmove')
              $(select.selected).addClass("foundCell");
              document.querySelectorAll(".foundCell").forEach((foundCell) => {
                foundCell.style.backgroundColor = "#6D7CFF";
              });
            }

            //unselects any selected letters
            $(select.selected).removeClass(names.selected);

            //removes the direction attributes of any cells (prevents strange behavior)
            $(select.cells).removeAttr(names.path);

            //removes the pivot's ID so a new pivot can be selected
            $(select.pivot).removeAttr("id");

            //remove selectability of selectable cells
            $(select.selectable).removeClass(names.selectable);

            //empties the word string and selected cells' array
            wordMade = "";
            selectedLetters = [];
          }
        };

        /* highlights all the valid directions in the matrix from where mouse is first clicked, like
         * top -> bottom, left -> right, and both diagonals!
         *
         * @param {jQuery} selectedCell - DOM element the mouse pressed down on (a cell in the word search puzzle!)
         * @param {Array[]} matrix - the puzzle 2D array
         * @param {String} makeSelectable - selector to make an element selectable
         */
        function highlightValidDirections(
          selectedCell,
          matrix,
          makeSelectable
        ) {
          //gets the row and column of where the cell the mouse pressed on is
          var cellRow = parseInt(selectedCell.attr(searchGrid.row));
          var cellCol = parseInt(selectedCell.attr(searchGrid.column));

          //converts the global paths object into an array
          Object.keys(paths).forEach(function (path) {
            //path - each property's name (e.g. 'vert', 'priDiagBack')

            //makes each cell in each of the paths selectable
            makeRangeSelectable(
              cellRow,
              cellCol,
              matrix.length,
              paths[path],
              makeSelectable
            );
          });
        }

        /** this functions makes a given path selectable but giving each cell in the path a 'selectable' class!
         * this makes it so that the player can only select cells on specific paths (which makes selecting vertically,
         * horizontally, and diagonally much less of a hassle!)
         *
         * @param {Number} x - starting x-coordinate/row of the path
         * @param {Number} y - starting y-coordinate/column of the path
         * @param {Number} l - length/size of the matrix
         * @param {String} p - name of the path (e.g. vertical, primaryDiagonalBackwards)
         * @param {String} selectable - selector to make a DOM element selectable
         */
        function makeRangeSelectable(x, y, l, p, selectable) {
          /** initialized variables: x - starting row, incremented to exclude the pivot
           *						   y - starting column, incremented to exclude the pivot
           *
           * condition: x & y to stay within recommended bounds for path p
           *			  (determined by object bounds)
           *
           * increments: x & y - incremented by function determined for path p (by
           *			   object 'incr')
           */
          for (
            var i = incr[p](x, y).x, j = incr[p](x, y).y; //initialized variables
            bounds[p](i, j, l); //condition
            i = incr[p](i, j).x, j = incr[p](i, j).y
          ) {
            //increments

            //select the specific DOM elements with the specific row/column attribute values
            $(
              "[" +
                searchGrid.row +
                "= " +
                i +
                "][" +
                searchGrid.column +
                "= " +
                j +
                "]"
            )
              .addClass(selectable) //makes it selectable
              .attr({ [names.path]: p }); //gives it a path attribute with the value of p
          }
        }

        /** this function finds and selects the range of cells from the pivot (first selected cell) to
         * the cell the mouse is currenty hovering on, altogether going from end to end on the puzzle
         * matrix
         *
         * @param {String} cellsSelector - selector name for cells in the search grid
         * @param {Array} selectedCells
         * @param {jQuery} hoveredCell - cell the mouse is hovering on
         * @param {String} pathAttr - path/direction attribute
         * @param {String} path - value of the path attribute
         * @param {String} wordConstructed - word user makes by dragging around on the puzzle
         * @return returns an object containing: the word constructed and the array of selected DOM cells!
         */
        function selectCellRange(
          cellsSelector,
          hoveredCell,
          pathAttr,
          path,
          selectedCells,
          wordConstructed
        ) {
          //variable to hold index of cell hovered on
          var hoverIndex;

          //variable to hold index of pivot
          var pivotIndex;

          //selector for cells in the particular path the mouse is on
          var cellRange = cellsSelector + "[" + pathAttr + " =" + path + "]";

          //setting indices depending on how the paths flow
          switch (path) {
            case paths.vert:
            case paths.horizon:
            case paths.priDiag:
            case paths.secDiag:
              //hoverIndex > pivotIndex
              hoverIndex = hoveredCell.index(cellRange) + 1;
              pivotIndex = 0;

              //sets up wordConstructed with the pivot's letter (to start it off)
              wordConstructed = $(select.pivot).text();

              //using the pivot text, selects cells and adds their text to wordConstructed
              wordConstructed = selectLetters(
                selectedCells,
                wordConstructed,
                cellRange,
                pivotIndex,
                hoverIndex
              );

              break;

            case paths.vertBack:
            case paths.horizonBack:
            case paths.priDiagBack:
            case paths.secDiagBack:
              //hoverIndex < pivotIndex
              hoverIndex = hoveredCell.index(cellRange);
              pivotIndex = $(cellRange).length;

              //selects range of cells between the pivot and the cell the mouse is on
              wordConstructed += selectLetters(
                selectedCells,
                wordConstructed,
                cellRange,
                hoverIndex,
                pivotIndex
              );

              //adds pivot text to the end
              wordConstructed += $(select.pivot).text();

              break;
          }

          return { word: wordConstructed, array: selectedCells };
        }

        /** this function selects the range of cells between the pivot cell and the
         * the cell the mouse is hovered, and adds their text to the constructed word's string
         *
         * @param {Array} selectedCells - array to hold
         * @param {String} wordConstructed - word being created by user
         * @param {String} range - the path on which to select cells
         * @param {Number} lowerIndex - index of the lower cell
         * @param {Number} upperIndex - index of the higher cell
         * @return returns the word made during the selection process!
         */
        function selectLetters(
          selectedCells,
          wordConstructed,
          range,
          lowerIndex,
          upperIndex
        ) {
          //only goes through the the range between the pivot and wherever the mouse is on the path!
          $(range)
            .slice(lowerIndex, upperIndex)
            .each(function () {
              //selects the cell
              $(this).addClass(names.selected);

              //adds it to the array of cells
              selectedCells.push($(this));

              //updates the word being made to include the newest cell's letter
              wordConstructed += $(this).text();
            });

          return wordConstructed;
        }

        /** checks if the word a user made after a move is an actual word to find, and
         * if so, sets the word as found! otherwise, nothing happens (so the move is
         * essentially ignored)
         *
         * @param {Array[]} wordList - matrix of words in the grid
         * @param {String} wordToCheck - word to check for validity
         * @param {String} config.instructionsId - selector for the h2 heading
         * @return true if the word made is a word in the list
         */
        function validWordMade(list, wordToCheck) {
          //loops through rows
          for (var i = 0; i < list.length; i++) {
            //loops through columns
            for (var j = 0; j < list[i].length; j++) {
              //trims the word at the index (to make comparison easier)
              var trimmedWord = list[i][j].replace(/\W/g, "");

              //if the word user made is the same as the trimmed word, or the reverse of it
              if (
                wordToCheck == trimmedWord ||
                wordToCheck == reversedWord(trimmedWord)
              ) {
                //sets the word inside the list div as found (changes color, strikethroughs text)
                $(".listWord[text = " + trimmedWord + "]").addClass(
                  "foundWord"
                );

                //checks if the last word to find was found
                checkPuzzleSolved(
                  ".listWord",
                  ".listWord.found",
                  config.instructionsId
                );

                return true;
              }
            }
          }
        }

        /** checks if all the words in the puzzle have been found, what method was used to
         * solve the puzzle, and updates the h2 instructions heading accordingly
         *
         * @param {String} fullList - selector for words in the wordlist div
         * @param {String} foundWordsList - selector found words in the wordlist div
         * @param {String} config.instructionsId - selector for h2 instructions heading
         * @return true if the entire word search has been solved
         */
        function checkPuzzleSolved(fullList, foundWordsList) {
          //if all the words in the list to find have been found (no. of words to find == no. of found words)
          if ($(fullList).length == $(foundWordsList).length) {
            //if user solved the puzzle themselves
            if (selfSolved) {
              config.onSuccess();
            } else {
              console.log("You clicked the auto solve button");
            }

            return true;
          }

          return false;
        }

        /** reverses a string! (e.g. 'muscat' becomes 'tacsum')
         *
         * @param {String} word - word to reverse
         * @return the reversed word
         */
        function reversedWord(word) {
          //creates empty string to store reversed word
          var reversedWord = "";

          //loops through from end of word to the beginning (instead of traditional beginning to end)
          for (var i = word.length - 1; i >= 0; i--) {
            //adds the character to reversed word
            reversedWord += word.charAt(i);
          }

          return reversedWord;
        }
      }

      //   WORDSTOSEARCH
      var wordsToSearch = {
        "Nature's Nook": [
          ["tree", "leaf", "bush", "fern", "vine"],
          ["oak", "pine", "moss", "weed", "rose"],
        ],
        "Sunny Meadows": [
          ["sun", "rose", "grass", "bird", "lake"],
          ["warm", "hike", "calm", "pond", "seed"],
        ],
        "Oceanic Oasis": [
          ["wave", "surf", "fish", "reef", "sand"],
          ["blue", "tide", "dive", "ship", "swim"],
        ],
        "Mountain Majesty": [
          ["peak", "rock", "snow", "view", "claw"],
          ["high", "hill", "cold", "hike", "alps"],
        ],
        "Desert Delight": [
          ["sand", "heat", "dune", "oasis", "palm"],
          ["warm", "arid", "dry", "cool", "cacti"],
        ],
        "Polar Paradise": [
          ["ice", "snow", "seal", "cold", "bear"],
          ["puff", "sled", "seal", "seal", "seal"],
        ],
        "Forest Fantasy": [
          ["tree", "leaf", "bird", "bear", "deer"],
          ["wild", "tall", "deep", "dark", "home"],
        ],
        "Tropical Treasures": [
          ["palm", "rain", "heat", "bird", "frog"],
          ["warm", "tide", "trop", "leaf", "toad"],
        ],
        "River Retreat": [
          ["flow", "bank", "fish", "frog", "duck"],
          ["rush", "cool", "deep", "calm", "raft"],
        ],
        "Jungle Jamboree": [
          ["vine", "frog", "leaf", "bug", "bird"],
          ["wild", "deep", "green", "loud", "home"],
        ],
        "Savannah Serenity": [
          ["grass", "lion", "zebra", "tree", "heat"],
          ["warm", "wild", "dry", "deep", "home"],
        ],
        "Mystic Marsh": [
          ["mud", "frog", "bird", "reel", "lily"],
          ["deep", "tall", "dark", "wild", "leaf"],
        ],
        "Alpine Aura": [
          ["snow", "peak", "bear", "goat", "cold"],
          ["high", "tall", "deep", "wild", "home"],
        ],
        "Urban Eden": [
          ["park", "tree", "bird", "home", "city"],
          ["deep", "wild", "tall", "loud", "warm"],
        ],
        "Arctic Ambiance": [
          ["cold", "snow", "bear", "seal", "ice"],
          ["deep", "tall", "wild", "home", "puff"],
        ],
      };

      if (config.validateGamePlay()) {
        // const attemptBalanceDisplay =
        //   document.querySelector("#attempts-balance");
        // const walletBalanceDisplay =
        //   document.querySelector("#wallet-balance");
        // attemptBalanceDisplay.innerText = `${userDetails.attemptsBalance}`;
        // walletBalanceDisplay.innerText = `₦${userDetails.walletBalance}`;
        new WordSearchController();
      }
    }
  }, [resetTrigger, userDetails]);

  useEffect(() => {
    if (win || timeUp) {
      // gameOver();
    }
  }, [win, timeUp]);

  async function gameOver() {
    if (win) {
      let gameWalletIncrement = userDetails.gameWalletBalance + reward;
      await updateFieldsInFirebase(userDetails.email, {
        gameWalletBalance: gameWalletIncrement,
      });
    } else if (timeUp) {
      let lossUpdate = ++userDetails.lossAttempts;
      await updateFieldsInFirebase(userDetails.email, {
        lossAttempts: lossUpdate,
      });
    }
  }

  return (
    <>
      {(timeUp || win) && (
        <div id="wsg-overlay">
          <div id="wsg-card" className="wsg-flex w-[90%] lg:w-[60%]">
            <div className="wsg-flexCol wsg-vertical-centre">
              <h1 id="win-lose" className="text-[30px]">
                {attemptsLeft != 0
                  ? win
                    ? "You Win 🎉"
                    : "You Lose 😢"
                  : "Game Over"}
              </h1>
              <div className=" balance attempts-balance">
                You have {attemptsLeft != 0 ? attemptsLeft : "used up all "}{" "}
                attempts left
              </div>

              <div className=" balance wallet-balance">
                Your game wallet balance is ₦{userDetails.gameWalletBalance}
                {win ? " + ₦" + reward : ""}
              </div>

              {/* <button className="wsg-button btn-lg" id="buyMore">Buy More Attempts</button> */}
              {attemptsLeft != 0 && (
                <button
                  className="wsg-button btn-lg"
                  id="newGame"
                  onClick={() => {
                    setTimeUp(false),
                      setResetTrigger(!resetTrigger),
                      setWin(false),
                      getUserDetails(),
                      $("#grid-container").empty();
                    $("#found-words").empty();
                    $("#wordTheme").empty();
                  }}
                >
                  Try again
                </button>
              )}
              <button
                className="wsg-button btn-lg sec-button"
                id="home"
                onClick={() => {
                  router.back(),
                    (document.querySelector(".footer").style.visibility =
                      "visible");
                }}
              >
                Back to Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="game wsg-flexCol">
        <div className="wsg-flexCol">
          <h2
            className="text-[3rem] text-[orange] text-center mt-[2rem]"
            id="selected-letters"
          >
            Word Search
          </h2>
          <div className="wsg-flex mt-[10px]">
            <div className="wsg-flexCol game-control text-center">
              <div className="h-[45px] flex items-center">
                Attempts Remaining
              </div>
              <div id="attempts-balance" className="play-info">
                {attemptsLeft}
              </div>
            </div>
            <div className="wsg-flexCol game-control text-center">
              <div className="h-[45px] flex items-center">Game Wallet</div>
              <div id="wallet-balance" className="play-info">
                ₦ {userDetails.gameWalletBalance}
              </div>
            </div>
            <div className="wsg-flexCol game-control text-center">
              <div className="h-[45px] flex items-center">Timer</div>
              <div id="timer" className="play-info">
                ---
              </div>
            </div>
          </div>
          <div id="found-words" className="mt-[20px]"></div>
        </div>
        <div id="grid-wrapper" className="mt-[20px]">
          <div id="grid-container"></div>
        </div>
      </div>
    </>
  );
};

export default WordSearchGame;
