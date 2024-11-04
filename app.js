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

class Cell {
    static #data = {
        y: 'data-y',
        x: 'data-x',
    }
    static #initialValue = 'X'
    #row
    #column
    div

    constructor(row, column) {
        this.#row = row
        this.#column = column
        const div = this.div = dm('div', { class: 'cell', [Cell.#data.y]: this.#row, [Cell.#data.x]: this.#column }, Cell.#initialValue)

        div.addEventListener('click', () => {
            console.log(div)
        })
    }
}

class Grid {
    static #rowCount = 3
    static #columnCount = 3
    #cells2d
    #cells1d

    constructor() {
        const cells2d = this.#cells2d = [...(Grid.#rowCount).range(i => [...(Grid.#columnCount).range(j => new Cell(i, j))])]
        this.#cells1d = cells2d.flat()

        const div = dm('div', { class: 'grid' }, ...this.#cells1d.map(cell => cell.div))
        document.body.appendChild(div)
    }
}

const grid = new Grid()