function check(row, column) {
    if (column >= 0 && row >= 0 && column < COLUMNS && row < ROWS) //COLUMNS and ROWS have value 10, the parameter in charge must be less then 10
        return MATRIX[row][column];
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