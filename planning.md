
# building the board
### possibile solutions
---------------   

## bitwise  
four arrays (tws,dws,tls,dws):   
- const tws = [16513,0,0,0,0,0,0,16513,0,0,0,0,0,0,16513]
- const dws = [0,8194,4100,2056,1040,0,0,128,0,0,1040,2056,4100,8194,0]
- const tls = [0,544,0,0,0,8738,0,0,0,8738,0,0,0,544,0]
- const dls = [2056,0,320,16513,0,0,4420,2056,4420,0,0,16513,320,0,2056]


- ## row-by-row processing   
  - first row: each array, idx 0
    - call fn() with arg indicating square-type, e.g. twsSquare
      - return .... no i don't like this way. move on.
    - call fn() with all four arr[0] vals
      - turn each into binary.toString(2) and return an array of div elements of appropriate type 
        - e.g. row1 return would be:
          - [twsDiv, div, div, dlsDiv, div, div, div, twsDiv, div, div, div, dlsDiv, div, div, twsDiv]
        - so the return array would be init with 15 divs, or 15 nulls or whatever and then use splice to overwrite slots as needed
        - the return is a single complete row