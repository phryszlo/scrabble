

const spaceConsole = document.querySelector('.console');

const spacelog = (message) => {
  console.log(message);
  spaceConsole.innerHTML += `${message}<br>`;
}

export default spacelog;

