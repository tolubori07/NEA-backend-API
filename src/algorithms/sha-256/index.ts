import compression from "./compressionFunction"
import padMessage from "./padMessage"
import strToBinary from "./strToBin"

//step-3: Initialise the hash values 
const sign = (message: string) => { 
  const binaryMessage = strToBinary(message);
  const paddedBinaryMessage = padMessage(binaryMessage);
  
  // Reinitialize hash values every time the sign function is called
  const hashValues = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const processedMessage = compression(paddedBinaryMessage, hashValues);  
  
  let hash = "";
  for(let value of processedMessage){ 
    hash += value.toString(16).padStart(8, '0');
  }
  return hash;
};

//verify
 const verify = (message: string, toCompare: string) => {
 const crypt = sign(message) 
  // Compare the computed hash with the given hash
  return crypt === toCompare; 
};

const sha256 = { 
verify: verify,
sign: sign
}

export default sha256
