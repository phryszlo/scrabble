
const determineLinearAdjacency = (tiles = tilesInPlay) => {
  // if tiles.length === 1, row or col is determined by something else. I'm not prepared to deal with it yet.
  // maybe we would be reaching a different fn()?


  // row or col has already been verified, so comparing two tiles should be sufficient
  let isRow = tiles[0].dataset.row === tiles[1].dataset.row ? true : false //otherwise it's a column


  // ==================================================================
  //          =================== ROWS ====================
  // ==================================================================

  if (isRow) {
    spacelog('=======ROWS===========')

    let row = tiles[0].dataset.row
    let colNums = []
    tiles.forEach((tile) => {
      colNums.push(tile.dataset.col)
    })
    let minCol = Math.min(...colNums)
    let maxCol = Math.max(...colNums)


    let word = []

    // ======= THE CENTER (BETWEEN minCol and maxCol, i.e. inside the newly played tiles) ========

    // find all tiles having data-row=${row} and data-col in range minCol -> maxCol and push these tiles to an array
    for (let i = minCol; i <= maxCol; i++) {
      const sq = document.querySelectorAll(`.tile[data-col="${i}"][data-row="${row}"]`)
      sq.forEach(s => {
        word.push(s)
        // spacelog(`data-col = ${s.classList}`)
      })
    }
    if (word.length > 0) {
      word.sort((a, b) => (parseInt(a.dataset.col) > parseInt(b.dataset.col)) ? 1 : -1)
    }
    word.forEach(letter => {
      currentWord.push(letter.dataset.letter)
    })
    spacelog(`currentWord after center portion: ${currentWord.join('')}`)




    word.splice(0)
    if (tilesOnBoard.length > 0) {

      // ======= TO THE LEFT ========
      // check on-board pieces to left
      spacelog('LEFT')
      let tilesToLeft = tilesOnBoard.filter((tile) => ((tile.dataset.row === row) && (tile.dataset.col < minCol)))

      // sort the tilesToLeft array backwards ... why? so index 0 is the right-most tile, and moving left up the indexes
      tilesToLeft.sort((a, b) => (parseInt(a.dataset.col) < parseInt(b.dataset.col)) ? 1 : -1)

      // does minCol - 1 etc exist?
      if (tilesToLeft.length > 0) {
        for (let i = 0; i < tilesToLeft.length; i++) {
          if (!(parseInt(tilesToLeft[i].dataset.col) === minCol - 1)) { break }
          word.unshift(tilesToLeft[i])
          minCol -= 1
        }
        if (word.length > 0) {
          word.sort((a, b) => (parseInt(a.dataset.col) < parseInt(b.dataset.col)) ? 1 : -1)
        }
        word.forEach(letter => {
          currentWord.unshift(letter.dataset.letter)
        })
        spacelog(`currentWord after left: ${currentWord.join('')}`)

      }

      // ======= TO THE RIGHT ========
      // check on-board pieces to right
      spacelog('RIGHT')
      let tilesToRight = tilesOnBoard.filter((tile) => ((tile.dataset.row === row) && (tile.dataset.col > maxCol)))
      // sort this array forward
      tilesToRight.sort((a, b) => (parseInt(a.dataset.col) > parseInt(b.dataset.col)) ? 1 : -1)
      tilesToRight.forEach((tile, index) => {
        spacelog(`right[${index}] = ${tile.dataset.letter}`)
      })

      // does maxCol + 1 etc exist?
      if (tilesToRight.length > 0) {
        for (let i = 0; i < tilesToRight.length; i++) {
          if (!(parseInt(tilesToRight[i].dataset.col) === maxCol + 1)) { break }
          word.push(tilesToRight[i])
          maxCol += 1
        }
        if (word.length > 0) {
          word.sort((a, b) => (parseInt(a.dataset.col) > parseInt(b.dataset.col)) ? 1 : -1)
        }
        word.forEach(letter => {
          currentWord.push(letter.dataset.letter)
        })
        spacelog(`currentWord after right: ${currentWord.join('')}`)
      }

    }

  }// end if (isRow)

  // ==================================================================
  //          =================== COLUMNS ====================
  // ==================================================================

  // else (isCol)

  else {
    spacelog('=======COLUMNS===========')
    let col = tiles[0].dataset.col
    let rowNums = []
    tiles.forEach((tile) => {
      rowNums.push(tile.dataset.row)
    })
    let minRow = Math.min(...rowNums)
    let maxRow = Math.max(...rowNums)


    let collie = []

    // ======= THE CENTER (BETWEEN minRow and maxRow, i.e. inside the newly played tiles) ========

    // find all tiles having data-row=${row} and data-Row in range minRow -> maxRow and push these tiles to an array
    for (let i = minRow; i <= maxRow; i++) {
      const sq = document.querySelectorAll(`.tile[data-row="${i}"][data-col="${col}"]`)
      sq.forEach(s => {
        collie.push(s)
        // spacelog(`data-row = ${s.classList}`)
      })
    }
    if (collie.length > 0) {
      collie.sort((a, b) => (parseInt(a.dataset.row) > parseInt(b.dataset.row)) ? 1 : -1)
    }
    collie.forEach(letter => {
      currentWord.push(letter.dataset.letter)
    })
    spacelog(`currentWord after center portion: ${currentWord.join('')}`)


    // NEXT UP: ADD ADJACENT EXISTING ON-BOARD TILES TO WORD


    collie.splice(0)
    if (tilesOnBoard.length > 0) {

      // ======= TO THE TOP ========
      // check on-board pieces to left
      spacelog('TOP')
      let tilesToTop = tilesOnBoard.filter((tile) => ((tile.dataset.col === col) && (tile.dataset.row < minRow)))

      // sort the tilesToTop array backwards ... why? so index 0 is the right-most tile, and moving Top up the indexes
      tilesToTop.sort((a, b) => (parseInt(a.dataset.row) < parseInt(b.dataset.row)) ? 1 : -1)

      // does minCol - 1 etc exist?
      if (tilesToTop.length > 0) {
        for (let i = 0; i < tilesToTop.length; i++) {
          if (!(parseInt(tilesToTop[i].dataset.row) === minRow - 1)) { break }
          collie.unshift(tilesToTop[i])
          minRow -= 1
        }
        if (collie.length > 0) {
          collie.sort((a, b) => (parseInt(a.dataset.row) < parseInt(b.dataset.row)) ? 1 : -1)
        }
        collie.forEach(letter => {
          currentWord.unshift(letter.dataset.letter)
        })
        spacelog(`currentWord after Top: ${currentWord.join('')}`)

      }

    }

    // ======= TO THE BOTTOM ========
    // check on-board pieces to BOTTOM
    spacelog('BOTTOM')
    let tilesToBottom = tilesOnBoard.filter((tile) => ((tile.dataset.col === col) && (tile.dataset.row > maxRow)))
    // sort this array forward
    tilesToBottom.sort((a, b) => (parseInt(a.dataset.row) > parseInt(b.dataset.row)) ? 1 : -1)
    tilesToBottom.forEach((tile, index) => {
      spacelog(`Bottom[${index}] = ${tile.dataset.letter}`)
    })

    // does maxCol + 1 etc exist?
    if (tilesToBottom.length > 0) {
      for (let i = 0; i < tilesToBottom.length; i++) {
        if (!(parseInt(tilesToBottom[i].dataset.row) === maxRow + 1)) { break }
        collie.push(tilesToBottom[i])
        maxRow += 1
      }
      if (collie.length > 0) {
        collie.sort((a, b) => (parseInt(a.dataset.row) > parseInt(b.dataset.row)) ? 1 : -1)
      }
      collie.forEach(letter => {
        currentWord.push(letter.dataset.letter)
      })
      spacelog(`currentWord after Bottom: ${currentWord.join('')}`)
    }
  }

  return true
}