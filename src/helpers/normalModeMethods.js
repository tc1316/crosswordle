function generateNormalGrid(parsedChars) {
  const result = { rows: [] };

  for (let i = 0; i < 5; i++) {
    let row = { cols: [], index: i };
    for (let j = 0; j < 5; j++) {
      let answer = parsedChars[i * 5 + j];
      let value = null;
      let state_tmp = "default";
      // Above state types should probably be declared as a constant elsewhere
      if (answer === "*") {
        value = "";
        state_tmp = "blank";
      }
      if ((i % 4 === 0 && j % 4 === 0) || (i === 2 && j === 2)) {
        value = answer;
        state_tmp = "correct";
      }

      let col = {
        row: i,
        col: j,
        value: value,
        answer: answer,
        state: state_tmp,
        readonly: value !== null,
      };
      row.cols.push(col);
    }
    result.rows.push(row);
  }
  return result;
}

function generateRowColNeighbours(gridObject) {
  const result = { rows: [] };

  for (let i = 0; i < 5; i++) {
    let row = { cols: [], index: i };
    let rows = { ...gridObject }.rows;

    for (let j = 0; j < 5; j++) {
      let tempArray = [];

      // Neighbours along the column
      if (j % 2 === 0) {
        for (let k = 0; k < 5; k++) {
          if (
            rows[k].cols[j].row !== i &&
            rows[k].cols[j].answer !== rows[k].cols[j].value
          ) {
            tempArray.push(rows[k].cols[j].answer);
          }
        }
      }

      // Neighbours along the rows
      for (let l = 0; l < 5; l++) {
        if (
          rows[i].cols[l].col !== j &&
          rows[i].cols[l].answer !== rows[i].cols[l].value
        ) {
          tempArray.push(rows[i].cols[l].answer);
        }
      }

      let attributes = {
        row: i,
        col: j,
        neighbours: tempArray,
      };

      row.cols.push(attributes);
    }
    result.rows.push(row);
  }
  return result;
}

export { generateNormalGrid, generateRowColNeighbours };
