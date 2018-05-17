import React from 'react';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clue: '',
            amount: 0
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    onClick = id => {
        if (this.props.ctx.phase !== 'Guess Phase') return;
        if (this.isActive(id)) {
            this.props.moves.clickCell(id);
            this.props.events.endPhase();
            //this.props.events.endTurn();
        }
    }

    giveClue = () => {
        if (this.props.ctx.phase !== 'Clue Phase') return;
        if (!this.isValid(this.state['clue'].toUpperCase())) return alert('Invalid Clue');
        this.props.moves.giveClue(this.state['clue'], this.state['amount']);
        this.props.events.endPhase();
    }

    isActive(id) {
        if (!this.props.isActive) return false;
        if (this.props.G.cells[id] !== null) return true;
        return true;
    }

    isValid(clue) {
        if (clue.includes(' ')) return false;
        if (this.props.G.cells.indexOf(clue.toUpperCase()) !== -1) return false;
        if (this.props.G.given_clues.indexOf(clue.toUpperCase()) !== -1) return false;
        return true

    }
    
    render() {
        var disabled = this.props.ctx.phase !== 'Clue Phase';       
        var red_remaining = this.props.G.teams[0].remaining.length;
        var blue_remaining = this.props.G.teams[1].remaining.length;
        var current_team =  this.props.G.teams[this.props.ctx.currentPlayer].name;
        var current_phase = this.props.ctx.phase;
        var winner = '';
        // if (this.props.ctx.gameover !== null) {
        //     winner = <div>Winner: {this.props.ctx.gameover}</div>;
        // }

        const cellStyle = {
            border: '1px solid #555',
            width: '50x',
            height: '50x',
            lineHeight: '50x',
            textAlign: 'center'
        };

        let tbody = [];
        for (let i = 0; i < 5; i++) {
            let cells = [];
            for (let j = 0; j < 5; j++) {
                const id = 5 * i + j;
                cells.push(
                    <td style={cellStyle} key={id} onClick={() => this.onClick(id)}>
                        {this.props.G.cells[id]}
                    </td>
                );
            }
            tbody.push(<tr key={i}>{cells}</tr>);
        }
        return (
            <div>
                    Current Team: {current_team} <br />
                    Current Phase: {current_phase} <br />
                    Red Cards Remaining: {red_remaining} <br />
                    Blue Cards Remaining: {blue_remaining}
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
                <form>
                    <label>
                        Clue:
                        <input type="text" disabled={disabled} name="clue" value={this.state.clue} onChange={this.handleInputChange}/> <br />
                        Amount:
                        <input type="number" disabled={disabled} name="amount"  min="0" max="9" value={this.state.amount} onChange={this.handleInputChange}/> <br />
                    </label>
                    <input type="button" readOnly value="Submit" onClick={this.giveClue}/>
                </form>
            {winner}
            </div>
        );
    }
}

export default Board;