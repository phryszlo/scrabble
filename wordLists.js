const parseWordLists = () => {
  fetch("./wordlists/json/2-letter-words.json")
    .then(response => {
      return response.json();
    })
    .then(
      data =>
          JSON.parse(
            JSON.stringify(data.twoLetterWords)
          )
    ).then(
      data => {return data}
    )
}

// const wordLists = parseWordLists()

const wordLists = async () => {
  const response = await fetch("./wordlists/json/2-letter-words.json")
  const twoLetterWords = await response.json();
  return twoLetterWords
}


export default wordLists