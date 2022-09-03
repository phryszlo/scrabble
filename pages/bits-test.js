

let tws = [16513, 0, 0, 0, 0, 0, 0, 16513, 0, 0, 0, 0, 0, 0, 16513]

tws.forEach(num => {
  if (num != 0) {
    let binary = num.toString(2)

    for (let bit = 0; bit < binary.length; bit++) {
      if (binary[bit] === '1') console.log('TWS')
      else console.log('_');
    }
  }
  else {
    console.log('_ _ _ _ _ _ _ _ _ _ _ _ _ _ _');
  }
})