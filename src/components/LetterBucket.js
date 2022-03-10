import React, { useRef, useEffect, useState } from "react";
import Letter from "./Letter.js";
import "./LetterBucket.css";

function dictionaryGenerator(answer) {
  let letterCounts = {};
  answer.forEach(function (x) {
    letterCounts[x] = (letterCounts[x] || 0) + 1;
  });
  Object.entries(letterCounts).map(([key, value]) => {
    letterCounts[key] = { count: value, green: 0, yellow: 0 };
    return letterCounts;
  });
  return letterCounts;
}

function backgroundColour(lettersArr, letterDictionary) {
  let newLetterDictionary = { ...letterDictionary };
  for (let i = 0; i < 25; ++i) {
    let letter = lettersArr[i].value;
    if (letter !== "" && letter in newLetterDictionary) {
      let state = lettersArr[i].state;
      if (state === "correct") newLetterDictionary[letter].green += 1;
      if (state === "wrong-location") newLetterDictionary[letter].yellow += 1;
    }
  }
}

function randomiseAnswer(answer) {
  let arr = answer.slice();
  for (let i = 0; i < arr.length - 1; ++i) {
    let j = Math.floor(Math.random() * arr.length);
    let current_element = arr[i];
    arr[i] = arr[j];
    arr[j] = current_element;
  }
  return arr;
}

function lettersArr(answer) {
  let arr = [...new Set(answer)];
  arr = arr.filter((char) => char !== "*");
  return arr;
}

function formatLetters(postCheckGrid) {
  let lettersArr = [];
  postCheckGrid.rows.forEach((row) => {
    row.cols.forEach((cell) => {
      lettersArr.push(cell);
    });
  });
  return lettersArr;
}

function keyRowLength(uniqueLetters) {
  let numberOfLetters = uniqueLetters.length;
  if (numberOfLetters % 2 !== 0) {
    numberOfLetters += 1;
  }
  return numberOfLetters / 2;
}

function initKeyboardLength(keyLength) {
  document.documentElement.style.setProperty("--row-length", keyLength);
}

export default function LetterBucket({ answer, postCheckGrid }) {
  const [letterDictionary, setLetterDictionary] = useState(
    dictionaryGenerator(answer)
  );
  const uniqueLetters = lettersArr(answer);
  const arr = useRef(randomiseAnswer(uniqueLetters));
  const rowLength = keyRowLength(uniqueLetters);
  initKeyboardLength(rowLength);

  useEffect(() => {
    function updateBackgroundColours() {
      const newLettersArr = formatLetters(postCheckGrid);
      const newLetterDictionary = dictionaryGenerator(answer);
      setLetterDictionary(newLetterDictionary);
      backgroundColour(newLettersArr, newLetterDictionary);
    }
    updateBackgroundColours();
  }, [postCheckGrid, answer]);

  return (
    <>
      <div className="letterBucket" key={"letter-bucket"}>
        {arr.current.map((letter, index) => (
          <Letter
            key={`letter-${index}`}
            countColours={letterDictionary[letter]}
            letter={letter}
            index={index}
          />
        ))}
      </div>
    </>
  );
}
