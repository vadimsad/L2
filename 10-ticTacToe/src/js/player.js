export class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}

export class AIPlayer extends Player {
    constructor(name, symbol, isHard) {
        super(name, symbol);
        this.isHard = isHard;
    }
}