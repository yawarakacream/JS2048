
class Utility {

    /**
     * a 以上 b 未満の整数乱数を返す
     * ただし、 a == b のときはその値
     */
    static random(a, b) {
        return a + Math.floor(Math.random() * (b - a));
    }

}

class Game {

    constructor(size) {
        this.size = size;
        this.field = new Array(size);
        for(let i = 0; i < size; i++)
            this.field[i] = new Array(size).fill(0);
        this.addRandomPieces();
    }

    getPiece(row, column) {
        return this.field[row][column];
    }

    /**
     * 値が 0 のピースをまとめた配列を返す
     */
    getEmptyPieces() {
        let pieces = new Array();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.field[i][j] === 0)
                    pieces.push({ row: i, column: j });
            }
        }
        return pieces;
    }

    /**
     * 値が 0 のピースにランダムにボックスを配置する
     */
    addRandomPieces() {

        const applicants = this.getEmptyPieces();
        const amount = Math.min(Utility.random(1, 2), applicants.length);

        for (let i = 0; i < amount; i++) {
            const target = Utility.random(0, applicants.length - 1);
            this.field[applicants[target].row][applicants[target].column] = 1;
            applicants.splice(target, 1);
        }

        this.notityFieldUpdate();

    }

    /**
     * getPiece(base, index) base 行 (列) index 列 (行) を取得する
     * setPiece(base, index, value) base 行 (列) index 列 (行) を value に設定する
     */
    pieceMovementHandlers = {
        up: {
            getPiece: (base, index) => this.field[index][base],
            setPiece: (base, index, value) => this.field[index][base] = value
        },
        down: {
            getPiece: (base, index) => this.field[this.size - (index + 1)][base],
            setPiece: (base, index, value) => this.field[this.size - (index + 1)][base] = value
        },
        left: {
            getPiece: (base, index) => this.field[base][index],
            setPiece: (base, index, value) => this.field[base][index] = value
        },
        right: {
            getPiece: (base, index) => this.field[base][this.size - (index + 1)],
            setPiece: (base, index, value) => this.field[base][this.size - (index + 1)] = value
        }
    }

    /*
     * ピースを移動する
     */
    move(pmHandler) {

        for (let i = 0; i < this.size; i++) {

            // 落下予想地点
            let base = 0;

            for (let j = 0; j < this.size; j++) {

                if (j === base || pmHandler.getPiece(i, j) === 0)
                    continue;

                if (pmHandler.getPiece(i, base) === 0) {
                    pmHandler.setPiece(i, base, pmHandler.getPiece(i, j));
                    pmHandler.setPiece(i, j, 0);
                }

                else if (pmHandler.getPiece(i, base) === pmHandler.getPiece(i, j)) {
                    pmHandler.setPiece(i, j, 0);
                    pmHandler.setPiece(i, base, pmHandler.getPiece(i, base) + 1);
                    base++;
                }

                else if (pmHandler.getPiece(i, base) !== pmHandler.getPiece(i, j)) {
                    base++;
                    const temp = pmHandler.getPiece(i, j);
                    pmHandler.setPiece(i, j, 0);
                    pmHandler.setPiece(i, base, temp);
                }

            }

        }

        this.addRandomPieces();
        this.notityFieldUpdate();

    }

    /**
     * this.field の更新を通知する
     * 初回の addRandomPieces のとき、 this.field.__ob__ は undefined である
     */
    notityFieldUpdate() {
        this.field.__ob__?.dep.notify();
    }

};
