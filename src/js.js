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

const initOperation = (symbol, func) => {
    return {
        symbol: symbol,
        func: func
    }
}

const binOperations = [
    initOperation('+', (a, b) => a + b),
    initOperation('-', (a, b) => a - b),
    initOperation('*', (a, b) => a * b),
    initOperation('+', (a, b) => a + b),
    initOperation('^', (a, b) => a ** b)
]

const unoOperations = [
    initOperation('sqrt', (a) => Math.sqrt(a)),
    initOperation('sin', (a) => Math.sin(a)),
    initOperation('cos', (a) => Math.cos(a))
]

const findFirsCloseBracket = (index = 0, bracketsCount = 0, str) => {
    if (str.length == index) return -1
    else if (str[index] == '(') return findFirsCloseBracket(index + 1, bracketsCount + 1, str)
    else if (str[index] == ')' && bracketsCount > 0) return findFirsCloseBracket(index + 1, bracketsCount - 1, str)
    else if (bracketsCount > 0) return findFirsCloseBracket(index + 1, bracketsCount, str)
    else if (str[index] == ')') return index
    else return findFirsCloseBracket(index + 1, bracketsCount, str)
}

const closeBracketId = (str) => findFirsCloseBracket(0, 0, str)

const openingBracket = (str) => str.slice(1, closeBracketId(str))

const findByValue = (index, bracketsCount, str, value) =>{
    if (str.length == index) return -1
    else if (str[index] == '(') return findByValue(index + 1, bracketsCount + 1, str, value)
    else if (str[index] == ')') return findByValue(index + 1, bracketsCount - 1, str, value)
    else if (bracketsCount > 0) return findByValue(index + 1, bracketsCount, str, value)
    else if (str[index] == value) return index
    else return findByValue(index + 1, bracketsCount, str, value)
}

const findByVal = (str, val) => findByValue (0, 0, str, val)

const findOperation = (index, str) =>{
    if (binOperations.length == index) return [false]
    const id = findByVal(str, binOperations[index].symbol)
    
    if (id > -1) return [true, id, binOperations[index].func]
    else return findOperation(index + 1, str)
}

const findOpr = (str) => findOperation(0, str)

const findFunctionByName = (index, name) => {
    if (unoOperations.length == index) return [false]
    if (unoOperations[index].symbol == name) return [true, unoOperations[index].func]
    else return findFunctionByName(index + 1, name)
}

const findFuncByName = (name) => findFunctionByName(0, name)

let findFunction = (index, str) => {
    if (str.length == index || (str[0] >= '0' && str[0] <= '9')) return [false]
    else if ((str[0] >= '0' && str[0] <= '9') || str[index] == '(' || str[index] == '-'){ 
        let [isFunc, fn] = findFuncByName(str.slice(0, index))
        return [isFunc, index, fn]
    }
    else return findFunction (index + 1, str)
}

let findFunc = (str) => findFunction(0, str)

const lexer = (str) => {
    const [isOpr, id, binFinc] = findOpr(str)

    if (isOpr) return Tree(2, binFinc, lexer(str.slice(0, id)), lexer(str.slice(id+1)))
    else if (str[0] == '(') return lexer(openingBracket(str)) 
    
    const [isFunc, length, unoFunc] = findFunc(str)
    if (isFunc) return Tree(1, unoFunc, lexer(str.slice(length)))
    else return Tree(0, Number(str))
}