# Scrabble  *"wireframe"*
---------


Board   
----------------------  
grid 15x15

for loops for triple-word/double-word/double-letter etc   
squares   

example:  
```
let grid-cols, grid-rows = 15
for (let col = 1; col <= grid-cols; col++) {
  for (let row = 1; row <= grid-rows; row++) {
    if (row, col) in   
    [(1,1),(1,8),(1,15),(8,1),(8,15),(15,1),(15,8),(15,15)]   
    { this.square = tripleWordSquare }
    // ..etc..
  }
}
```

# Game Play   
---------
### opening  
draw a letter to see who goes first   
closest to 'a' goes first.   
return tiles to 'bag'   

each draw 7.   

---------
### tile distribution   
Scrabble tile letter distribution is as follows:

- A-9, B-2, C-2, D-4, E-12, F-2, G-3, H-2, I-9, J-1, K-1, L-4, M-2, N-6, O-8, P-2, Q-1, R-6, S-4, T-6, U-4, V-2, W-2, X-1, Y-2, Z-1 and Blanks-2.

- Total face point value is 187.
There are 225 squares on a Scrabble board.
Point value is as follows:

- (1 point)-A, E, I, O, U, L, N, S, T, R
(2 points)-D, G
(3 points)-B, C, M, P
(4 points)-F, H, V, W, Y
(5 points)-K
(8 points)- J, X
(10 points)-Q, Z

-----------
## Word Lists   
### Verifying words   

just for reference:   
[Official Scrabble Word Checker](https://scrabble.merriam.com/)   

I have downloaded .json files of each #-of-letters 2-15 possible words.   

These can be imported to arrays or maybe accessed directly(?).   

JSON.parse()




