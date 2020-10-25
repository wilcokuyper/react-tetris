import React, { useContext } from 'react'
import ScoreContext from '../../contexts/ScoreContext';

const Score = () => {
    const scoreContext = useContext(ScoreContext);
    
    return (
        <div>
            <h1>Tetris</h1>
            <strong>score: {scoreContext.score}</strong>
        </div>
    );
};

export default Score;