"use strict";

/** This object sets up the word search game, as well as button functions (for solving
 * and for refreshing/setting up a new game).
 *
 * @author Ugege Daniel
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
    const resultArray = [];
    const array1 = [];
    const array2 = [];
    while (array1.length + array2.length < config.numberOfWordsToFind) {
      const randomIndex = Math.floor(Math.random() * flattenedArray.length);
      const randomElement = flattenedArray.splice(randomIndex, 1)[0];
      if (array1.length <= array2.length) {
        array1.push(randomElement);
      } else {
        array2.push(randomElement);
      }
    }

    resultArray.push(array1, array2);
    // console.log({ listOfWords });
    countdownTimer(config.timer.duration, config.timer.timerCallback);
    convertToUpperCase(resultArray);


    //sets the headings to reflect the instructions and themes
    updateHeadings(mainInstructions, themesOfWords[randIndex]);

    //generates the view of the game and sets up mouse events for clicking and dragging
    game = new WordSearchLogic(resultArray.slice());
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
