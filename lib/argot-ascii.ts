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
    console.log(argotAscii)
    hasLogged = true
  }
}
