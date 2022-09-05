
import spacelog from "./spaceLog.js"
import wordLists from "./wordLists.js"
// import navbar from "../navbar.js"

// HTML element refs
const gameboard = document.querySelector('.gameboard')
const bagOfTilesDOM = document.querySelector('.bag-of-tiles')
const player1Tray = document.querySelector('.player1-tray')
const player2Tray = document.querySelector('.player2-tray')


// the four special square-types (triple-word-score, double-letter-score, etc.)
// the numbers will be (if !0) converted to binary, the one bits representing where the square goes in the row
// each index position is ONE ROW, so the the arrays' fifteen elements are the COLUMNS
const tws = [16513, 0, 0, 0, 0, 0, 0, 16513, 0, 0, 0, 0, 0, 0, 16513]
const dws = [0, 8194, 4100, 2056, 1040, 0, 0, 128, 0, 0, 1040, 2056, 4100, 8194, 0]
const tls = [0, 544, 0, 0, 0, 8738, 0, 0, 0, 8738, 0, 0, 0, 544, 0]
const dls = [2056, 0, 320, 16513, 0, 0, 4420, 2056, 4420, 0, 0, 16513, 320, 0, 2056]

// to contain the entire word list as parsed from the 14 json files
// MAYBE TODO: do separate arrays for each word-length (to prevent find()s on word => word.length === len)
// the array will contain like 170,000 words
const fullWordList = []


// #region bagOfTiles creation

/*
TILE DISTRIBUTION (official)
(1 point)-A, E, I, O, U, L, N, S, T, R
(2 points)-D, G
(3 points)-B, C, M, P
(4 points)-F, H, V, W, Y
(5 points)-K
(8 points)- J, X
(10 points)-Q, Z

A-9, B-2, C-2, D-4, E-12, F-2, G-3, H-2, I-9, J-1, K-1, 
L-4, M-2, N-6, O-8, P-2, Q-1, R-6, S-4, T-6, U-4, V-2, 
W-2, X-1, Y-2, Z-1 and blank-2.
*/

// for tileDistribution and tileCounts, the index of the outer array is,
// respectively, point-value, and #-of-tiles in set

const tileDistributionses = [
  ['blank'],
  ['A', 'E', 'I', 'O', 'U', 'L', 'N', 'S', 'T', 'R'],
  ['D', 'G'],
  ['B', 'C', 'M', 'P'],
  ['F', 'H', 'V', 'W', 'Y'],
  ['K'],
  [],
  [],
  ['J', 'X'],
  [],
  ['Q', 'Z']
]
const tileDistribution = [
  ['2.blank'],
  ['9.A', '12.E', '9.I', '8.O', '4.U', '4.L', '6.N', '4.S', '6.T', '6.R'],
  ['4.D', '3.G'],
  ['2.B', '2.C', '2.M', '2.P'],
  ['2.F', '2.H', '2.V', '2.W', '2.Y'],
  ['1.K'],
  [],
  [],
  ['1.J', '1.X'],
  [],
  ['1.Q', '1.Z']
]

const bagOfTileClasses = []

const createAllTiles = () => {
  let tile
  let tileCount = '0'
  tileDistribution.forEach((arrLetters, idx) => {
    arrLetters.forEach((letter) => {
      // letter is now like: 9.A, 12.E, 2.blank etc.
      let imgEl = document.createElement('img')
      imgEl.src = `./images/tiles/${letter.substring(letter.indexOf('.') + 1)}.png`
      document.querySelector('.tiles-images').append(imgEl)

      // so now I need the index of the array that contains this letter
      let numTilesNeeded = letter.substring(0, letter.indexOf('.'))
      for (let i = 0; i < numTilesNeeded; i++) {
        // idx is the point val
        tile = document.createElement('div')
        tile.classList.add('tile', `letter-${letter.substring(letter.indexOf('.') + 1)}`, `points-${idx}`)

        // classlist is a DOMTokenList ([<string>])
        spacelog(tile.classList[1])//  `the tile classlist: ${tile.classList}`)
        tile.style.backgroundImage = `url(${imgEl.src})`
        bagOfTileClasses.push(tile.classList[1])
        bagOfTilesDOM.append(tile)
      }
    })
  })

  spacelog(`after tileDistro loop, bagOfTiles contains ${bagOfTileClasses.length} tiles`);


  // there should be 100 tiles at the end of this
  // tileCounts.forEach((arr, index) => {
  //   // console.log(arr);

  //   // this loop is each 
  //   arr.forEach((letter) => {
  //     // for (let i = 0; i <= index; i++) {
  //     let tileToClone
  //     let clonedTile;
  //     arr.forEach((letter) => {
  //       tileToClone = document.querySelector(`.letter-${letter}`)
  //       // console.log(tileToClone);
  //       // console.log(`count: ${letter} : ${index}`);
  //       // clonedTile = tileToClone.cloneNode(true)
  //       // bagOfTiles.push(clonedTile)
  //     })
  //   })
  // })
}

// #endregion bagOfTiles creation

const drawTiles = (player, num) => {
  spacelog('anything')

  for (let i = 1; i <= num; i++) {
    spacelog('anything')
    let idx = Math.floor(Math.random() * bagOfTileClasses.length)
    let tyle = bagOfTileClasses.splice(idx, 1)
    spacelog(`classlist[1] = ${tyle}`)
    player.append(bagOfTilesDOM.querySelector(`.${tyle}`))
    // let sackOfTiles = [...bagOfTiles]
    // let t = sackOfTiles.splice(idx, 1)
    // spacelog(typeof(t));
    // player.append()
  }
}

// #region drag events

// based on: https://glitch.com/edit/#!/simple-drag-drop?path=dnd.js%3A65%3A3
let srcTile = null;

function handleDragStart(e) {
  this.style.opacity = '0.4';

  srcTile = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.style.opacity = '1';

  squares.forEach(function (square) {
    square.classList.remove('over');
  });
}

function handleDragEnter(e) {
  this.classList.add('over');

  // grow the target
  // or maybe just css the .over
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';

  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  // no need to check if the square is the dragSrc because it's not even draggable
  // if (dragSrcEl != this) { 

  // this line overwrites the src-tile's innerHTML with the target-square's innerHTML, which we don't actually want
  // dragSrcEl.innerHTML = this.innerHTML;

  /*
      Maybe: just go ahead and replace the tile with another
        - does the tile have an id or something, or is any tile just defined as its contents (i.e. the letter)
          - i think just the letter?
          - no, i think there should be actual tile divs, the exact # of each letter that come with scrabble.
          - we aren't actually schizophrenic
        - i mean instead of making someone hit 'draw tile' -> unless you want the possibility of them shorting themselves: i.e. more cutthroat
      Target square: 
        - do we just replace the innerHTML with the letter content, and restyle via classList?
        - or do we append a tile inside the square div, with like 100% w&h? 
  */

  this.replaceChildren(srcTile) // this seems better
  // this.innerHTML = e.dataTransfer.getData('text/html'); //than this
  // }

  this.classList.remove('over');


  return false;
}


// #endregion


// #region board creation functions
const getDiv = (className = 'div') => {
  const div = document.createElement('div')
  div.classList.add('square', className, `row-`)

  return div
}

const getOneRow = (idx, valsAtIdx) => {

  // there are 4 vals at each idx: we have 4 arrays of 15 elements. idx = 0-14, valsAtIdx = 0-3.

  let row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  // valsAtIdx is a four-element array: one for each of the four special square-types
  // think: the vertical cross of the four 15-element arrays stacked (a 4 high, 15 across grid)
  valsAtIdx.forEach((val, index) => {
    // val is the actual number in the row, index is the position in the row
    // translate the decimal val into binary number (string) with leading '0's
    const bits = val.toString(2).padStart(15, '0')
    if (bits === '0') {
      row[index] = getDiv('')
    } else {
      for (let bit = 0; bit < bits.length; bit++) {

        // idx here is WHICH SQUARE-TYPE (e.g., idx=0 means square-type is TripleWordScore(TWS))
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

  // spacelog(`board.length = ${board.length}`)

  board.forEach(row => {
    row.forEach(square => {
      // spacelog(square.classList)
      gameboard.append(square)

      // I am leaving these listener adds here because it was not working when I had them after loadBoard in DOMContentLoaded
      // but *** if I know why this is. I mean, the .square is now appended to a DOM element, so it's fully attached either way.
      square.addEventListener('dragenter', handleDragEnter, false);
      square.addEventListener('dragover', handleDragOver, false);
      square.addEventListener('dragleave', handleDragLeave, false);
      square.addEventListener('drop', handleDrop, false);

      // setTimeout(() => {
      //   let s = square
      // }, 10);

    })
  })
}

// #endregion board creation functions


window.addEventListener('DOMContentLoaded', async () => {
  await wordLists()
    .then(arrWordLists => {

      // wordLists.js returned an array of the response.json() of each .json file
      arrWordLists.forEach(async (list, idx) => {

        // forEach {word: value} object in the list (: array)
        Object.values(list)[0].forEach(async (objWord, i) => {

          fullWordList.push(objWord.word)
        })
      })
    })
  spacelog(`'done': fullWordList contains ${fullWordList.length} words. fullWordList[6000] = ${fullWordList[6000]}`)
  spacelog(`fullWordList[11999] = ${fullWordList[11999]}`)
  loadBoard();

  // loadBoard() has called getOneRow() which calls getDiv(), where the .square class is added

  const squares = document.querySelectorAll('.square');

  createAllTiles();

  bagOfTilesDOM.childNodes.forEach((tile) => {

    tile.addEventListener('dragstart', handleDragStart)
    tile.addEventListener('dragend', handleDragEnd)
  })

  drawTiles(player1Tray, 7)

}) // end window.addEvenListener('load')



