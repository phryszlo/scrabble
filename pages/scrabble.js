
import spacelog from "../spaceLog.js";
import wordLists from "./wordLists.js"
import navbar from "../navbar.js"

// HTML element refs
const gameboard = document.querySelector('.gameboard');

const tws = [16513, 0, 0, 0, 0, 0, 0, 16513, 0, 0, 0, 0, 0, 0, 16513]
const dws = [0, 8194, 4100, 2056, 1040, 0, 0, 128, 0, 0, 1040, 2056, 4100, 8194, 0]
const tls = [0, 544, 0, 0, 0, 8738, 0, 0, 0, 8738, 0, 0, 0, 544, 0]
const dls = [2056, 0, 320, 16513, 0, 0, 4420, 2056, 4420, 0, 0, 16513, 320, 0, 2056]


const fullWordList = [];

const loadBoard = () => {

}



window.addEventListener('load', async () => {
  await wordLists()
    .then(arrWordLists => {

      // #region .... some historical notes ....

      // spacelog(Object.keys(arrWordLists[1])[0])
      // // so that's the keyname of the array in the json
      // // e.g. "threeLetterWords"

      // // spacelog(Object.values(arrWordLists[1])[0])
      // // and that's the whole array of objects under key "threeLetterWords"

      // spacelog(Object.values(arrWordLists[1])[0][47].word)
      // // and that's the value with key "word" for index 47 
      // // of the object array under "threeLetterWords"

      // #endregion


      // wordLists.js returned an array of the response.json() of each .json file
      // forEach full json object (i.e. response.json())
      arrWordLists.forEach(async (list, idx) => {

        // forEach {word: value} object in the list (: array)
        Object.values(list)[0].forEach(async (objWord, i) => {
          // spacelog(objWord.word)
          // and THAT contains the word. and if you uncomment that,
          // it will take 5 minutes to log all 14 arrays of thousands of words (170,000+)
          // --> so don't.

          fullWordList.push(objWord.word)
        })
      })
    })
  spacelog(`'done': fullWordList contains ${fullWordList.length} words. fullWordList[6000] = ${fullWordList[6000]}`)
  spacelog(`fullWordList[99999] = ${fullWordList[99999]}`)

  // insert the navbar : don't like doing the innerHTML this way, but I'll stop when we get to react
  document.querySelector('.navbar-placeholder').innerHTML = navbar

}) // end window.addEvenListener('load')



