import React, { useContext, useEffect, useRef, useState } from 'react';
import { size } from '../../core/constants';
import board from '../../core/board';
import ScoreContext from '../../contexts/ScoreContext';

const Board = props => {
    let requestedAnimationFrame;
    let stopped = false;
    let timer = {
        start: 0,
        elapsed: 0,
    };

    let level = useRef(1);

    const canvasRef = useRef(null);

    const {score, setScore} = useContext(ScoreContext);
    const [linesCleared, setLinesCleared] = useState(0);
    
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let frame = 0;

        const render = () => {
            frame++;
            draw(ctx, frame);
            requestedAnimationFrame = window.requestAnimationFrame(render);
        }
    
        render();

        return () => {
            window.cancelAnimationFrame(requestedAnimationFrame);
            requestedAnimationFrame = null;
            document.removeEventListener('keydown', handleKeyPress);
        }
    }, []);

    useEffect(() => {
        if (linesCleared >= 10) {
            setLinesCleared(0);
            level.current++;
        }
    }, [linesCleared]);

    const handleUpdateScore = rowsCleared => {
        const multipliers = {
            1: 100,
            2: 300,
            3: 500,
            4: 800,
        };

        setLinesCleared(linesCleared => linesCleared + rowsCleared);
        setScore(score => score + multipliers[rowsCleared] * level.current); 
    }

    const gameBoard = new board(handleUpdateScore);
    gameBoard.reset();

    const handleKeyPress = e => {
        gameBoard.handleKeyPress(e.keyCode);
    };

    const getCutoff = () => {
        const speeds = [
            0.01667,
            0.021017,
            0.026977,
            0.035256,
            0.04693,
            0.06361,
            0.0879,
            0.1236,
            0.1775,
            0.2598,
            0.388,
            0.59,
            0.92,
            1.46,
            2.36,
        ];

        return 1 / speeds[level.current - 1];
    }

    const play = (ctx, frame) => {
        timer.elapsed = frame - timer.start;
        const cutoff = getCutoff();
        if (timer.elapsed >= cutoff) {
            timer.start = frame;
            if (!gameBoard.dropPiece()) {
                gameOver(ctx);
                requestedAnimationFrame = null;
                stopped = true;
                return;
            }
        }

        gameBoard.draw(ctx, frame);
        window.cancelAnimationFrame(requestedAnimationFrame);
    };

    const gameOver = (ctx) => {
        window.cancelAnimationFrame(requestedAnimationFrame);
        ctx.fillStyle = 'grey';
        ctx.fillRect(1 * size.GRIDSIZE, 3 * size.GRIDSIZE, 8 * size.GRIDSIZE, 2 * size.GRIDSIZE);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('GAME OVER', 3 * size.GRIDSIZE, 4.2 * size.GRIDSIZE);
    }

    const draw = (ctx, frame) => {
        if (!stopped) {
            play(ctx, frame);
        }
    }

    return (
        <canvas
            ref={canvasRef}
            width={size.COLS * size.GRIDSIZE}
            height={size.ROWS * size.GRIDSIZE}
            {...props}
        ></canvas>
    );
};

export default Board;