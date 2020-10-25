import {colors, keys, size} from '../core/constants';
import piece from './piece';

class board {

    constructor(updateScoreCallback) {
        this.allowedMoves = {
            [keys.LEFT]: piece => ({ ...piece, x: piece.x - 1 }),
            [keys.RIGHT]: piece => ({ ...piece, x: piece.x + 1 }),
            [keys.DOWN]: piece => ({ ...piece, y: piece.y + 1 }),
            [keys.UP]: piece => this.rotate(piece),
        };

        this.updateScoreCallback = updateScoreCallback;

        this.init();
    }

    init() {
        this.cells = Array.from({length: size.ROWS}, () => Array(size.COLS).fill(0));
        this.score = 0;
    };

    reset() {
        this.piece = new piece();
    }

    movePiece(direction) {
        this.piece.x = direction.x;
        this.piece.y = direction.y;
    }

    dropPiece() {
        if (this.isValidMove({...this.piece, y: this.piece.y + 1})) {
            this.movePiece({x: this.piece.x , y: this.piece.y + 1});
        } else {
            this.commitPiece();
            let rowsCleared = this.removeFullRows();
            if (rowsCleared > 0) {
                this.updateScoreCallback(rowsCleared);
            }

            this.piece = new piece();
            if (!this.isValidMove(this.piece)) {
                return false;
            }
        }

        return true;
    }

    commitPiece() {
        this.piece.currentShape.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col > 0) {
                    this.cells[this.piece.y + y][this.piece.x + x] = col;
                }
            });
        });
    }

    removeFullRows() {
        let rowsCleared = 0;
        for (let y = this.cells.length - 1; y >= 0; y--) {
            let full = true;
            for (let x = 0; x < this.cells[y].length; x++) {
                if (this.cells[y][x] === 0) {
                    full = false;
                }
            }

            if (full) {
                this.removeRow(y);
                y++;
                rowsCleared++;
            }
        }

        return rowsCleared;
    }

    removeRow(row) {
        for (let y = row; y > 0; y--) {
            for (let x = 0; x < this.cells[y].length; x++) {
                this.cells[y][x] = this.cells[y - 1][x];
            }
        }
    }

    nextPosition(key) {
        if (this.allowedMoves[key] === undefined) {
            return null;
        }

        return this.allowedMoves[key](this.piece);
    }

    handleKeyPress(key) {
        const nextPosition = this.nextPosition(key);
        if (!nextPosition) {
            return;
        }

        if (this.isValidMove(nextPosition)) {
            this.movePiece(nextPosition);
        }
    }

    isValidMove(position) {
        for(let y = 0; y < this.piece.currentShape.length; y++) {
            for(let x = 0; x < this.piece.currentShape[y].length; x++) {     
                if (this.piece.currentShape[y][x] > 0) {
                    const nextX = position.x + x;
                    const nextY = position.y + y;

                    // Check gameboard bounds
                    if (nextX < 0 || nextX >= size.COLS) {
                        return false;
                    }
            
                    if (nextY >= size.ROWS) {
                        return false;
                    }

                    // Check cells
                    if (this.cells[nextY][nextX] > 0) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }

    rotate(position) {
        const rotatedPiece = position.rotate();
        if (this.isValidMove(rotatedPiece)) {
            return rotatedPiece;
        }

        return position.rotate(-1);
        
    }

    draw(ctx, frame) {
        this.cells.forEach((row, y) => {
            row.forEach((col, x) => {
                ctx.fillStyle = colors[col];
                ctx.fillRect(x * size.GRIDSIZE, y * size.GRIDSIZE, size.GRIDSIZE, size.GRIDSIZE);
            });
        });

        this.piece.draw(ctx);
    }
};

export default board;