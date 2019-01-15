const ROWS = 10; //10x10 sized MATRIX
const COLUMNS = 10;
let bombs;
let remaining;
let revealed; //variables of the statusFIELDs

const MATRIX = new Array(ROWS); //Arrays for FIELDs, GRAPHICs and the tile 
const GRAPHIC = new Array(ROWS); //New Array because we need an array with a particular amount of elements
const FIELD = new Array(ROWS);
for (let i = 0; i < MATRIX.length; i++) { //creates the different levels of our MATRIX
  MATRIX[i] = new Array(COLUMNS);
  GRAPHIC[i] = new Array(COLUMNS);
  FIELD[i] = new Array(COLUMNS)
}

let status = document.getElementById('state'); //"status" stores the reference/points to HTML Element Label 
status.addEventListener('click', init) //click event will be fires on mousedown, "click" fires the init function

init(); //first function of our code

function check(row, column) {
  if (column >= 0 && row >= 0 && column < COLUMNS && row < ROWS) //COLUMNS and ROWS have value 10, the parameter in charge must be less then 10
    return MATRIX[row][column];
}

function init() {
  bombs = 10;
  remaining = bombs; //remaining has the value of bombs
  revealed = 0;
  status.innerHTML = ('Open initial FIELDs my boy'); //writes text in html body
  /* 
   0 10 20 30 40 50.....90
   1 11 ..................
   2 12 ..................
   3 13 ..................
   4 14 ..................
   5 15 ..................
   6 16 ..................
   7 17 ..................
   8 18 ..................
   9 19 ................99
  */
  for (let row = 0; row < ROWS; row++) //we store PNG files in FIELD MATRIX
    for (let column = 0; column < COLUMNS; column++) {
      let index = row * COLUMNS + column; //index variable gets a value
      FIELD[row][column] = document.createElement('img'); //img -> tag
      FIELD[row][column].src = 'initial.png'; //take picture from assetfolder
      FIELD[row][column].style = 'position:absolute;height:30px; width: 30px'; //30px height und 30 px width. Absolute Position 
      FIELD[row][column].style.top = 200 + row * 30; //distance to top
      FIELD[row][column].style.left = 200 + column * 30; //distance to left
      FIELD[row][column].addEventListener('mousedown', click); // event "mousedown" fires function "click"
      FIELD[row][column].id = index; //every picture gets an ID -> suits MATRIX
      document.body.appendChild(FIELD[row][column]); //we add pictures to html body with unique ID
      GRAPHIC[row][column] = 'initial'; //we give the level GRAPHIC the string status initial
      MATRIX[row][column] = ''; //empty string assigned to MATRIX level
    }

  let buried = 0;
  while (buried < bombs) { //while schleife is looping as long "buried" got a less value then bombs 
    let column = Math.floor(Math.random() * COLUMNS); //Math.floor -> rounded value, //Math.random -> random number
    let row = Math.floor(Math.random() * ROWS); // Math.random returns integer from 0-9

    if (MATRIX[row][column] != 'bomb') { //choosen FIELD is not allowed to be bomb -> Bedingung
      MATRIX[row][column] = 'bomb'; //now we bury the bomb
      buried++; //increment variable buried
    }
  }
  //!!!!!!Game-Area is created and bombs are placed!!!!!!!!!!

  /* 
   Click on x FIELD and check all surounded FIELDs

    1 2 3
    4 x 6
    7 8 9  
  */
  for (let column = 0; column < COLUMNS; column++) //we store amount of surrounding bombs in 90 FIELDs. In the rest we store bombs
    for (let row = 0; row < ROWS; row++) {
      if (check(row, column) != 'bomb') {
        MATRIX[row][column] =
          ((check(row + 1, column) === 'bomb') | 0) +
          ((check(row + 1, column - 1) === 'bomb') | 0) +
          ((check(row + 1, column + 1) === 'bomb') | 0) +
          ((check(row - 1, column) === 'bomb') | 0) +
          ((check(row - 1, column - 1) === 'bomb') | 0) +
          ((check(row - 1, column + 1) === 'bomb') | 0) +
          ((check(row, column - 1) === 'bomb') | 0) +
          ((check(row, column + 1) === 'bomb') | 0);
      }
    }
}

function click(event) { //adding eventlistener
  let source = event.target; //getting HTML element with "target"
  let id = source.id; //ID will get assigned to this variabel
  let row = Math.floor(id / COLUMNS);
  let column = id % COLUMNS; //we store the rest/modulo

  if (event.which == 3) { //rightclick
    switch (GRAPHIC[row][column]) {
      case 'initial':
        FIELD[row][column].src = 'save.png'; //which png file should be used
        remaining--; //take one bomb from count
        GRAPHIC[row][column] = 'save'; //which state is represented
        break;
      case 'save':
        FIELD[row][column].src = 'surprise.png';
        remaining++;
        GRAPHIC[row][column] = 'surprise';
        break;
      case 'surprise':
        FIELD[row][column].src = 'initial.png';
        GRAPHIC[row][column] = 'initial';
        break;
    }
    event.preventDefault(); //dont open contextmenu
  }
  status.innerHTML = 'Übrige Bomben: ' + remaining; //Show remaining bombs in HTML

  if (event.which == 1 && GRAPHIC[row][column] != 'save') { //leftclick and status is not "save", but it can be "initial" and "surprise"
    if (MATRIX[row][column] == 'bomb') { //if it is a bomb then show all bombs
      for (let row = 0; row < ROWS; row++) //go again through 2 dimensional MATRIX
        for (let column = 0; column < COLUMNS; column++) {
          if (MATRIX[row][column] == 'bomb') { //show png bomb
            FIELD[row][column].src = 'bomb.png';
          }
          if (MATRIX[row][column] != 'bomb' && GRAPHIC[row][column] == 'save') { //wrong placed flags will be shown
            FIELD[row][column].src = 'displaced.png'; //displaced png will be shown
          }
        }
      status.innerHTML = 'Sorry Bro'; //show HTML lose text
    } else if (GRAPHIC[row][column] == 'initial') { //only initial can be clicked with leftclick
      reveal(row, column);
    }
  }

  if (revealed == ROWS * COLUMNS - bombs) {//if we revealed 90 FIELDs then -> Player won
    status.innerHTML = 'Won!'; //Show HTML Context
  }

}

function reveal(row, column) { //only do this function IF there is no bomb
  FIELD[row][column].src = MATRIX[row][column] + '.png'; //combine strings to get the different number PNGs

  if (MATRIX[row][column] != 'bomb' && GRAPHIC[row][column] == 'initial') { //increment revealed when no bomb is located and it is no special FIELD
    revealed++;
  }
  GRAPHIC[row][column] = MATRIX[row][column]; //store the same value for both MATRIX levels

  // 1 2  3  4
  // 5 6  x  8
  // 9 10 11 12

  if (MATRIX[row][column] == 0) { //if we click on x FIELD and no bombs are surrounding then do this fuck up
    if (column > 0 && GRAPHIC[row][column - 1] == 'initial') reveal(row, column - 1); //check again all FIELDs around x 
    if (column < (COLUMNS - 1) && GRAPHIC[row][column + 1] == 'initial') reveal(row, column + 1); //function which is recursive and checks always surrounding FIELDs
    if (row < (ROWS - 1) && GRAPHIC[row + 1][column] == 'initial') reveal(row + 1, column);
    if (row > 0 && GRAPHIC[row - 1][column] == 'initial') reveal(row - 1, column);
    if (column > 0 && row > 0 && GRAPHIC[row - 1][column - 1] == 'initial') reveal(row - 1, column - 1);
    if (column > 0 && row < (ROWS - 1) && GRAPHIC[row + 1][column - 1] == 'initial') reveal(row + 1, column - 1);
    if (column < (COLUMNS - 1) && row < (ROWS - 1) && GRAPHIC[row + 1][column + 1] == 'initial') reveal(row + 1, column + 1);
    if (column < (COLUMNS - 1) && row > 0 && GRAPHIC[row - 1][column + 1] == 'initial') reveal(row - 1, column + 1);
  }
}
