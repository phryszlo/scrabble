import spacelog from "./spaceLog.js";

const allWordLists = []
const wordLists = async () => {

  let response = await fetch("./wordlists/json/2-letter-words.json")
  const twoLetterWords = await response.json();
  allWordLists.push(twoLetterWords)

  response = await fetch("./wordlists/json/3-letter-words.json")
  const threeLetterWords = await response.json()
  allWordLists.push(threeLetterWords)

  response = await fetch("./wordlists/json/4-letter-words.json")
  const fourLetterWords = await response.json();
  allWordLists.push(fourLetterWords)

  response = await fetch("./wordlists/json/5-letter-words.json")
  const fiveLetterWords = await response.json();
  allWordLists.push(fiveLetterWords)

  response = await fetch("./wordlists/json/6-letter-words.json")
  const sixLetterWords = await response.json();
  allWordLists.push(sixLetterWords)

  response = await fetch("./wordlists/json/7-letter-words.json")
  const sevenLetterWords = await response.json();
  allWordLists.push(sevenLetterWords)

  response = await fetch("./wordlists/json/8-letter-words.json")
  const eightLetterWords = await response.json();
  allWordLists.push(eightLetterWords)

  response = await fetch("./wordlists/json/9-letter-words.json")
  const nineLetterWords = await response.json();
  allWordLists.push(nineLetterWords)

  response = await fetch("./wordlists/json/10-letter-words.json")
  const tenLetterWords = await response.json();
  allWordLists.push(tenLetterWords)

  response = await fetch("./wordlists/json/11-letter-words.json")
  const elevenLetterWords = await response.json();
  allWordLists.push(elevenLetterWords)

  response = await fetch("./wordlists/json/12-letter-words.json")
  const twelveLetterWords = await response.json();
  allWordLists.push(twelveLetterWords)

  response = await fetch("./wordlists/json/13-letter-words.json")
  const thirteenLetterWords = await response.json();
  allWordLists.push(thirteenLetterWords)

  response = await fetch("./wordlists/json/14-letter-words.json")
  const fourteenLetterWords = await response.json();
  allWordLists.push(fourteenLetterWords)

  response = await fetch("./wordlists/json/15-letter-words.json")
  const fifteenLetterWords = await response.json();
  allWordLists.push(fifteenLetterWords)


  return allWordLists
}

export default wordLists