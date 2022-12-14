import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


  
  function Square(props) {
    return (
      <button className="square" onClick={props.onClick} 
      style={props.highlight}
      >
        {props.value}
      </button>
    );
  }

  class Board extends React.Component {

    renderSquare(i, highlight) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          highlight={highlight ? {backgroundColor:'#d6f9dd'}: undefined}
        />
      );
    }
  
    render() {
      const rows = [];
      for (let i = 0; i < 3; i++) {
        const renderSquare = [];
        for (let j = i*3; j < i*3+3; j++) {
          let highlightSquare = this.props.highlight != null && this.props.highlight.includes(j);
          renderSquare.push(<span key={j}>{this.renderSquare(j, highlightSquare)}</span>);
        }

        rows.push(<div className="board-row" key={i}>{renderSquare}</div>);
    }
      return (
        <div>
          {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          position: Array(2).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        ascOrder: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares:squares,
          position: [Math.floor(i/3), i % 3]
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    toggleOrder() {
      this.setState({
        ascOrder: !this.state.ascOrder,
      })
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const active = {
        fontWeight: 'bold'
      };
  
      const inactive = {
        fontWeight: 'normal'
      };

      const moves = history.map((step, move) => {
        const location = '. row: ' + step.position[0] + ', col: ' +  step.position[1];
        const desc = move ?
          'Go to move #' + move + location:
          'Go to game start';
        
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} style = {this.state.stepNumber === move ? active : inactive}>{desc}</button>
          </li>
        );
      });


      let status;
      let highlight;
      if (winner) {
        status = 'Winner: ' + current.squares[winner[0]];
        highlight = winner;
      } else if (!stillHaveMoves(current.squares)){
        status = 'Draw!';
        highlight = null;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        highlight = null;
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              highlight={highlight}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            
            <button onClick={() => {this.toggleOrder()}}>Toggle Order</button>
            <ol>{this.state.ascOrder ? moves : moves.reverse()}</ol>
          </div>
        </div>
      );
    }
  }
  

  function stillHaveMoves(squares) {
    for (let i = 0; i < 9; i++) {
      if(squares[i] == null) return true;
    }
    return false;
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  }

  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  