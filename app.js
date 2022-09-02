// import twoLetterWords from "./wordlists/json/2-letter-words.json";
// import threeLetterWords from "./wordlists/json/3-letter-words.json";
// import fourLetterWords from "./wordlists/4-letter-words.json.js";
// import fiveLetterWords from "./wordlists/5-letter-words.json.js";
// import sixLetterWords from "./wordlists/6-letter-words.json.js";
// import sevenLetterWords from "./wordlists/7-letter-words.json.js";
// import eightLetterWords from "./wordlists/8-letter-words.json.js";
// import nineLetterWords from "./wordlists/9-letter-words.json.js";
// import tenLetterWords from "./wordlists/10-letter-words.json.js";
// import elevenLetterWords from "./wordlists/11-letter-words.json.js";
// import twelveLetterWords from "./wordlists/12-letter-words.json.js";
// import thirteenLetterWords from "./wordlists/13-letter-words.json.js";
// import fourteenLetterWords from "./wordlists/14-letter-words.json.js";
// import fifteenLetterWords from "./wordlists/15-letter-words.json.js";
import spacelog from "./spaceLog.js";
import wordLists from "./wordLists.js"

// const objWordlists = {
//   2: twoLetterWords,
//   3: threeLetterWords,
//   4: fourLetterWords,
//   5: fiveLetterWords,
//   6: sixLetterWords,
//   7: sevenLetterWords,
//   8: eightLetterWords,
//   9: nineLetterWords,
//   10: tenLetterWords,
//   11: elevenLetterWords,
//   12: twelveLetterWords,
//   13: thirteenLetterWords,
//   14: fourteenLetterWords,
//   15: fifteenLetterWords
// }
// const wordlists = [
//   twoLetterWords,
//   threeLetterWords,
//   JSON.stringify(fourLetterWords),
//   JSON.stringify(fiveLetterWords),
//   JSON.stringify(sixLetterWords),
//   JSON.stringify(sevenLetterWords),
//   JSON.stringify(eightLetterWords),
//   JSON.stringify(nineLetterWords),
//   JSON.stringify(tenLetterWords),
//   JSON.stringify(elevenLetterWords),
//   JSON.stringify(twelveLetterWords),
//   JSON.stringify(thirteenLetterWords),
//   JSON.stringify(fourteenLetterWords),
//   JSON.stringify(fifteenLetterWords)
// ]

window.addEventListener('load', async () => {
  spacelog(
    await wordLists()
      .then(json => {
        return json.twoLetterWords[0].word
      })
  )
})

