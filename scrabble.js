
import spacelog from "./spaceLog.js"
import wordLists from "./wordLists.js"

// HTML element refs
const gameboard = document.querySelector('.gameboard')
const spaceConsole = document.querySelector('.console');
const player1Tray = document.querySelector('.player1-tray')
const player2Tray = document.querySelector('.player2-tray')
const btnP1EndTurn = document.querySelector('.btn-p1-end')
const btnP2EndTurn = document.querySelector('.btn-p2-end')
const btnP1Toggle = document.querySelector('.btn-p1-toggle')
const btnP2Toggle = document.querySelector('.btn-p2-toggle')
const btnP1Swap = document.querySelector('.btn-p1-swap')
const btnP2Swap = document.querySelector('.btn-p2-swap')
const btnFreeWords = document.querySelector('.btn-free-words')
const btnClearConsole = document.querySelector('.btn-clear-console')
const freeWordCount = document.querySelector('.free-word-count')
const lastWord = document.querySelector('.last-word')
const lastPlay = document.querySelector('.last-play')
const p1Score = document.querySelector('.p1-score')
const p2Score = document.querySelector('.p2-score')
const lastPoints = document.querySelector('.last-points')
const wordinessForm = document.getElementById('wordinessForm')
const chkWordiness = document.querySelector('.chk-wordiness')
const loadSpinner = document.querySelector('.spinner-border')
const gameboardContainer = document.querySelector('.gameboard-container')


const bagOfTiles_DOM = document.querySelector('.bag-of-tiles')

const bagOfTiles_classes = []


// ==== Gameplay variables =====
let playerUp = 'player1'
let p1TotalScore = 0
let p2TotalScore = 0
let currentWord = [] //char[] so easy to add letters to beginning. 
const currentWordTiles = [] // = tile[] 
const currentCrossWordTiles = []
const currentCrossWords = []
let tilesInPlay = []
let tilesOnBoard = []
const specialsInPlay = []

let wordsWithBlanks = []
let wordsInDictionary = []
let wordsNeedingApproval = []
let possibleBlankCompleters = []

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
  let p = 1
  let points
  if (e.target === btnP1EndTurn) {
    if (validatePlay()) {
      'p1 valid'
      let trayCount = player1Tray.querySelectorAll('.tile').length
      drawTiles(player1Tray, 7 - trayCount)
      points = tallyScore()
      p1TotalScore += points
      playerUp = 'player2'
      switchPlayers()
    }
    else {
      // notify of the problem
      return false
    }
  }
  else {
    p = 2
    if (validatePlay()) {
      'p2 valid'
      let trayCount = player2Tray.querySelectorAll('.tile').length
      drawTiles(player2Tray, 7 - trayCount)
      points = tallyScore()
      p2TotalScore += points
      playerUp = 'player1'
      switchPlayers()
    }
    else {
      // notify of the problem
      return false
    }
  }

  const divvo = document.createElement('div')
  divvo.style.display = 'flex'
  divvo.style.width = 'fit-content'
  const para = document.createElement('p')
  para.style.color = 'greenyellow'
  para.replaceChildren('last turn: ', points)
  divvo.replaceChildren(para)
  lastPoints.replaceChildren(divvo)
  // if (playerUp = 'player1') {
  // }
  // else {
  // }

  // 😂 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 
  ////////////////////////////////////////////////////////////////////////
  // ==> update display: move section to new function
  // ///////////////////////////////////////////////////////////////////////
  // 😂 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 👺 
  currentWord.forEach((word, i) => {
    currentWord[i] = word.replace('BLANK', '__').replace('blank', '__')
  })
  if (p === 1) {
    p1Score.replaceChildren(p1TotalScore.toString().padStart(4, '0'))
  }
  else {
    p2Score.replaceChildren(p2TotalScore.toString().padStart(4, '0'))
  }
  if (specialsInPlay.length === 0) {
    lastPlay.replaceChildren('no multipliers')
  } else {
    lastPlay.replaceChildren(specialsInPlay.join(', '))
  }

  let lastWordDisplay = ''
  lastWordDisplay += currentWord.join('')
  if (currentCrossWords.length > 0) {

    lastWordDisplay += ',' + currentCrossWords.join(', ')
  }

  lastWord.replaceChildren(` last-word:  ${lastWordDisplay}`)
  currentWordTiles.splice(0)
  currentWord.splice(0)
  currentCrossWordTiles.splice(0)
  currentCrossWords.splice(0)

  tilesInPlay.forEach((tile) => {
    // if this ever works, these events/attrs need to go back on when these get put back in the bag
    tile.setAttribute('draggable', 'false')
    tile.removeAttribute('data-inplay')
    tile.removeEventListener('dragstart', dragStartHandler)
  })

  tilesOnBoard.push(...tilesInPlay.splice(0))

}





/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                    VALIDATE PLAY (MASTER)
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
const validatePlay = (firstPlay = false) => {
  let goOn = true
  if (firstPlay) {
    goOn = verifyCenterSquareUsed()
  }
  if (goOn) goOn = verifyInline()
  if (goOn) goOn = determineLinearAdjacency() // aka the-rabbit-hole: beware

  if (goOn) goOn = ascertainWordiness()


  return goOn
}

const verifyCenterSquareUsed = () => {
  return true
}

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                      ASCERTAIN WORDINESS
        are all players agreed on the words being submitted?
            do they match words in the BIG LIST?
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
const ascertainWordiness = () => {
  currentWord.forEach((w, i) => {
    currentWord[i] = w.replace('BLANK', '-').replace('blank', '-')
  })
  const ourNiceMaybeWords = [...currentCrossWords, currentWord.join('')]
  wordsWithBlanks.splice(0)
  wordsInDictionary.splice(0)
  wordsNeedingApproval.splice(0)
  possibleBlankCompleters.splice(0)

  ourNiceMaybeWords.forEach((word, index) => {
    if (word.indexOf('-') < 0) {
      if (fullWordList.indexOf(word.toLowerCase()) >= 0) {
        wordsInDictionary.push(word.toLowerCase())
        // spacelog(`${word} was found in the fullWordList!`)
      }
      else {
        wordsNeedingApproval.push(word.toLowerCase())
        // spacelog(`${word} is not in the fullWordList. What to do. ye-Gads.`)
      }
    }
    else { // we have a blank
      let firstBit = word.substring(0, word.indexOf('-') - 1)
      let lastBit = word.substring(word.indexOf('-') + 1)
      let finds = fullWordList.filter(w => w.startsWith(firstBit) && w.endsWith(lastBit) && w.length === word.length)
      if (finds.length === 0) {
        wordsNeedingApproval.push(word)
      }
      finds.forEach(wordle => {
        wordsWithBlanks.push(word.replace('BLANK', '-').replace('blank', '-'))
        possibleBlankCompleters.push(wordle)
        // spacelog(wordle)
      })
    }
  })

  // launch a modal form to seek approval, or just to announce the excitement and show-off the dictionary cross-referencing capability of our game





  // if (wordsNeedingApproval.length > 0) {
  if (chkWordiness.checked) {
    const myModal = new bootstrap.Modal(document.getElementById('wordinessForm'))

    const modalContent = wordinessForm.querySelector('.modal-body')
    const div = document.createElement('div')
    div.classList.add('weird-div')

    /*
  const ourNiceMaybeWords = [...currentCrossWords, currentWord.join('')]
  const wordsWithBlanks = []
  const wordsInDictionary = []
  const wordsNeedingApproval = []
  const possibleBlankCompleters = []
    */
    if (wordsWithBlanks.length > 0) {
      let h2 = document.createElement('h2')
      h2.innerText = 'words with blanks'
      const ul = document.createElement('ul')

      let li
      wordsWithBlanks.forEach(word => {
        li = document.createElement('li')
        li.replaceChildren(word)
        ul.append(li)
      })
      div.append(h2, ul)
    }
    if (possibleBlankCompleters.length > 0) {
      let h2 = document.createElement('h2')
      h2.innerText = 'possible completers for words with blanks'
      const ul = document.createElement('ul')

      let li
      possibleBlankCompleters.forEach(word => {
        li = document.createElement('li')
        li.replaceChildren(word)
        ul.append(li)
      })
      div.append(h2, ul)

    }
    if (wordsInDictionary.length > 0) {
      let h2 = document.createElement('h2')
      h2.innerText = 'words found in dictionary'
      const ul = document.createElement('ul')

      let li
      wordsInDictionary.forEach(word => {
        li = document.createElement('li')
        li.replaceChildren(word)
        ul.append(li)
      })
      div.append(h2, ul)

    }
    if (wordsNeedingApproval.length > 0) {
      let h2 = document.createElement('h2')
      h2.innerText = 'words needing approval, or possible blank completers'
      const ul = document.createElement('ul')

      let li
      wordsNeedingApproval.forEach(word => {
        li = document.createElement('li')
        li.replaceChildren(word)
        ul.append(li)
      })
      div.append(h2, ul)

    }


    modalContent.append(div)


    myModal.show()

  }
  return true
}

/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                      TALLY SCORE
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
const tallyScore = (tiles = currentWordTiles) => {
  let points = 0
  let wordMultiplier = 1
  specialsInPlay.splice(0)
  // this loop only counts the in-play tiles, i.e. not the on-board/re-used tiles
  tiles.forEach((tile) => {
    if (tile.parentElement.dataset.ltr_multi) {
      if (parseInt(tile.parentElement.dataset.ltr_multi) === 2) { specialsInPlay.push('Double-Letter-Score') }
      else { specialsInPlay.push('Triple-Letter-Score') }
    }
    if (tile.parentElement.dataset.word_multi) {
      if (parseInt(tile.parentElement.dataset.word_multi) === 2) { specialsInPlay.push('Double-Word-Score') }
      else { specialsInPlay.push('Triple-Word-Score') }
    }
    points += tile.parentElement.dataset.ltr_multi ?
      parseInt(tile.dataset.points) * parseInt(tile.parentElement.dataset.ltr_multi) :
      parseInt(tile.dataset.points)
    wordMultiplier *= tile.parentElement.dataset.word_multi ?
      parseInt(tile.parentElement.dataset.word_multi) : 1
  })
  points *= wordMultiplier
  // spacelog(`tallyScore say: ${points}`)
  return points
}









/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                      VERIFY INLINE
      (this version assumes this is not the first play, 
                so accepts a single letter)
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
const verifyInline = (tiles = tilesInPlay) => {

  // let the next validator deal with this case
  if (tiles.length === 1) return true

  let row = 1
  let col = 1
  //mark the first tile as both zRow and zCol. isRow || isCol cannot be known at this time
  let zRow = tiles[0].dataset.row
  let zCol = tiles[0].dataset.col

  // start the loop on the second tile ; i.e. assume row or col based on this first evidence
  for (let i = 1; i < tiles.length; i++) {
    if (tiles[i].dataset.row === zRow) {
      row++
    }
    if (tiles[i].dataset.col === zCol) {
      col++
    }
  }
  // spacelog(`row=${row} and tiles.length = ${tiles.length}`)

  let isRow = (row === tiles.length && col === 1)
  let isCol = (col === tiles.length && row === 1)

  // *** length > 1 is only needed on first word.
  //  && tiles.length > 1

  if ((isRow || isCol)) {

    // ** HERE'S Another PROBLEM. this should sort the word by tile order. but it assumes left to right or top to bottom. HMMM.
    if (isRow) {
      tiles.sort((a, b) => (parseInt(a.dataset.col) < parseInt(b.dataset.col)) ? 1 : -1)

    }
    else {
      tiles.sort((a, b) => (parseInt(a.dataset.row) < parseInt(b.dataset.row)) ? 1 : -1)
    }

    return true
  }
  else {
    // we are not in a line. unacceptable.
    return false
  }
}



/*
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
👕👕👕👕👕👕👕👕👕👕👕👕            dLA            👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
*/
/*     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
              --->> THE WORST PART OF THE CODE <---
  "DETERMINE LINEAR ADJACENCY" (the original name. it made sense then.)
            NOW SPLIT INTO ( AT LEAST! ) FOUR CONVENIENT FUNCTIONS!
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀      */
/*
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
      =================== THE CROSSES ====================
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 */
const checkTheCross_c = (tilesInRange, colIdx) => {
  let tilesToLeft = []
  let tilesToRight = []
  let currentColMin = 0
  let currentColMax = 0
  let potentialCrossWordTiles = []
  let crosswords = []
  let tempWord = ''
  let tempTiles = []
  let crosswordTiles = []

  tilesInRange.forEach((tile, index) => {
    // big loop
    if (!tile.dataset.inplay) { return }
    // reset the things.
    potentialCrossWordTiles.splice(0)
    currentColMin = parseInt(colIdx)
    currentColMax = parseInt(colIdx)
    tempWord = ''
    // crosswords.splice(0)

    // push the column tile, because it'll be included in the crossword, if one exists
    potentialCrossWordTiles.push(tile)

    // FIRSTLY THE LEFT SIDE

    tilesToLeft = tilesOnBoard.filter((t) =>
      ((parseInt(t.dataset.row) === parseInt(tile.dataset.row)) && (parseInt(t.dataset.col) < currentColMin)))
    tilesToLeft.sort((a, b) => (parseInt(a.dataset.col) < parseInt(b.dataset.col)) ? 1 : -1)

    // now to find any gaps, and stop(break) if we we find one
    if (tilesToLeft.length > 0) {
      for (let i = 0; i < tilesToLeft.length; i++) {
        if (!(parseInt(tilesToLeft[i].dataset.col) === currentColMin - 1)) { break }
        potentialCrossWordTiles.unshift(tilesToLeft[i])
        currentColMin -= 1
      }
    }

    //  SECONDLY THE RIGHT SIDE (the letter from the column(tilesInRange) is already in the cross)

    tilesToRight = tilesOnBoard.filter((t) =>
      ((parseInt(t.dataset.row) === parseInt(tile.dataset.row)) && (parseInt(t.dataset.col) > currentColMax)))
    tilesToRight.sort((a, b) => (parseInt(a.dataset.col) > parseInt(b.dataset.col)) ? 1 : -1)

    // now to find any gaps, and stop(break) if we we find one
    if (tilesToRight.length > 0) {
      for (let i = 0; i < tilesToRight.length; i++) {
        if (parseInt(tilesToRight[i].dataset.col) != (parseInt(currentColMax) + 1)) {
          break
        }
        potentialCrossWordTiles.push(tilesToRight[i])
        currentColMax += 1
      }
    }


    // BOTH SIDES ARE READ. STORE THE WORD.

    potentialCrossWordTiles.forEach((tile, idx) => {
      // spacelog(`right pass ${index}: tile[${idx}] = ${tile.dataset.letter}`)
      tempWord += tile.dataset.letter
      tempTiles.push(tile)
    })

    crosswords.push(tempWord)
    crosswordTiles.push(tempTiles)

    if (index === tilesInRange.length - 1) {
      potentialCrossWordTiles.forEach((t, i) => {
        currentCrossWordTiles.push(t)
        let cross = []
        cross.push(t.dataset.letter)
      })
    }
    // here endeth the big loop
  })

  // HAVING THE WORD(S) AND TILES LOCALLY, PUSH THEM TO THE MODULE-LEVEL STORAGE
  // is currentWordTiles just for scoring
  // and currentCrosswords just for dictionary purposes?


  crosswords.forEach(word => {
    if (word.length > 1) {
      currentCrossWords.push(word)
      // spacelog(word)
    }
  })
  crosswordTiles.forEach(tiles => {
    if (tiles.length > 1) {
      tiles.forEach(tile => {
        if (currentWordTiles.indexOf(tile) < 0) {
          currentWordTiles.push(tile)
        }
      })
    }
  })
} // end checkTheCross_c


// 👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 

const checkTheCross_r = (tilesInRange, rowIdx) => {
  let tilesToTop = []
  let tilesToBottom = []
  let currentRowMin = 0
  let currentRowMax = 0
  let potentialCrossWordTiles = []
  let crosswords = []
  let tempWord = ''
  let tempTiles = []
  let crosswordTiles = []

  tilesInRange.forEach((tile, index) => {
    // big loop
    if (!tile.dataset.inplay) { return }

    // reset the things.
    potentialCrossWordTiles.splice(0)
    currentRowMin = parseInt(rowIdx)
    currentRowMax = parseInt(rowIdx)
    tempWord = ''
    // crosswords.splice(0)

    // push the row tile, because it'll be included in the crossword, if one exists
    potentialCrossWordTiles.push(tile)

    // FIRSTLY THE TOP SIDE

    tilesToTop = tilesOnBoard.filter((t) =>
      ((parseInt(t.dataset.col) === parseInt(tile.dataset.col)) && (parseInt(t.dataset.row) < currentRowMin)))
    tilesToTop.sort((a, b) => (parseInt(a.dataset.row) < parseInt(b.dataset.row)) ? 1 : -1)

    // now to find any gaps, and stop(break) if we we find one
    if (tilesToTop.length > 0) {
      for (let i = 0; i < tilesToTop.length; i++) {
        if (!(parseInt(tilesToTop[i].dataset.row) === currentRowMin - 1)) { break }
        potentialCrossWordTiles.unshift(tilesToTop[i])
        currentRowMin -= 1
      }
    }

    //  SECONDLY THE BOTTOM SIDE (the letter from the column(tilesInRange) is already in the cross)

    tilesToBottom = tilesOnBoard.filter((t) =>
      ((parseInt(t.dataset.col) === parseInt(tile.dataset.col)) && (parseInt(t.dataset.row) > currentRowMax)))
    tilesToBottom.sort((a, b) => (parseInt(a.dataset.row) > parseInt(b.dataset.row)) ? 1 : -1)

    // now to find any gaps, and stop(break) if we we find one
    if (tilesToBottom.length > 0) {
      for (let i = 0; i < tilesToBottom.length; i++) {
        if (parseInt(tilesToBottom[i].dataset.row) != (parseInt(currentRowMax) + 1)) {
          break
        }
        potentialCrossWordTiles.push(tilesToBottom[i])
        currentRowMax += 1
      }
    }


    // BOTH SIDES ARE READ. STORE THE WORD.

    potentialCrossWordTiles.forEach((tile, idx) => {
      // spacelog(`bottom pass ${index}: tile[${idx}] = ${tile.dataset.letter}`)
      tempWord += tile.dataset.letter
      tempTiles.push(tile)
    })

    crosswords.push(tempWord)
    crosswordTiles.push(tempTiles)

    if (index === tilesInRange.length - 1) {
      potentialCrossWordTiles.forEach((t, i) => {
        currentCrossWordTiles.push(t)
        let cross = []
        cross.push(t.dataset.letter)
      })
    }
    // here endeth the big loop
  })

  crosswords.forEach(word => {
    if (word.length > 1) {
      currentCrossWords.push(word)
      // spacelog(word)
    }
  })
  crosswordTiles.forEach(tiles => {
    if (tiles.length > 1) {
      tiles.forEach(tile => {
        if (currentWordTiles.indexOf(tile) < 0) {
          currentWordTiles.push(tile)
        }
      })
    }
  })

}

/*
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
            =================== THE ROWS ====================
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
*/
const theRowOutsiders = (row, minCol, maxCol) => {

  let rowTiles = []
  if (tilesOnBoard.length > 0) {

    // ======= TO THE LEFT ========
    // check on-board pieces to left
    let tilesToLeft = tilesOnBoard.filter((tile) => ((tile.dataset.row === row) && (tile.dataset.col < minCol)))

    // sort the tilesToLeft array backwards ... why? so index 0 is the right-most tile, and moving left up the indexes
    tilesToLeft.sort((a, b) => (parseInt(a.dataset.col) < parseInt(b.dataset.col)) ? 1 : -1)

    // does minCol - 1 (etc) exist, up to a gap?
    if (tilesToLeft.length > 0) {
      for (let i = 0; i < tilesToLeft.length; i++) {
        if (!(parseInt(tilesToLeft[i].dataset.col) === minCol - 1)) { break }
        rowTiles.unshift(tilesToLeft[i])
        minCol -= 1
      }
      if (rowTiles.length > 0) {
        rowTiles.sort((a, b) => (parseInt(a.dataset.col) < parseInt(b.dataset.col)) ? 1 : -1)
      }

      rowTiles.forEach(letter => {
        currentWordTiles.unshift(letter)
        currentWord.unshift(letter.dataset.letter)
      })
      // spacelog(`currentWord after left: ${currentWord.join('')}`)

    }

    // ======= TO THE RIGHT ========
    // check on-board pieces to right
    let tilesToRight = tilesOnBoard.filter((tile) => ((tile.dataset.row === row) && (tile.dataset.col > maxCol)))
    // sort this array forward
    tilesToRight.sort((a, b) => (parseInt(a.dataset.col) > parseInt(b.dataset.col)) ? 1 : -1)
    // tilesToRight.forEach((tile, index) => {
    //   spacelog(`right[${index}] = ${tile.dataset.letter}`)
    // })

    // does maxCol + 1 etc exist?
    if (tilesToRight.length > 0) {
      for (let i = 0; i < tilesToRight.length; i++) {
        if (!(parseInt(tilesToRight[i].dataset.col) === maxCol + 1)) { break }
        rowTiles.push(tilesToRight[i])
        maxCol += 1
      }
      if (rowTiles.length > 0) {
        rowTiles.sort((a, b) => (parseInt(a.dataset.col) > parseInt(b.dataset.col)) ? 1 : -1)
      }
      rowTiles.forEach(letter => {
        currentWordTiles.push(letter)
        currentWord.push(letter.dataset.letter)
      })
      // spacelog(`currentWord after right: ${currentWord.join('')}`)
    }

  }

  return rowTiles
}

/*
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
            =================== THE COLUMNS ====================
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
*/
const theColumnOutsiders = (col, minRow, maxRow) => {

  let colTiles = []
  if (tilesOnBoard.length > 0) {

    // ======= TO THE TOP ========
    // check on-board pieces to left
    // spacelog('TOP')
    let tilesToTop = tilesOnBoard.filter((tile) => ((tile.dataset.col === col) && (tile.dataset.row < minRow)))

    // sort the tilesToTop array backwards ... why? so index 0 is the right-most tile, and moving Top up the indexes
    tilesToTop.sort((a, b) => (parseInt(a.dataset.row) < parseInt(b.dataset.row)) ? 1 : -1)

    // does minCol - 1 etc exist?
    if (tilesToTop.length > 0) {
      for (let i = 0; i < tilesToTop.length; i++) {
        if (!(parseInt(tilesToTop[i].dataset.row) === minRow - 1)) { break }
        colTiles.unshift(tilesToTop[i])
        minRow -= 1
      }
      if (colTiles.length > 0) {
        colTiles.sort((a, b) => (parseInt(a.dataset.row) < parseInt(b.dataset.row)) ? 1 : -1)
      }
      colTiles.forEach(letter => {
        currentWordTiles.unshift(letter)
        currentWord.unshift(letter.dataset.letter)
      })
      // spacelog(`currentWord after Top: ${currentWord.join('')}`)

    }

  }

  // ======= TO THE BOTTOM ========
  let tilesToBottom = tilesOnBoard.filter((tile) => ((tile.dataset.col === col) && (tile.dataset.row > maxRow)))
  tilesToBottom.sort((a, b) => (parseInt(a.dataset.row) > parseInt(b.dataset.row)) ? 1 : -1)
  tilesToBottom.forEach((tile, index) => {
  })

  // does maxCol + 1 etc exist?
  if (tilesToBottom.length > 0) {
    for (let i = 0; i < tilesToBottom.length; i++) {
      if (!(parseInt(tilesToBottom[i].dataset.row) === maxRow + 1)) { break }
      colTiles.push(tilesToBottom[i])
      maxRow += 1
    }
    if (colTiles.length > 0) {
      colTiles.sort((a, b) => (parseInt(a.dataset.row) > parseInt(b.dataset.row)) ? 1 : -1)
    }
    colTiles.forEach(letter => {
      currentWordTiles.push(letter)
      currentWord.push(letter.dataset.letter)
    })
    // spacelog(`currentWord after Bottom: ${currentWord.join('')}`)
  }

  return colTiles
}

// 👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
const isTheInPlayPartCongruent = (isRow, idx, min, max) => {
  const param1 = isRow ? 'data-row' : 'data-col'
  const param2 = isRow ? 'data-col' : 'data-row'
  for (let i = min; i <= max; i++) {
    if (document.querySelector(`.square${`[${param1}="${idx}"]`}[${param2}="${i}"]`).childNodes.length === 0) {
      spacelog('nope')
      return false
    }
  }
  return true
}



// 👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
// ======= THE CENTER (BETWEEN minCol/Row and maxCol/Row, i.e. inside the newly played tiles) ========
// 👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
const theCenter = (rowcol, isRow, min, max) => {
  let row, col = 0
  let selector, crossSelector = ''
  if (isRow) {
    row = rowcol
    selector = 'data-row'
    crossSelector = 'data-col'
  }
  else {
    col = rowcol
    selector = 'data-col'
    crossSelector = 'data-row'
  }

  const tiles = []

  // find all tiles having data-row=${row} and data-col in range minCol -> maxCol and push these tiles to an array
  for (let i = min; i <= max; i++) {
    const tilesInRange = document.querySelectorAll(`.tile[${crossSelector}="${i}"][${selector}="${rowcol}"]`)
    tilesInRange.forEach(t => {
      tiles.push(t)
    })
  }
  if (tiles.length > 0) {
    if (isRow) {
      tiles.sort((a, b) => (parseInt(a.dataset.col) > parseInt(b.dataset.col)) ? 1 : -1)
    }
    else {
      tiles.sort((a, b) => (parseInt(a.dataset.row) > parseInt(b.dataset.row)) ? 1 : -1)
    }
  }
  tiles.forEach(letter => {
    currentWordTiles.push(letter)
    currentWord.push(letter.dataset.letter)
  })

  // this return has no game function. it could be logged. it is unnecessary.
  return tiles
}
// END theCENTER()

// 👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
const singleTilePlayed = (tiles = tilesInPlay) => {
  checkTheCross_c([...tiles], tiles[0].dataset.col)
  checkTheCross_r([...tiles], tiles[0].dataset.row)
  return true
}

// 👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
const determineLinearAdjacency = (tiles = tilesInPlay) => {
  let isRow
  let row = tiles[0].dataset.row
  let col = tiles[0].dataset.col
  let colNums = []
  let rowNums = []
  let currWord = ''

  tiles.forEach((tile) => {
    colNums.push(tile.dataset.col)
    rowNums.push(tile.dataset.row)
  })
  let minCol = Math.min(...colNums)
  let maxCol = Math.max(...colNums)
  let minRow = Math.min(...rowNums)
  let maxRow = Math.max(...rowNums)

  // single-tile play takes a different branch. if other word-storage (etc) branching needs to be done, add here
  if (tiles.length === 1) {
    singleTilePlayed(tiles)
    return true
  }
  else {
    isRow = tiles[0].dataset.row === tiles[1].dataset.row ? true : false //otherwise... it's a column
  }

  if (!isTheInPlayPartCongruent(
    isRow,
    isRow ? row : col,
    isRow ? minCol : minRow,
    isRow ? maxCol : minRow
  )) {
    return false
  }

  // if we reached here, we have a congruent set of tiles in a row or a column
  // the return from theCenter is unnecessary. theCenter (and theOutsider) writes to currentWordTiles (module-var)
  let centerTiles = theCenter(isRow ? row : col, isRow, isRow ? minCol : minRow, isRow ? maxCol : maxRow)
  if (isRow) {
    theRowOutsiders(row, minCol, maxCol)
    currentWordTiles.forEach(w => {
      currWord += w.dataset.letter
    })
    checkTheCross_r(centerTiles, row)

  }
  else {
    theColumnOutsiders(col, minRow, maxRow)
    currentWordTiles.forEach(w => {
      currWord += w.dataset.letter
    })
    checkTheCross_c(centerTiles, col)
  }

  spacelog(`c currWord after center & row/col business grepped = ${currWord}`)

  return true


} // end dLA


/*
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
👕👕👕👕👕👕👕👕👕👕👕👕          END OF dLA            👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
*/



/*
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
👕👕👕👕👕👕👕👕👕👕👕👕       DRAG EVENTS              👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕👕 
*/
// =========== DRAG START EVENT =============
function dragStartHandler(e) {
  this.style.opacity = '0.4';
  srcTile = e.target;
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

  // if there's anything in this square, just ... don't
  if (this.childNodes.length > 0) return

  this.replaceChildren(srcTile) // this seems better
  // this.innerHTML = e.dataTransfer.getData('text/html'); //than this
  // }

  this.classList.remove('over');

  // ------ set custom attributes/classes of tiles -------
  // allegedly this way of using .dataset is a problem pre-IE11
  srcTile.dataset.col = this.dataset.col
  srcTile.dataset.row = this.dataset.row

  // only add to tilesInPlay if it's being dragged from the tray -- i.e. if it's not already in play
  if (tilesInPlay.indexOf(srcTile) < 0) {
    tilesInPlay.push(srcTile)
    srcTile.setAttribute('data-inplay', 'true')
  }

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

const switchPlayers = (nextPlayer = playerUp) => {
  if (nextPlayer === 'player1') {
    playerUp = 'player1'
    player2Tray.style.filter = 'contrast(0)'
    player1Tray.style.filter = ''
  }
  else {
    playerUp = 'player2'
    player1Tray.style.filter = 'contrast(0)'
    player2Tray.style.filter = ''
  }
}


// =========== DOM LOADED EVENT ==============
window.addEventListener('DOMContentLoaded', async () => {

  // SHOW SPINNER ON BOARD...
  //  - or -
  // POP BETTER INSTRUCTIONS MODAL

  gameboardContainer.classList.add('loading');
  gameboard.classList.add('loading');



  spacelog('why is nothing happening')

  // ======== load the word list ==========
  await wordLists()
    .then(arrWordLists => {
      setTimeout(async () => {
        spacelog('4 seconds')
        gameboard.classList.remove('loading')
      }, 10000)

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

  // spacelog(`vw=${vw} & vh=${vh} & vmin=${vmin}`)
  // pickSomeRandomWords(100)
  // ======== Generate the board =========


  // REMOVE SPINNER (i assume)
  spacelog('await done')
  gameboardContainer.classList.remove('loading')
  gameboard.classList.remove('loading');


  loadBoard();

  // loadBoard() has called getOneRow() which calls getDiv(), where the .square class is added
  squares = document.querySelectorAll('.square');


  // ========= Fill the bagOfTiles ==========
  createAllTiles();
  // ------- and fill the player trays with tiles ---------
  drawTiles(player1Tray, 7)
  drawTiles(player2Tray, 7)

  switchPlayers()


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
  btnClearConsole.addEventListener('click', () => {
    spaceConsole.replaceChildren('')
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
  btnP1Swap.addEventListener('click', () => {
    if (playerUp === 'player1' && player2Tray.style.filter === 'contrast(0)') {
      const p1Tiles = [...document.querySelector('.player1-tray').querySelectorAll('.p1-tile')]
      console.log(typeof (p1Tiles));
      console.log('bot_dom len = ', bagOfTiles_DOM.childNodes.length);
      p1Tiles.forEach(t => {
        bagOfTiles_DOM.append(player1Tray.removeChild(t))

      })
      console.log('bot_dom len = ', bagOfTiles_DOM.childNodes.length);
      drawTiles(player1Tray, 7)
      setTimeout(() => {
        switchPlayers('player2')
      }, 2000)
    }
  })
  btnP2Swap.addEventListener('click', () => {
    if (playerUp === 'player2' && player1Tray.style.filter === 'contrast(0)') {
      const p2Tiles = [...document.querySelector('.player2-tray').querySelectorAll('.p2-tile')]
      console.log(typeof (p2Tiles));
      console.log('bot_dom len = ', bagOfTiles_DOM.childNodes.length);
      p2Tiles.forEach(t => {
        bagOfTiles_DOM.append(player2Tray.removeChild(t))

      })
      console.log('bot_dom len = ', bagOfTiles_DOM.childNodes.length);
      drawTiles(player2Tray, 7)
      setTimeout(() => {
        switchPlayers('player1')
      }, 2000)
    }
  })

  // btnTilesModal.addEventListener('click', () => {
  //   document.getElementById('modalTilesDistro').modal('show')
  // })

}) // end window.addEvenListener('load')



