const print = (...args) => {
    for (arg of args) document.write(`<p>${arg}</p>`)
}

const Tree = (tag, ...fields) => {
    return {
        tag: tag,
        fields: fields
    }
}

const solve = (tree) => {
    switch(tree.tag) {
        case 0: {
            return tree.fields[0]
        }
        case 1: {
            return tree.fields[0](solve(tree.fields[1]))
        }
        case 2: {
            return tree.fields[0](solve(tree.fields[1]), solve(tree.fields[2]))
        }
    }
}

let lexer = (() => {

    const initOperation = (symbol, func) => {
        return {
            symbol: symbol,
            func: func
        }
    }

    let binOperations = [
        initOperation('+', (a, b) => a + b),
        initOperation('-', (a, b) => a - b),
        initOperation('*', (a, b) => a * b),
        initOperation('+', (a, b) => a + b),
        initOperation('^', (a, b) => a ** b)
    ]
     
    return {
        getOpr: () => {
            return binOperations
        }
    }
})();

let a = Tree(2, (a, b) => a + b, Tree(0, 1), Tree(0, 5))

let a2 = Tree(2, (a, b) => a + b, Tree(1, (a) => a*a, Tree(0, 2)), Tree(0, 0))

print(solve(a), lexer.getOpr()[4].func(2, 3))

