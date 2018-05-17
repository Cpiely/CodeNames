import { Game } from 'boardgame.io/core';
import cardbank from './cards.json'

const initial_chooser = randomNoRepeats(cardbank);
const cardlist = Shuffle(initial_chooser, 25);
const distribution_chooser = randomNoRepeats(cardlist);
const spy_card = Math.round(Math.random());
const neutral_cards = Shuffle(distribution_chooser, 7);
const blue_cards = Shuffle(distribution_chooser, 8+spy_card);
const red_cards = Shuffle(distribution_chooser, 8+(1-spy_card));
const death_card = Shuffle(distribution_chooser, 1);

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
    const positions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 2],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let pos of positions) {
        const symbol = cells[pos[0]];
        let winner = symbol;
        for (let i of pos) {
            if (cells[i] !== symbol) {
                winner = null;
                break;
            }
        }
        if (winner != null) return true;
    }

    return false;
}

const CodeNames = Game({
    name: 'codenames',
    setup: (G, ctx) => ({
        cells: cardlist,
        neutral_cards: neutral_cards,
        death_card: death_card,
        teams: {
            0: {
                name: "Red",
                cards: red_cards,
                remaining: red_cards
            },
            1: {
                name: "Blue",
                cards: blue_cards,
                remaining: blue_cards
            }    
        },
        clue: null,
        count: null
    }),

    moves: {
        giveClue(G, ctx, word, amount) {
            const clue = word;
            const count = amount;
            return { ...G, clue, count}
        },
        clickCell(G, ctx, id) {
            const cells = [...G.cells];

            if (cells[id] === null) {
                cells[id] = ctx.currentPlayer;
            }

            return { ...G, cells };
        },
    },

    flow: {
        phases: [
            {
                name: 'Clue Phase',
                allowedMoves: ['giveClue'],
                //endPhaseIf: G => (G.clue != null && G.count != null)
            },
            {
                name: 'Guess Phase',
                allowedMoves: ['clickCell'],
            }
        ],
        movesPerTurn: 2,
        turnOrder: {
            first: (G, ctx) => G.teams[0].cards.length > G.teams[1].cards.length ? 1 : 0,
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
