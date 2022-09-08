
import spacelog from "./spaceLog.js"
import wordLists from "./wordLists.js"

// HTML element refs
const gameboard = document.querySelector('.gameboard')
const bagOfTilesDOM = document.querySelector('.bag-of-tiles')
const player1Tray = document.querySelector('.player1-tray')
const player2Tray = document.querySelector('.player2-tray')
const btnP1Draw = document.querySelector('.btn-p1-draw')
const btnP2Draw = document.querySelector('.btn-p2-draw')

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

let squares;


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
  let id = 1;
  tileDistribution.forEach((arrLetters, idx) => {
    arrLetters.forEach((letter) => {
      // letter is now like: 9.A, 12.E, 2.blank etc.

      // create an element to hold the background image of the tile
      let imgEl = document.createElement('img')
      imgEl.src = `./images/tiles/${letter.substring(letter.indexOf('.') + 1)}.png`
      document.querySelector('.tiles-images').append(imgEl)

      let numTilesNeeded = letter.substring(0, letter.indexOf('.')) // e.g. '2.W', numTilesNeeded = 2
      for (let i = 0; i < numTilesNeeded; i++) {
        // idx is the point val
        tile = document.createElement('div')



        tile.classList.add('tile', `letter-${letter.substring(letter.indexOf('.') + 1)}`, `points-${idx}`)

        // classlist is a DOMTokenList ([<string>])

        tile.style.backgroundImage = `url(${imgEl.src})`

        // custom attributes addition
        // a unique id for every tile? could be useful. could be not.
        tile.setAttribute('data-id', id)
        id += 1


        bagOfTileClasses.push(tile.classList[1])
        bagOfTilesDOM.append(tile)


        // tile.addEventListener('dragstart', handleDragStart)
        // tile.addEventListener('dragend', handleDragEnd)
      }
    })
  })

  spacelog(`after tileDistro loop, bagOfTiles contains ${bagOfTileClasses.length} tiles`);
}

// #endregion bagOfTiles creation


// the name drawTiles is a bit misleading given the 2 meanings. this means: pick it from the bagOfTiles.
//  i.e. this does not draw anything on the screen
const drawTiles = (playerTray, numTiles) => {
  let t, p, letter // tile, player-prefix (p1-,p2-), and tile-letter
  for (let i = 1; i <= numTiles; i++) {
    const idx = Math.floor(Math.random() * bagOfTileClasses.length)
    const tileClass = bagOfTileClasses.splice(idx, 1)



    // custom attributes addition
    // tile.setAttribute('data-

    t = bagOfTilesDOM.querySelector(`.${tileClass}`)
    p = playerTray === player1Tray ? 'p1-' : 'p2-'
    letter = t.classList.value.split(' ').find(c => c.startsWith('letter-'))
    letter = letter.substring(letter.indexOf('-') + 1)
    console.log(letter)
    t.classList.add(`${p}tile`, `${p}${letter}`)


    playerTray.append(t)

    t.addEventListener('dragstart', dragStartHandler)
    t.addEventListener('dragend', handleDragEnd)

  }
}

// #region drag events

// based on: https://glitch.com/edit/#!/simple-drag-drop?path=dnd.js%3A65%3A3
let srcTile = null;

function dragStartHandler(e) {
  spacelog(`drag start on ${e}`)
  this.style.opacity = '0.4';

  srcTile = e.target;
  console.dir(e.target)

  const img = new Image();
  const m = this.style.backgroundImage
  spacelog(m + m.substring(m.lastIndexOf('/'), m.lastIndexOf('.') + 3))
  img.src = "./images/tiles" + 
    m.substring(m.lastIndexOf('/'), m.length - 2)
  e.dataTransfer.setDragImage(img, 1, 1)


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
    e.stopPropagation();
  }

  this.replaceChildren(srcTile) // this seems better
  // this.innerHTML = e.dataTransfer.getData('text/html'); //than this
  // }

  this.classList.remove('over');

  return false;
}


// #endregion


// #region board creation functions
const getDiv = (row, col, className = 'div') => {
  const div = document.createElement('div')
  div.classList.add('square', className) //,`row-${row}`, `col-${col}`)
  div.setAttribute('data-row', row)
  div.setAttribute('data-col', col)
  return div
}

const getOneRow = (idx, valsAtIdx) => {

  let currentCol
  // there are 4 vals at each idx: we have 4 arrays of 15 elements. idx = 0-14, valsAtIdx = 0-3.

  // so idx is the row 
  // spacelog(valsAtIdx + '..' + idx)

  let row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  // valsAtIdx is a four-element array: one for each of the four special square-types
  // think: the vertical cross of the four 15-element arrays stacked (a 4 row, 15 column grid)
  valsAtIdx.forEach((val, index) => {

    // val is the actual number in the row (e.g. 16513, or 0)
    // translate the decimal (val) into a binary number (a string: toString(2)), padding with leading '0's

    const bits = val.toString(2).padStart(15, '0')

    // now we have either the binary string or a '0'
    // if it's a '0' how do we know what rows we're dealing with?



    if (bits === '0') {
      // this will never be reached.
      spacelog(`bits=${bits}`)
      row[index] = getDiv(`${idx}`, `${index}`)

    } else {
      for (let bit = 0; bit < bits.length; bit++) {
        currentCol = bit
        // index here is WHICH SQUARE-TYPE (e.g., index=0 means square-type is TripleWordScore(TWS))
        // so each switch will be hit 15 TIMES in a row before moving to the next case
        switch (index) {
          case 0:
            row[bit] = bits[bit] == 1 ? getDiv(idx, bit, 'tws-div') : row[bit]
            break
          case 1:
            row[bit] = bits[bit] == 1 ? getDiv(idx, bit, 'dws-div') : row[bit]
            break
          case 2:
            row[bit] = bits[bit] == 1 ? getDiv(idx, bit, 'tls-div') : row[bit]
            break
          case 3:
            row[bit] = bits[bit] == 1 ? getDiv(idx, bit, 'dls-div') : row[bit]
            break
          default:
            spacelog('default')
            break;
        }
      }
    }
  })

  // but now the unmatched squares are 0s and need to be divs('empty' divs: call getDiv() with no args)

  row = row.map((el, i) => el === 0 ? getDiv(idx, i) : el)

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


// =========== DOM LOADED EVENT ==============
window.addEventListener('DOMContentLoaded', async () => {

  // ======== load the word list ==========
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

  // ======== Generate the board =========
  loadBoard();

  // loadBoard() has called getOneRow() which calls getDiv(), where the .square class is added
  squares = document.querySelectorAll('.square');


  // ========= Fill the bagOfTiles ==========
  createAllTiles();
  // ------- and fill the player trays with tiles ---------
  drawTiles(player1Tray, 7)
  drawTiles(player2Tray, 7)


  // document.querySelectorAll('.tile').forEach((tile) => {
  //   tile.addEventListener('mousedown', (e) => {
  //     // e.preventDefault()
  //     // spacelog(tile.classList[2])
  //   })

  //   // --- Moved to drawTiles() --- 
  //   // tile.addEventListener('dragstart', handleDragStart)
  //   // tile.addEventListener('dragend', handleDragEnd)
  // })


  btnP1Draw.addEventListener('click', () => {
    let trayCount = player1Tray.querySelectorAll('.tile').length
    // spacelog(`trayCount p1 = ${trayCount}`)
    drawTiles(player1Tray, 7 - trayCount)

  })
  btnP2Draw.addEventListener('click', () => {
    let trayCount = player2Tray.querySelectorAll('.tile').length
    // spacelog(`trayCount p2 = ${trayCount}`)
    drawTiles(player2Tray, 7 - trayCount)
  })


}) // end window.addEvenListener('load')



