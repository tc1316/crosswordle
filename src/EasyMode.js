import React, { useState, useEffect } from "react";
import { EASYMODE_WORDS } from "./data/easyModeData";
import HowToPlay from "./components/HowToPlay";
import Grid from "./components/Grid";
import Score from "./components/Score";
import LetterBucket from "./components/LetterBucket";
import { parseWords, getDayNumber } from "./helpers/Helpers";
import {
  generateRowNeighbours,
  generateEasyGrid,
} from "./helpers/easyModeMethods";

export default function EasyMode() {
  const MAXSCORE = 25;
  const WORDLENGTH = 5;
  const rawDailyAnswer = EASYMODE_WORDS[getDayNumber() - 1];
  const parsedDailyAnswer = parseWords(rawDailyAnswer);

  const initialGrid = generateEasyGrid(parsedDailyAnswer);
  const possibleLetters = parsedDailyAnswer;
  let eachCellsNeighbours = generateRowNeighbours(initialGrid);

  const [grid, setGrid] = useState(initialGrid);
  const [showModal, setShowModal] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(15);

  useEffect(() => {
    checkWin();
  }, [correctCount]);

  const checkWin = () => {
    if (correctCount === MAXSCORE) {
      console.log("You win");
      setShowModal(true);
    }
  };

  const changeCell = (e) => {
    const input = e.target.value.toUpperCase();
    if (!/^[a-zA-Z]*$/.test(input)) {
      return false;
    }
    const r = e.target.attributes.row.value;
    const c = e.target.attributes.col.value;
    const newGrid = { ...grid };
    newGrid.rows[r].cols[c].value = input;
    setGrid(newGrid);
  };

  const checkGrid = () => {
    const newGrid = { ...grid };
    for (let i = 0; i < WORDLENGTH; i++) {
      for (let j = 0; j < WORDLENGTH; j++) {
        const cell = newGrid.rows[i].cols[j];
        if (cell.value === cell.answer) {
          cell.state = "correct";
          cell.readonly = true;
        } else if (
          eachCellsNeighbours.rows[i].cols[j].neighbours.includes(cell.value)
        ) {
          cell.state = "wrong-location";
        } else {
          cell.state = "wrong";
        }
        updateCorrectCellCount(cell);
        eachCellsNeighbours = generateRowNeighbours(newGrid);
      }
    }
    setGrid(newGrid);
    setScore((prevScore) => prevScore - 1);
  };

  const updateCorrectCellCount = (cell) => {
    if (cell.readonly) {
      setCorrectCount((prevCount) => prevCount + 1);
    }
  };

  const checkCellsWrapper = () => {
    setCorrectCount(0);
    checkGrid();
  };

  return (
    <>
      <div className="columns is-vcentered">
        <div className="column"></div>

        <div className="column is-two-thirds">
          <Grid grid={grid} changeCell={changeCell} />
          <LetterBucket answer={possibleLetters} grid={grid} key={"letterbucket"} />
        </div>

        <div className="column">
          <div className="container scoreboard m-2">
            <p
              id="score-label"
              className="is-size-6-touch is-size-5-tablet is-size-4-desktop m-1"
            >
              Score:
            </p>
            <Score score={score} key={"refreshedScore"} />
            <p
              id="correct-cells-label"
              className="is-size-6-touch is-size-5-tablet is-size-4-desktop m-1"
            >
              Correct Letters:
            </p>
            <div className="correctCells is-size-4-touch is-size-2-tablet is-size-1-desktop m-3">
              {correctCount}
            </div>
            <button
              id="check-solution"
              className="is-size-6-touch is-size-5-tablet is-size-4-desktop m-3 p-2"
              onClick={checkCellsWrapper}
            >
              Check
              <br />
              Answer
            </button>
            <HowToPlay key={"howToPlay"} mode={"easy"} />
          </div>
        </div>
      </div>

      <div className="container">
        {showModal && (
          <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
              <div className="box">
                <p>You win! Your final score is: {score}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}