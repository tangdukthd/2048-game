import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById('game-board')
const largestTile = document.getElementById('largest-tile')
const score = document.getElementById('score')

let reload = false
const arrInput = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s", "a", "d"]
let touchYStart = 0
let touchXStart = 0
let touchYEnd = 0
let touchXEnd = 0
let changeX = 0
let changeY = 0
let swipe = ''
let lt = 0
largestTile.innerText = `Largest tile: ${lt}`

const grid = new Grid(gameBoard)

grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()
function setupInput() {
    window.addEventListener("keydown", e => handleInput(e.key), { once: true})

    window.addEventListener('touchstart', e => {
        touchXStart = e.changedTouches[0].pageX
        touchYStart = e.changedTouches[0].pageY
    }, { once: true})
    window.addEventListener('touchend', e => {
        touchXEnd = e.changedTouches[0].pageX
        touchYEnd = e.changedTouches[0].pageY
        changeX = touchXEnd - touchXStart
        changeY = touchYEnd - touchYStart
        swipe = ''
        if(changeY > 80 && Math.abs(changeY) > Math.abs(changeX)) {
            swipe = 'ArrowDown'
        }
        if (changeY < -80 && Math.abs(changeY) > Math.abs(changeX)) {
            swipe = 'ArrowUp'
        }
        if(changeX > 80 && Math.abs(changeY) < Math.abs(changeX)) {
            swipe = 'ArrowRight'
        }
        if (changeX < -80 && Math.abs(changeY) < Math.abs(changeX)) {
            swipe = 'ArrowLeft'
        }
        handleInput(swipe)
    }, { once: true})

    largestTile.innerText = `Largest tile: ${grid.largestTile()}`
    score.innerText = `Score: ${grid.score()}`
}
async function handleInput(input) {
    if(arrInput.some(element => element === input)) {
        switch(input) {
            case "ArrowUp":
            case "w":
                if(!canMoveUp()) {
                    setupInput()
                    return
                }
                await moveUp()
                break
            case "ArrowDown":
            case "s":
                if(!canMoveDown()) {
                    setupInput()
                    return
                }
                await moveDown()
                break
            case "ArrowLeft":
            case "a":
                if(!canMoveLeft()) {
                    setupInput()
                    return
                }
                await moveLeft()
                break
            case "ArrowRight":
            case "d":
                if(!canMoveRight()) {
                    setupInput()
                    return
                }
                await moveRight()
                break
            default:
                setupInput()
                break
        }
        grid.cells.forEach(cell => cell.mergeTiles())
        const newTile = new Tile(gameBoard)
        grid.randomEmptyCell().tile = newTile
        if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
            newTile.waitForTransition(true).then(() => {
                reload = confirm("You lose. Do you want to play again?")
                if(reload) window.location.reload()
            })
            return
        }
    }
    setupInput()
}

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}
function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}
function moveLeft() {
    return slideTiles(grid.cellsByRow)
}
function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for(let i = 1; i < group.length; i++) {
                const cell = group[i]
                if(cell.tile == null) continue
                let lastValidCell
                for(let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if(!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }
                if(lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if(lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile
                    } else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null
                }
            }
            return promises
        })
    )
}

function canMoveUp() {
    return canMove(grid.cellsByColumn)
}
function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft() {
    return canMove(grid.cellsByRow)
}
function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}
function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if(index === 0) return false
            if(cell.tile == null) return false
            const moveToCell = group[index -1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}