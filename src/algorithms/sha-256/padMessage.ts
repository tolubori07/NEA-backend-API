//step-2: Pad the message 
const padMessage = (binaryMessage: string) => {
  binaryMessage += '1' //appending a 1 bit
  while (binaryMessage.length != 448 % 512) {
    binaryMessage += '0' //appending 0 bits until its 64 bits lower than a multiple of 64
  }
  //convert the length of the binary message to binary
  const binaryLength = binaryMessage.length.toString(2)
  //append it to the binaryMessage
  binaryMessage += binaryLength
  return binaryMessage
}

export default padMessage
