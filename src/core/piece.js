import { colors, shapes, size } from '../core/constants';

class piece {
    constructor() {
        this.rotationIndex = 0;
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        this.currentShape = this.shape[this.rotationIndex];
        this.x = 0;
        this.y = 0;
    }

    setBeginPosition() {
        this.x = 3;
    }

    rotate(direction = 1) {
        this.rotationIndex = (this.rotationIndex + direction) % 4;
        this.currentShape = this.shape[this.rotationIndex];

        return this;
    }

    draw(ctx) {
        this.currentShape.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col > 0) {
                    ctx.fillStyle = colors[col];
                    ctx.fillRect((this.x + x) * size.GRIDSIZE, (this.y + y) * size.GRIDSIZE, size.GRIDSIZE, size.GRIDSIZE);
                }
            });
        });
    }
}

export default piece;