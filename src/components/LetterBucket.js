import React, { useRef, useEffect, useState } from "react";
import Letter from "./Letter.js";
import "./LetterBucket.css";

function getRandomInt(n) {
  return Math.floor(Math.random() * n);
}

function randomiseAnswer(answer) {
  let arr = answer.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; ++i) {
    let j = getRandomInt(n);

    let current_element = arr[i];
    arr[i] = arr[j];
    arr[j] = current_element;
  }

  return arr;
}

function dictionaryGenerator(answer) {
  var counts = {};
  answer.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  Object.keys(counts).map((key, _) => {
    let count = counts[key];
    counts[key] = { count: count, green: 0, yellow: 0 };
    return counts;
  });
  return counts;
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

function backgroundColour(lettersArr, letterDictionary) {
  let newLetterDictionary = { ...letterDictionary };
  console.log("Bucketstate %o", lettersArr);

  for (let i = 0; i < 25; ++i) {
    let letter = lettersArr[i].value;
    if (letter !== "" && letter in newLetterDictionary) {
      let state = lettersArr[i].state;
      if (state === "correct") newLetterDictionary[letter].green += 1;
      if (state === "wrong-location") newLetterDictionary[letter].yellow += 1;
    }
  }
}

function keyRowLength(uniqueLetters) {
  let numberOfLetters = uniqueLetters.length;
  if (numberOfLetters % 2 !== 0) {
    numberOfLetters += 1;
  }
  return numberOfLetters / 2;
}

function setKeyboardLength(keyLength) {
  document.documentElement.style.setProperty("--row-length", keyLength);
}

export default function LetterBucket({ answer, postCheckGrid }) {
  const [letterDictionary, setLetterDictionary] = useState(
    dictionaryGenerator(answer)
  );
  const uniqueLetters = lettersArr(answer);
  const arr = useRef(randomiseAnswer(uniqueLetters));
  const rowLength = keyRowLength(uniqueLetters);
  setKeyboardLength(rowLength);

  useEffect(() => {
    console.log("somethings changing");
    const lettersArr = formatLetters(postCheckGrid);
    const newLetterDictionary = dictionaryGenerator(answer);
    setLetterDictionary(newLetterDictionary);
    backgroundColour(lettersArr, newLetterDictionary);
  }, [postCheckGrid]);

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
