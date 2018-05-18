import { Game } from 'boardgame.io/core';
import cardbank from './cards.json'
import blue from '../images/blue.jpg';
import red from '../images/red.jpg';
import death from '../images/death.jpg';
import neutral from '../images/neutral.jpg';
import logo from '../images/codenames.jpg';

const initial_chooser = randomNoRepeats(cardbank);
const cardlist = Shuffle(initial_chooser, 25);
const distribution_chooser = randomNoRepeats(cardlist);
const spy_card = Math.round(Math.random());
const neutral_cards = Shuffle(distribution_chooser, 7);
const blue_cards = Shuffle(distribution_chooser, 8+spy_card);
const red_cards = Shuffle(distribution_chooser, 8+(1-spy_card));
const death_card = Shuffle(distribution_chooser, 1);

var board = [];
for (let i = 0; i < cardlist.length; i++) {
    var team;
    if (neutral_cards.indexOf(cardlist[i]) !== -1) team = 'Neutral';
    if (blue_cards.indexOf(cardlist[i]) !== -1) team = 'Blue';
    if (red_cards.indexOf(cardlist[i]) !== -1) team = 'Red';
    if (death_card.indexOf(cardlist[i]) !== -1) team = 'Death';
    board.push(
    {
        value: cardlist[i],
        team: team,
        revealed: false
    });
}

const images = {
    Neutral: neutral,
    Blue: blue,
    Red: red,
    Death: death
}

function randomNoRepeats(array) {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

function Shuffle(chooser, count) {
    var chosenCards = [];
    for (let i=0; i<count; i++) {
        chosenCards.push(chooser());
    }
    return chosenCards
}

function IsVictory(cells) {
    // const positions = [
    //     [0, 1, 2],
    //     [3, 4, 5],
    //     [6, 7, 2],
    //     [0, 3, 6],
    //     [1, 4, 7],
    //     [2, 5, 8],
    //     [0, 4, 8],
    //     [2, 4, 6],
    // ];

    // for (let pos of positions) {
    //     const symbol = cells[pos[0]];
    //     let winner = symbol;
    //     for (let i of pos) {
    //         if (cells[i] !== symbol) {
    //             winner = null;
    //             break;
    //         }
    //     }
    //     if (winner != null) return true;
    // }

    return false;
}

const CodeNames = Game({
    name: 'codenames',
    setup: (G, ctx) => ({
        players: ['Red','Blue'],
        images: images,
        board: board,
        red_cards: red_cards,
        blue_cards: blue_cards,
        given_clues: [],
        clue: null,
        count: null
    }),

    moves: {
        giveClue(G, ctx, word, amount) {
            const clue = word;
            var count;
            if (amount === 0) {
                count = -1;
            } else {
                count = amount + 1;
            }
            const given_clues = [...G.given_clues]
            given_clues.push(clue.toUpperCase())
            return { ...G, clue, count, given_clues}
        },
        clickCell(G, ctx, id) {
            const board = G.board;
            if (!board[id].revealed) {
                board[id].revealed = true;
            }
            return { ...G, board};
        },
    },

    flow: {
        phases: [
            {
                name: 'Clue Phase',
                allowedMoves: ['giveClue'],
            },
            {
                name: 'Guess Phase',
                allowedMoves: ['clickCell'],
            }
        ],
        movesPerTurn: 2,
        turnOrder: {
            first: (G, ctx) => G.red_cards.length > G.blue_cards.length ? 1 : 0,
            next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        endGameIf: (G, ctx) => {
            if (IsVictory(G.cells)) {
                return ctx.currentPlayer;
            }
        },
    },
});

export default CodeNames;
