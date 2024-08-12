// Step-1: convert the message to binary
const strToBinary = (message: string) => {
  //initialise the variable to hold the binary message
  let binaryMessage: string = "";
  //loop through every sharacter in the string
  for (const char of message) {
    //use javascripts built in  
    const binChar = char.charCodeAt(0).toString(2)
    binaryMessage += binChar
  }
  return binaryMessage
}

export default strToBinary

