import React, { FormEvent } from 'react';

import styled from 'styled-components';
import CrosswordInputBox from './CrosswordInputBox';
import { Crossword } from '../../generated/generated';
import { useState } from 'react';
import { fromPromise } from '@apollo/client';


const CrosswordContainer = styled.div`
  border-bottom: solid 1px black;
  width: fit-content;
  margin: auto;
`;
const CrosswordRow = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export type CrosswordBoxContainerProps = { crossword: Crossword };
const CrosswordBoxContainer = ({ crossword }: CrosswordBoxContainerProps) => {  
  // Initialize empty crossword grid 
  const dimension : number = crossword.grid.dimension;
  const [grid, setGrid] = useState<string[][]>(Array(dimension).fill(Array(dimension).fill('')))

  const crosswordBoxInputHandler = (
    event: FormEvent<HTMLDivElement>,
    cellNumber: number
  ) => {
    let columnIndex = cellNumber % dimension
    let rowIndex = Math.floor(cellNumber/dimension)

    let input : string | undefined = event?.currentTarget?.textContent?.at(0);
    setGrid(currentState => {
      let newState : string [][] = Array(dimension).fill(Array(dimension).fill(''));
      for(let i = 0; i < dimension; i++){
        for(let j = 0; j < dimension; j++){
          newState[i][j] = currentState[i][j]
        }
      }
      newState[columnIndex][rowIndex] = input ? input : "";
      return newState;
    });

    if (event.currentTarget.nextSibling) {
      (event.currentTarget.nextSibling as HTMLElement).focus();
    }
  };

  
  const keyStrokeHandler = (
    event: React.KeyboardEvent<HTMLDivElement>,
    cellNumber: number
  ) => {
    let columnIndex = cellNumber % dimension
    let rowIndex = Math.floor(cellNumber/dimension)

    if (event.key === 'Backspace' || event.key === 'Delete') {
      (event.currentTarget as HTMLElement).textContent = '';

      setGrid(currentState => {
        let newState : string [][] = Array(dimension).fill(Array(dimension).fill(''));
        for(let i = 0; i < dimension; i++){
          for(let j = 0; j < dimension; j++){
            newState[i][j] = currentState[i][j]
          }
        }
        newState[columnIndex][rowIndex] =  "";
        return newState;
      });


      (event.currentTarget?.previousSibling as HTMLElement).focus();
      return;
    }
    if (event.key === 'ArrowUp' && event.currentTarget.previousSibling) {
      (event.currentTarget?.previousSibling as HTMLElement).focus();
    } else if (event.key === 'ArrowDown' && event.currentTarget.nextSibling) {
      (event.currentTarget.nextSibling as HTMLElement).focus();
    }
  };

  return (
    <CrosswordContainer>
      {grid.map( (row : string[], i : number) => 
        <CrosswordRow key={i}>
          {row.map( (column : string, j : number) =>{ 
            let cellIndex = i*dimension + j
            console.log("grid", grid[j][i])
            return <CrosswordInputBox
              key={cellIndex}
              onInput={(event) => crosswordBoxInputHandler(event, cellIndex)}
              onDelete={(event) => keyStrokeHandler(event, cellIndex)}
            />
           } )}
        </CrosswordRow>
      )}
    </CrosswordContainer>
  );
};

export default CrosswordBoxContainer;
