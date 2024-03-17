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
