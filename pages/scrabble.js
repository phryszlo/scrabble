
import spacelog from "../spaceLog.js";
import wordLists from "./wordLists.js"
// import navbar from "../navbar.js"

// HTML element refs
const gameboard = document.querySelector('.gameboard');

// probably change the class to.tile
const trayTiles = document.querySelectorAll('.tray-tile');


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
const fullWordList = [];


/*
TILE DISTRIBUTION (official)
(1 point)-A, E, I, O, U, L, N, S, T, R
(2 points)-D, G
(3 points)-B, C, M, P
(4 points)-F, H, V, W, Y
(5 points)-K
(8 points)- J, X
(10 points)-Q, Z
*/

const tileDistribution = [
  [],
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

const bagOfTiles = []

const createAllTiles = () => {
  let tile
  for (let i = 1; i < 200; i++) {
    tile = document.createElement('div')
    tile.classList.add('tile')
  }

  tileDistribution.forEach((arrLetters, idx) => {
    arrLetters.forEach((letter) => {
      // idx is the point val
      tile = document.createElement('div')
      tile.classList.add('tile', `letter-${letter}`, `points-${idx}`)
      tile.style.backgroundImage = `url('images/tiles/${letter}.png)`
      bagOfTiles.push(tile)
      spacelog(tile.classList);
    })

    // push a couple of blanks
    for (let i = 1; i <= 2; i++) {
      tile = document.createElement('div')
      tile.classList.add('tile', `letter-blank`)
      tile.style.backgroundImage = `url('images/tiles/blank.png)`
      bagOfTiles.push(tile)
      spacelog(tile.classList);

    }
  })


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




  trayTiles.forEach((tile) => {
    tile.addEventListener('dragstart', handleDragStart)
    tile.addEventListener('dragend', handleDragEnd)
  })

  // squares.forEach(function (square) {
  //   console.log(square)
  //   // square.addEventListener('dragstart', handleDragStart, false);
  //   square.addEventListener('dragenter', handleDragEnter, false);
  //   square.addEventListener('dragover', handleDragOver, false);
  //   square.addEventListener('dragleave', handleDragLeave, false);
  //   square.addEventListener('drop', handleDrop, false);
  //   // square.addEventListener('dragend', handleDragEnd, false);
  // });






}) // end window.addEvenListener('load')



