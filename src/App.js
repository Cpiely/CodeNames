
import { Client } from 'boardgame.io/react'; 
import CodeNames from './game';
import Board from './board';
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';

const App = Client({
    game: CodeNames,
    board: Board,
    debug: true
});

export default App
