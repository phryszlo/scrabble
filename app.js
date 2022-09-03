
import spacelog from "./spaceLog.js"
import navbar from "./navbar.js"


window.addEventListener('load', async () => {
  spacelog(`
  <p style='color: fuchsia; margin: 0; padding: 0;'>
    welcome to the dtp.gamebox which needs a better name
  </p>
  <p style='color: limegreen; margin: 0; padding: 0;'>
    background art: Lost Planet by <a href='https://www.deviantart.com/ahmeddonia' target='__blank'>ahmeddonia</a> 
    on deviantart.com 
  </p>
  login: (there is no login)`)

  document.querySelector('.navbar-placeholder').innerHTML = navbar


}) // end window.addEvenListener('load')

