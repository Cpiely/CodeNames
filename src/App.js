
import { Client } from 'boardgame.io/react'; 

import CodeNames from './game';
import Board from './board';

const App = Client({
    game: CodeNames,
    board: Board,
});

export default App
