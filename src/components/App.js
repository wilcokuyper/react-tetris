import React, { useState } from 'react';

import Board from './board';
import Score from './score';
import ScoreContext from '../contexts/ScoreContext';

const App = () => {
    const [score, setScore] = useState(0);

    return (
        <ScoreContext.Provider value={{score, setScore}}>
            <Board />
            <Score />
        </ScoreContext.Provider>
    );
};

export default App;