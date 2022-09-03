
import spacelog from "../spaceLog.js";
import wordLists from "./wordLists.js"

const fullWordList = [];

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
}) // end window.addEvenListener('load')

