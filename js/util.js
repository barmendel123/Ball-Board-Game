function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

function drawNum() {
    var randIdx = getRandomInt(0, gNums.length-1)
    var res = gNums[randIdx]
    gNums.splice(randIdx, 1)
    return res
}

function resetNums() {
    gNums = []
    for (var i = 1; i <= gTableSize*gTableSize ; i++) {
        gNums.push(i)
    }
}

function printBoard(board){
    var printedBoard = []
    for (var i = 0; i < board.length; i++) {
        var line = []
        for (var j = 0; j < board[i].length; j++) {
            line.push( board[i][j].value)
        }
        printedBoard.push(line)
    }
    console.table(printedBoard)
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
    //The maximum is inclusive and the minimum is inclusive
}
