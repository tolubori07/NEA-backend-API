//step-4: compression function: process the message in 512-bit blocks 
const compression = (binaryMessage:string,hashValues) => {
  //process in 512 bit blocks
  for(let i:number = 0; i < binaryMessage.length; i+=512){ 
    const block = binaryMessage.slice(i,i+512)
    //message schedule
    const words = new Array(16) 
    for (let j = 0; j < words.length; j++) {
      words[j] = parseInt(block.slice(j * 32, (j + 1) * 32), 2)
    }
    //initialise hash variables to bes used in compression function 
    let [a,b,c,d,e,f,g,h] = hashValues
    //perform 64 rounds of bitwise operations 
    for(let j = 0; j<64; j++){ 
      const temp1 = h + (e ^ f ^ g) + words[j%16]
      const temp2 = (a ^ b ^ c) + d 
      h = g;
      g = f;
      f = e; 
      e = (d + temp1) >>>0;
      d = c;
      c = b; 
      b = a;
      a = (temp1 + temp2) >>> 0; 
    }
    //update the hash values 
    hashValues[0] = (hashValues[0] +  a) >>> 0; 
    hashValues[1] = (hashValues[1] +  b) >>> 0;
    hashValues[2] = (hashValues[2] +  c) >>> 0;
    hashValues[3] = (hashValues[3] +  d) >>> 0;
    hashValues[4] = (hashValues[4] +  e) >>> 0;
    hashValues[5] = (hashValues[5] +  f) >>> 0;
    hashValues[6] = (hashValues[6] +  g) >>> 0;
    hashValues[7] = (hashValues[7] +  h) >>> 0;
  }
  return hashValues
}

export default compression
