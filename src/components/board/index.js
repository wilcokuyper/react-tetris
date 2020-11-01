import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { size } from '../../core/constants';
import board from '../../core/board';
import ScoreContext from '../../contexts/ScoreContext';

const Board = props => {
    let requestedAnimationFrame;
    let stopped = false;
    let timer = {
        start: 0,
        elapsed: 0,
        speed: 100,
    };

    let level = useRef(1);

    const canvasRef = useRef(null);

    const {score, setScore} = useContext(ScoreContext);

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
        if (score >= level.current * 1000) {
            level.current++;
        }
    }, [score]);

    const handleUpdateScore = rowsCleared => {
        const multipliers = {
            1: 100,
            2: 300,
            3: 500,
            4: 800,
        };
        
        setScore(score => score + multipliers[rowsCleared] * level.current); 
    }

    const gameBoard = new board(handleUpdateScore);
    gameBoard.reset();

    const handleKeyPress = e => {
        gameBoard.handleKeyPress(e.keyCode);
    };

    const play = (ctx, frame) => {
        timer.elapsed = frame - timer.start;
        const cutoff = (timer.speed - (level.current - 1) * 10);
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