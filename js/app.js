var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/glue.png"'

var gBoard;
var gGamerPos;
var gCollectorBallsCount
var gBallsAppears = 2
var gameInterval
var gamerIsStuck
var gameGlueInterval
var gCurrGlueOnBoard
var gGlueTimeout


function startGame(){
    
    gCollectorBallsCount = 0
    gBallsAppears = 2
    gameGlueInterval = setInterval(renderGlue, 5000)
    gameInterval = setInterval(ballRandom, 2000)
    initGame()
}

function stopGame(){
    clearInterval(gameInterval)
    clearInterval(gameGlueInterval)
    gCollectorBallsCount = 0
    gBallsAppears = 2
    var elCounterBalls = document.querySelector('.counter')
    elCounterBalls.innerText = `Balls Collected: ${gCollectorBallsCount}`
    //initGame()
}

function initGame() {
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderBoard(gBoard);
    getEmptyCells(gBoard)
}


function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)
    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null};

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }
            //add
            if((i === 0 || i === board.length-1) && j === board.length/2 ) cell.type = FLOOR;
            if(i === 5 &&  board[i].length/2) cell.type = FLOOR;

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Balls (currently randomly chosen positions)
    board[3][8].gameElement = BALL;
    board[7][4].gameElement = BALL;
    gamerIsStuck = false
   
    return board;
}

// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            cellClass += ( currCell.type === FLOOR )? ' floor' : ' wall'
            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`;
           
            // TODO - change to switch case statement
            switch (currCell.gameElement) {
                case GAMER:
                    strHTML += GAMER_IMG
                    break;
                case BALL:
                    strHTML += BALL_IMG
                    break;
                case GLUE:
                    strHTML += GLUE_IMG
                    break;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location

function moveTo(i, j) {
    
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);

    if (gamerIsStuck) return

    // add passages
    if(i === -1) i = gBoard.length -1
    else if(i === gBoard.length) i = 0
    else if(j === -1) j= gBoard[0].length -1
    else if(j === gBoard[0].length) j = 0

    var targetCell = gBoard[i][j];
    if (targetCell.type === WALL) return;

    // Calculate distance to make sure we are moving to a neighbor cell
    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        

        if (targetCell.gameElement === BALL) {
           
            console.log('Collecting!');
            playSound()
            gCollectorBallsCount++
            gBallsAppears--
            
            console.log('Collected ' + gCollectorBallsCount +  ' Balls ' );
            var elCounterBalls = document.querySelector('.counter')
            elCounterBalls.innerText = `Balls Collected: ${gCollectorBallsCount}`

        }
        if (targetCell.gameElement === GLUE) {
            gamerIsStuck = true
            clearTimeout(gGlueTimeout)
            setTimeout(freeGamerFromGlue, 3000)
        }
        if(gBallsAppears === 0){
            console.log('Game over');
            elCounterBalls.innerHTML = `Game Over!!`
            clearInterval(gameInterval)
            clearInterval(gameGlueInterval)
        }
            
        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);
        // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
    }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;
    }
}


function getEmptyCells() {
    var emptyCells = []
    for (var i = 1; i < gBoard.length-1; i++) {
        for (var j = 1; j < gBoard[0].length-1; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.gameElement){
                 emptyCells.push(currCell)
            }
        }
    }
    return emptyCells
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}


function playSound() {
    var sound = new Audio("sound/pop.mp3");
    sound.play();
}



function renderGlue(){
    var emptyCells = getEmptyCells()
    if (emptyCells.length === 0) return
    var randCellIdx = getRandomInt(0, emptyCells.length-1)

    //Update Model
    gCurrGlueOnBoard = emptyCells[randCellIdx]
    emptyCells[randCellIdx].gameElement = GLUE
    // setTimeout(deleteGlue, 3000)
    gGlueTimeout =  setTimeout(deleteGlue, 3000)

    //Update DOM
    renderBoard(gBoard) 
}

function deleteGlue() {
    //Update Model
    gCurrGlueOnBoard.gameElement = null
    //Update DOM
    renderBoard(gBoard)     
}

function freeGamerFromGlue() {
    gamerIsStuck = false
}

function ballRandom(){
    var row = getRandomInt(1,8)
    var col = getRandomInt(1,10)

    if(!gBoard[row][col].gameElement){
        //update model
        gBoard[row][col].gameElement = BALL
        gBallsAppears++
        //update DOM
        renderBoard(gBoard)
    }
}



