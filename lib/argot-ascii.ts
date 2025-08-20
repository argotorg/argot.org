export const argotAscii = `                                                 
  ████████ ████████  ███████  ████████ ████████  
        ██ ██    ██  ██       ██    ██    ██     
  ████  ██ ██  ████  ██  ███  ██    ██    ██     
  ██    ██ ██  ██    ██   ██  ██    ██    ██     
  ██  ████ ██  ████  ███████  ████████    ██     
                                                 
`

// Flag to ensure it only logs once
let hasLogged = false

// Console log function to display the ASCII art
export const logArgotAscii = () => {
  if (!hasLogged) {
    console.log('%c' + argotAscii, 'font-family: monospace; font-size: 12px; line-height: 1;')
    hasLogged = true
  }
}
