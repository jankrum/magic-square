Number.prototype.range = function* (fn = x => x) {
    for (let i = 0; i < this; i++) {
        yield fn(i)
    }
}

function dm(tag, attrs = {}, ...children) {
    const el = document.createElement(tag)
    for (const key in attrs) {
        el.setAttribute(key, attrs[key])
    }
    for (const child of children) {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child))
        } else {
            el.appendChild(child)
        }
    }
    return el
}

function defer(callback) {
    requestAnimationFrame(() => requestAnimationFrame(callback))
}

class Cell {
    static #data = {
        y: 'data-y',
        x: 'data-x',
    }
    value = 0
    div
    row
    column

    constructor(grid, row, column) {
        const div = this.div = dm('div', {
            class: 'cell',
            [Cell.#data.y]: this.row = row,
            [Cell.#data.x]: this.column = column,
        }, `${this.value}`)

        div.addEventListener('click', () => {
            grid.handleCellClick(this)
        })
    }

    flip() {
        console.log('flipping this', this)
        const value = this.value = this.value === 0 ? 1 : 0
        this.div.innerText = value
    }
}

class Grid {
    static #rowCount = 3
    static #columnCount = 3
    static #length1d = Grid.#rowCount * Grid.#columnCount
    static #effectTable = [...Grid.#rowCount.range(i => [...Grid.#columnCount.range(j => {
        if ((i === 0 || i == (Grid.#rowCount - 1)) && (j === 0 || j == (Grid.#columnCount - 1))) {
            // Corners
            return [...(3).range(k => [...(3).range(l => [i + k - 1, j + l - 1])])].flat().filter(([k, l]) => (0 <= k) && (k < Grid.#rowCount) && (0 <= l) && (l < Grid.#columnCount))
        } else if (i === 0 || i == (Grid.#rowCount - 1)) {
            // Top and bottom edges
            return [...(3).range(k => [i, k])]
        } else if (j === 0 || j == (Grid.#columnCount - 1)) {
            // Left and right edges
            return [...(3).range(k => [k, j])]
        } else {
            // Center
            return [[i - 1, j], [i, j - 1], [i, j], [i, j + 1], [i + 1, j]]
        }
    })])]
    static winningTable = [...(Grid.#length1d).range(i => i !== Math.floor(Grid.#length1d / 2))]
    #cells2d
    #cells1d

    constructor() {
        const cells2d = this.#cells2d = [...(Grid.#rowCount).range(i => [...(Grid.#columnCount).range(j => new Cell(this, i, j))])]
        this.#cells1d = cells2d.flat()

        const div = dm('div', { class: 'grid' }, ...this.#cells1d.map(cell => cell.div))
        document.body.appendChild(div)
    }

    handleCellClick(cell) {
        const cellsToFlip = Grid.#effectTable[cell.row][cell.column].map(([i, j]) => this.#cells2d[i][j])
        cellsToFlip.forEach(cell => cell.flip())

        const hasWon = Grid.winningTable.every((value, i) => this.#cells1d[i].value === (value ? 1 : 0))
        if (hasWon) {
            defer(() => {
                alert('You won!')
            })
        }
    }
}

const grid = new Grid()
console.log(grid)