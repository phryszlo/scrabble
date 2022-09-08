
import wordLists from "./wordLists.js"

const spaceConsole = document.querySelector('.console');

let allWordLists = [];
const fullWordList = []

const log = (message) => {
  console.log(message);
  spaceConsole.innerHTML += `${message}<br>`;
}

let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
log(`window innerWidth: ${window.innerWidth}, document.documentElement.clientWidth: ${vw}`);

let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
log(`window innerHeight: ${window.innerHeight}, document.documentElement.clientHeight: ${vh}`);


let randy_w = Math.random() * vw;
let randy_h = Math.random() * vh;


const spitWords = (letters = 0) => {
  // length = letters === 0 ? random-length
}








window.addEventListener('DOMContentLoaded', async () => {
  await wordLists()
    .then(arrWordLists => {
      allWordLists = arrWordLists
      
      // wordLists.js returned an array of the response.json() of each .json file
      arrWordLists.forEach(async (list, idx) => {

        // forEach {word: value} object in the list (: array)
        Object.values(list)[0].forEach(async (objWord, i) => {

          fullWordList.push(objWord.word)
        })
      })
    })
  log(`'done': fullWordList contains ${fullWordList.length} words. fullWordList[6000] = ${fullWordList[6000]}`)
  log(`fullWordList[11999] = ${fullWordList[11999]}`)

})

