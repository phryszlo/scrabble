
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

const getDiv = (className = 'div') => {
  const div = document.createElement('div')
  div.classList.add(className)
  return div
}

const getOneRow = (idx, valsAtIdx) => {
  // valsAtIdx is a four-element array (of arrays)
  let row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  valsAtIdx.forEach((val, index) => {

    // translate the decimal val into binary number (string) with leading '0's
    const bits = val.toString(2).padStart(15, '0')
    spacelog(bits)
    if (bits === '0') {
      row[bit] = getDiv('')
    } else {
      for (let bit = 0; bit < bits.length; bit++) {

        // idx here is WHICH SQUARE-TYPE (i.e., idx=0 means square-type is TWS)
        // so each switch will be hit 15 TIMES in a row before moving to the next case
        switch (index) {
          case 0:
            row[bit] = bits[bit] == 1 ? getDiv('tws-div') : row[bit]
            break
          case 1:
            row[bit] = bits[bit] == 1 ? getDiv('dws-div') : row[bit]
            break
          case 2:
            row[bit] = bits[bit] == 1 ? getDiv('tls-div') : row[bit]
            break
          case 3:
            row[bit] = bits[bit] == 1 ? getDiv('dls-div') : row[bit]
            break
        }
      }
    }
  })

  // but now the unmatched squares are 0s and need to be divs
  row = row.map(el => el === 0 ? getDiv() : el)

  return row
}

const loadBoard = () => {
  const board = []
  for (let i = 0; i < 15; i++) {
    let currentRow = [tws[i], dws[i], tls[i], dls[i]]
    board.push(getOneRow(i, currentRow))
  }

  spacelog(`board.length = ${board.length}`)

  board.forEach(row => {
    row.forEach(square => {
      spacelog(square.classList)
    })
  })
  // spacelog(board[4][2].classList)
  // spacelog(board)
}

// const getDwsDiv = () => {
//   const dwsDiv = document.createElement('div')
//   dwsDiv.classList.add('dws-div')
//   return dwsDiv
// }
// const getTlsDiv = () => {
//   const tlsDiv = document.createElement('div')
//   tlsDiv.classList.add('tls-div')
//   return tlsDiv
// }
// const getDlsDiv = () => {
//   const dlsDiv = document.createElement('div')
//   dlsDiv.classList.add('dls-div')
//   return dlsDiv
// }



/*
tws.forEach(num => {
  if (num != 0) {
    let binary = num.toString(2)

    for (let bit = 0; bit < binary.length; bit++) {
      if (binary[bit] === '1') console.log('TWS')
      else console.log('_');
    }
  }
  else {
    console.log('_ _ _ _ _ _ _ _ _ _ _ _ _ _ _');
  }
})
*/


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
  // document.querySelector('.navbar-placeholder').innerHTML = navbar

  loadBoard();

}) // end window.addEvenListener('load')



