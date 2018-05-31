import React from 'react';
import logo from '../images/codenames.jpg';

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
        if (this.props.G.board[id].revealed) return;
        this.props.moves.clickCell(id);
        if (this.isCorrect(id)) {
            if (this.props.G.count === 1) {
                this.props.events.endPhase();
                this.props.events.endTurn();
                return;    
            }
        } else {   
            this.props.events.endPhase();         
            this.props.events.endTurn();
        }
    }

    giveClue = () => {
        if (this.props.ctx.phase !== 'Clue Phase') return;
        if (!this.isValid(this.state['clue'].toUpperCase())) return alert('Invalid Clue');
        this.props.moves.giveClue(this.state['clue'], Number(this.state['amount']));
        this.props.events.endPhase();
    }

    endTurn = () => {
        this.props.events.endPhase();
        this.props.events.endTurn();  
    }

    // isActive(id) {
    //     return this.props.isActive;
    // }

    isValid(clue) {
        if (clue.includes(' ')) return false;
        for (let i = 0; i < this.props.G.board; i++) {
            if (this.props.G.board[i].value === clue.toUpperCase()) return false;
        }
        if (this.props.G.given_clues.indexOf(clue.toUpperCase()) !== -1) return false;
        return true

    }

    isCorrect(id) {
        return this.props.G.board[id].team === this.props.G.players[this.props.ctx.currentPlayer]
    }
    
    render() {
        const cellStyle = {
            border: '1px solid #555',
            width: '200px',
            height: '110px',
            lineHeight: '50x',
            textAlign: 'center',
            padding: '12px 20px',
            backgroundImage: `url(${logo})`,
            backgroundSize: 'cover',
            overflow: 'hidden',
            tableLayout: 'fixed',
            textShadow: '1px 1px 2px white'
        };
        const tableStyle = {
            tableLayout: 'fixed'
        }
        var labelStyle = {}
        var disabled = this.props.ctx.phase !== 'Clue Phase';       
        var current_team =  this.props.G.players[this.props.ctx.currentPlayer];
        var current_phase = this.props.ctx.phase;
        var winner = '';
        var clue_type = "text";
        var amount_type = "number";
        var button_text = "Submit";
        var button_on_click = this.giveClue;
        if (this.props.ctx.phase !== 'Clue Phase') {
            clue_type = "hidden";
            amount_type = "hidden";
            button_text = "End Turn";
            button_on_click = this.endTurn;
            labelStyle.visibility = 'hidden'
        }
        let tbody = [];
        for (let i = 0; i < 5; i++) {
            let cells = [];
            for (let j = 0; j < 5; j++) {
                const id = 5 * i + j;
                var revealStyle = JSON.parse(JSON.stringify(cellStyle));
                if (this.props.G.board[id].revealed) { 
                    revealStyle.backgroundImage = `url(${this.props.G.images[this.props.G.board[id].team]})`;
                };
                cells.push(
                    <td style={revealStyle} key={id} onClick={() => this.onClick(id)}>
                            {this.props.G.board[id].value}
                    </td> 
                );
            }
            tbody.push(<tr key={i}>{cells}</tr>);
        }
        return (
            <div className="container">
                    <h4 align="center">
                        Current Team: {current_team} <br />
                        Current Phase: {current_phase} <br />
                    </h4>
                <table className="table" id="board" style={tableStyle} align="center">
                    <tbody>{tbody}</tbody>
                </table>
                    <form className="form-inline" onSubmit={this.preventDefault}>
                        <div className="form-group">
                            <label style={labelStyle}>Clue:</label> 
                            <input type={clue_type} className="form-control" disabled={disabled} placeholder="Enter Clue" value={this.state.clue} name="clue" onChange={this.handleInputChange}/> 
                        </div>
                        <div className="form-group">
                            <label style={labelStyle}>Amount:</label>
                            <input type={amount_type} className="form-control" disabled={disabled} min="0" max="9" value={this.state.amount} name="amount" onChange={this.handleInputChange}/>
                        </div>
                        <button type="button" readOnly onSubmit={this.preventDefault} className="btn btn-default col-xs-offset-9 col-xs-3" onClick={button_on_click}>{button_text}</button>
                    </form>
            {winner}
            </div>
        );
    }
}

export default Board;