
import spacelog from "./spaceLog.js"
import wordLists from "./wordLists.js"

// HTML element refs
const gameboard = document.querySelector('.gameboard')
const spaceConsole = document.querySelector('.console');
const player1Tray = document.querySelector('.player1-tray')
const player2Tray = document.querySelector('.player2-tray')
const btnP1EndTurn = document.querySelector('.btn-p1-draw')
const btnP2EndTurn = document.querySelector('.btn-p2-draw')
const btnP1Toggle = document.querySelector('.btn-p1-toggle')
const btnP2Toggle = document.querySelector('.btn-p2-toggle')
const btnFreeWords = document.querySelector('.btn-free-words')
const freeWordCount = document.querySelector('.free-word-count')


const bagOfTiles_DOM = document.querySelector('.bag-of-tiles')

const bagOfTiles_classes = []


// ==== Gameplay variables =====
let playerUp = 'player1'
let tilesInPlay = []
let currentTileInPlay = null


let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
let vmin = Math.min(vw, vh)

console.log(`vw=${vw} & vh=${vh} & vmin=${vmin}`)

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
      imgEl.classList.add(letter.substring(letter.indexOf('.') + 1)) //set a class of just the letter
      imgEl.setAttribute('width', (50 * vw) / 18) // attempt to mimic the css
      document.querySelector('.tiles-images').append(imgEl)

      let numTilesNeeded = letter.substring(0, letter.indexOf('.')) // e.g. '2.W', numTilesNeeded = 2
      for (let i = 0; i < numTilesNeeded; i++) {
        // idx is the point val
        tile = document.createElement('div')

        // this is the place where you at first added letter- and points- classes and then decided to go with attributes
        // but were uncommitted to the idea so kept both.

        tile.classList.add('tile', `letter-${letter.substring(letter.indexOf('.') + 1)}`, `points-${idx}`)
        tile.setAttribute('data-letter', letter.substring(letter.indexOf('.') + 1))
        tile.setAttribute('data-points', idx)

        // classlist is a DOMTokenList ([<string>])

        tile.style.backgroundImage = `url(${imgEl.src})`

        // custom attributes addition
        // a unique id for every tile? could be useful. could be not.
        tile.setAttribute('data-id', id)
        id += 1


        // reminder: bagOfTiles_classes is just a list of A classname of the tiles
        // and _DOM is the elements themselves
        bagOfTiles_classes.push(tile.classList[1])
        bagOfTiles_DOM.append(tile)


        // tile.addEventListener('dragstart', handleDragStart)
        // tile.addEventListener('dragend', handleDragEnd)
      }
    })
  })

  // spacelog(`after tileDistro loop, bagOfTiles contains ${bagOfTileClasses.length} tiles`);
}

// #endregion bagOfTiles creation


// the name drawTiles is a bit misleading given the 2 meanings. here it means: pick it from the bagOfTiles.
//  i.e. this does not draw anything on the screen
const drawTiles = (playerTray, numTiles) => {
  let t, p, letter // tile, player-prefix (p1-,p2-), and tile-letter
  for (let i = 1; i <= numTiles; i++) {
    const idx = Math.floor(Math.random() * bagOfTiles_classes.length)
    const tileClass = bagOfTiles_classes.splice(idx, 1)



    // custom attributes addition
    // tile.setAttribute('data-

    t = bagOfTiles_DOM.querySelector(`.${tileClass}`)
    p = playerTray === player1Tray ? 'p1-' : 'p2-'
    letter = t.classList.value.split(' ').find(c => c.startsWith('letter-'))
    letter = letter.substring(letter.indexOf('-') + 1)
    console.log(letter)
    t.classList.add(`${p}tile`, `${p}${letter}`)


    playerTray.append(t)

    t.setAttribute('draggable', true)
    t.addEventListener('dragstart', dragStartHandler)
    t.addEventListener('dragend', handleDragEnd)

  }
}

// #region drag events

// based on: https://glitch.com/edit/#!/simple-drag-drop?path=dnd.js%3A65%3A3
let srcTile = null;



////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// =========== GAMEPLAY FUNCTIONS ===========
// only run this/these when 'end turn' is called. let player move willy-gnilly until then


const endTurn_click = (e) => {
  if (e.target === btnP1EndTurn) {
    spacelog('p1 click')
    if (validatePlay()) {
      'p1 valid'
      let trayCount = player1Tray.querySelectorAll('.tile').length
      // spacelog(`trayCount p2 = ${trayCount}`)
      drawTiles(player1Tray, 7 - trayCount)
    }
    else {
      // notify of the problem
      return false
    }
  }
  else {
    if (validatePlay()) {
      let trayCount = player1Tray.querySelectorAll('.tile').length
      // spacelog(`trayCount p2 = ${trayCount}`)
      drawTiles(player2Tray, 7 - trayCount)
    }
    else {
      // notify of the problem
      return false
    }
  }

  tallyScore()
  tilesInPlay.splice(0)

}



const validatePlay = (firstPlay = false) => {
  let goOn = true
  if (firstPlay) {
    goOn = verifyCenterSquareUsed()
  }
  goOn = verifyInline()
  return goOn
}

const verifyCenterSquareUsed = () => {
  return true
}


const verifyInline = (tiles = tilesInPlay) => {
  let row = 1
  let col = 1
  //mark the first tile as both zRow and zCol. isRow || isCol cannot be known at this time
  let zRow = tiles[0].dataset.row
  let zCol = tiles[0].dataset.col

  // start the loop on the second tile placement
  for (let i = 1; i < tiles.length; i++) {
    if (tiles[i].dataset.row === zRow) {
      row++
    }
    if (tiles[i].dataset.col === zCol) {
      col++
    }
  }
  // spacelog(`row=${row} and tiles.length = ${tiles.length}`)

  // this defines the condition of isRow or isCol. min word length is 2.
  if (((row === tiles.length && col === 1) || (col === tiles.length && row === 1)) && tiles.length > 1) return true
  else return false
}

const tallyScore = (tiles = tilesInPlay) => {
  let points = 0
  let wordMultiplier = 1
  // this loop only counts the in-play tiles, i.e. not the on-board/re-used tiles
  tiles.forEach((tile) => {
    points += tile.parentElement.dataset.ltr_multi ?
      parseInt(tile.dataset.points) * parseInt(tile.parentElement.dataset.ltr_multi) :
      parseInt(tile.dataset.points)
    wordMultiplier *= tile.parentElement.dataset.word_multi ?
      parseInt(tile.parentElement.dataset.word_multi) : 1
  })
  points *= wordMultiplier
  spacelog(points)
}

// ** state-of-work vs. state-of-play **

// this is bogus. this is only a first turn problem. length can be up to 15 including on-board tiles.
//  if (Math.abs(tile.dataset.col - lastPlayed.dataset.col) > 7) {}

// =========== DRAG START EVENT =============
function dragStartHandler(e) {
  // spacelog(`drag start on ${e}`)
  this.style.opacity = '0.4';

  srcTile = e.target;
  // console.dir(e.target)

  // const img = new Image();
  // const m = this.style.backgroundImage
  // spacelog(m + m.substring(m.lastIndexOf('/'), m.lastIndexOf('.') + 3))



  // img.src = "./images/tiles" +
  //   m.substring(m.lastIndexOf('/'), m.length - 2)
  // img.width = 5
  // img.height = 5

  // const letter = this.getAttribute('data-letter')
  // spacelog(letter)
  // let bgi = document.querySelector(`letter-${letter}`)

  // spacelog(typeof(bgi))

  // e.dataTransfer.setDragImage(bgi, 1, 1)


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

// ===============================
// 🎟 🇦🇫 :🧮 ✈ 🍆 🔂 🙆‍♂️ 🤢 ⁉ 📦 
// 🎟 🇦🇫 :🧮 ✈ 🍆 🔂 🙆‍♂️ 🤢 ⁉ 📦 
// 🎟 🇦🇫 :🧮 ✈ 🍆 🔂 🙆‍♂️ 🤢 ⁉ 📦 
//  ======== DROP HANDLER =======
// ===============================
function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  this.replaceChildren(srcTile) // this seems better
  // this.innerHTML = e.dataTransfer.getData('text/html'); //than this
  // }

  this.classList.remove('over');

  // ------ set custom attributes/classes of tiles -------
  // allegedly this way of using .dataset is a problem pre-IE11
  srcTile.dataset.col = this.dataset.col
  srcTile.dataset.row = this.dataset.row

  // only add to tilesInPlay if it's being dragged from the tray -- i.e. if it's not already in play
  // spacelog(tilesInPlay.indexOf(srcTile))
  if (tilesInPlay.indexOf(srcTile) < 0) {
    tilesInPlay.push(srcTile)
  }

  tilesInPlay.forEach(tile => {
    spacelog(`(${tile.dataset.row}, ${tile.dataset.col})`)
  })
  spacelog(verifyInline())


  return false;
}
// 🎟 🇦🇫 :🧮 ✈ 🍆 🔂 🙆‍♂️ 🤢 ⁉ 📦 
// 🎟 🇦🇫 :🧮 ✈ 🍆 🔂 🙆‍♂️ 🤢 ⁉ 📦 
// 🎟 🇦🇫 :🧮 ✈ 🍆 🔂 🙆‍♂️ 🤢 ⁉ 📦 

// #endregion


// #region board creation functions
const getDiv = (row, col, className = 'div') => {
  const div = document.createElement('div')
  div.classList.add('square', className) //,`row-${row}`, `col-${col}`)
  // the following syntax may break < IE11
  if (className === 'dls-div') { div.dataset.ltr_multi = 2 }
  if (className === 'tls-div') { div.dataset.ltr_multi = 3 }
  if (className === 'dws-div') { div.dataset.word_multi = 2 }
  if (className === 'tws-div') { div.dataset.word_multi = 3 }
  // whereas the following may not
  div.setAttribute('data-row', row)
  div.setAttribute('data-col', col)
  if (row === 7 && col === 7) {
    div.style.backgroundImage = `url('./images/star.png')`
    div.style.backgroundSize = 'contain'
  }
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


const pickSomeRandomWords = (numWords) => {
  let idx = Math.floor(Math.random() * fullWordList.length)
  spacelog(`here are ${numWords} free word suggestions`)
  spacelog('-------------------------')
  for (let i = 0; i < numWords; i++) {
    spacelog(fullWordList[idx])
    idx = Math.floor(Math.random() * fullWordList.length)
  }
}



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
  // spacelog(`'done': fullWordList contains ${fullWordList.length} words. fullWordList[6000] = ${fullWordList[6000]}`)
  // spacelog(`fullWordList[11999] = ${fullWordList[11999]}`)

  spacelog(`vw=${vw} & vh=${vh} & vmin=${vmin}`)
  // pickSomeRandomWords(100)
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


  btnP1EndTurn.addEventListener('click', endTurn_click)

  // () => {
  //   let trayCount = player1Tray.querySelectorAll('.tile').length
  //   // spacelog(`trayCount p1 = ${trayCount}`)
  //   drawTiles(player1Tray, 7 - trayCount)
  // })
  btnP2EndTurn.addEventListener('click', endTurn_click)
  // () => {
  //   let trayCount = player2Tray.querySelectorAll('.tile').length
  //   // spacelog(`trayCount p2 = ${trayCount}`)
  //   drawTiles(player2Tray, 7 - trayCount)
  // })

  btnFreeWords.addEventListener('click', () => {
    spaceConsole.replaceChildren('')
    pickSomeRandomWords(freeWordCount.value)
  })

  // these are a cheap way to give the option to obscure the other players' trays
  btnP1Toggle.addEventListener('click', () => {
    if (player1Tray.style.filter != 'contrast(0)') {
      player1Tray.style.filter = 'contrast(0)'
    } else {
      player1Tray.style.filter = ''
    }
  })
  btnP2Toggle.addEventListener('click', () => {
    if (player2Tray.style.filter != 'contrast(0)') {
      player2Tray.style.filter = 'contrast(0)'
    } else {
      player2Tray.style.filter = ''
    }
  })

  // btnTilesModal.addEventListener('click', () => {
  //   document.getElementById('modalTilesDistro').modal('show')
  // })

}) // end window.addEvenListener('load')



