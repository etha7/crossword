import React, { FormEvent, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Crossword, Point, Answer } from '../../generated/generated';
import CrosswordInputBox from './CrosswordInputBox';
import CrosswordBlankBox from './CrosswordBlankBox';
import AnswerContainer from '../Answers/AnswerContainer';
import { nextTick } from 'process';
import { getActiveElement } from '@testing-library/user-event/dist/utils';
import { count } from 'console';

const Main = styled.div`
   width: fit-content;
   margin: auto;
   display: flex;
   flex-direction: row;
`;

const CrosswordContainer = styled.div`
   border-bottom: solid 1px black;
   width: fit-content;
   margin: auto;
`;
const CrosswordRow = styled.div`
   display: flex;
   flex-wrap: wrap;
`;
const BLANK_CHARACTER: string = '.'; // determines which cells in the answer should be empty

// Create a new empty Point[][] filled with undefined
function createBlankGrid(dimension: number): Point[][] {
   return Array(dimension)
      .fill(undefined as unknown as Point)
      .map(() => Array(dimension).fill(undefined as unknown as Point));
}

// Create a deep copy of any type
function deepCopy(array: any): any {
   let copy: any = JSON.parse(JSON.stringify(array));
   return copy;
}

// Compare two grids for equality
function checkAnswer(grid: Point[][], downAnswerMap: Map<number, Answer>, acrossAnswerMap: Map<number, Answer>): boolean {
   if (!downAnswerMap || !acrossAnswerMap) {
      return false;
   }

   for (let answer of downAnswerMap.values()) {
      let x = answer.location.x;
      let y = answer.location.y;
      for (let i = 0; i < answer.answer.length; i++) {
         if (grid[y + i][x].value.localeCompare(answer.answer[i], undefined, { sensitivity: 'accent' }) !== 0) {
            return false;
         }
      }
   }

   for (let answer of acrossAnswerMap.values()) {
      let x = answer.location.x;
      let y = answer.location.y;
      for (let i = 0; i < answer.answer.length; i++) {
         if (grid[y][x + i].value.localeCompare(answer.answer[i], undefined, { sensitivity: 'accent' }) !== 0) {
            return false;
         }
      }
   }

   return true;
}

export type CrosswordBoxContainerProps = { crossword: Crossword };
const CrosswordBoxContainer = ({ crossword }: CrosswordBoxContainerProps) => {
   // Initialize empty crossword grid
   const dimension: number = crossword.grid.dimension;

   // Initialize the across/down answer maps
   const [downAnswerMap, acrossAnswerMap] = useMemo<Map<number, Answer>[]>(() => {
      let downMap: Map<number, Answer> = new Map();
      crossword.answers.down.forEach((answer) => {
         downMap.set(answer.key, deepCopy(answer));
      });

      let acrossMap: Map<number, Answer> = new Map();
      crossword.answers.across.forEach((answer) => {
         acrossMap.set(answer.key, deepCopy(answer));
      });
      return [downMap, acrossMap];
   }, [crossword]);

   // Initialize the template grid
   const template = useMemo<Point[][]>(() => {
      let template: Point[][] = createBlankGrid(dimension);
      crossword.grid.points.forEach((point) => {
         template[point.y][point.x] = point;
         if (Number(point.value)) {
            let answer = downAnswerMap.get(Number(point.value));
            if (answer) {
               answer.location = deepCopy(point);
            }
            answer = acrossAnswerMap.get(Number(point.value));
            if (answer) {
               answer.location = deepCopy(point);
            }
         }
      });
      return template;
   }, [crossword, dimension]);

   const [grid, setGrid] = useState<Point[][]>(template);

   // Check if the crossword is complete
   useEffect(() => {
      if (checkAnswer(grid, downAnswerMap, acrossAnswerMap)) {
         alert('success!');
      }
   }, [grid, downAnswerMap, acrossAnswerMap]);

   // Update grid with newest input
   const crosswordBoxInputHandler = (event: FormEvent<HTMLDivElement>, cellNumber: number) => {
      let columnIndex = cellNumber % dimension;
      let rowIndex = Math.floor(cellNumber / dimension);
      event.currentTarget.textContent = event?.currentTarget?.textContent?.at(0) || '';
      let input: string = event?.currentTarget?.textContent?.at(0) || '';
      setGrid((currentGrid) => {
         var newGrid: Point[][] = deepCopy(currentGrid);
         newGrid[rowIndex][columnIndex].value = input ? input : currentGrid[rowIndex][columnIndex].value;
         return newGrid;
      });
      if (event.currentTarget.nextSibling) {
         (event.currentTarget.nextSibling as HTMLElement).focus();
      }
   };

   // On backspace/delete delete the current element from the grid
   const keyStrokeHandler = (event: React.KeyboardEvent<HTMLDivElement>, cellNumber: number) => {
      let columnIndex = cellNumber % dimension;
      let rowIndex = Math.floor(cellNumber / dimension);
      switch(event.key) {
         case 'Backspace': 
         case 'Delete': {
            (event.currentTarget as HTMLElement).textContent = '';

            setGrid((currentGrid) => {
               let newGrid: Point[][] = deepCopy(currentGrid);
               newGrid[rowIndex][columnIndex].value = '';
               return newGrid;
            });
            let next = event.currentTarget?.previousSibling as HTMLElement
            next && next.focus()
            break
         }
         case 'ArrowUp': {
            let next = event.currentTarget?.previousSibling as HTMLElement || event.currentTarget?.parentNode?.previousSibling?.lastChild as HTMLElement;
            next?.focus()
            let count = 0;
            while(next && !(next === getActiveElement(document)) && count < dimension*dimension){
               next = (next as ChildNode)?.previousSibling as HTMLElement || (next as ChildNode)?.parentNode?.previousSibling?.lastChild as HTMLElement
               next?.focus()
               count += 1
            }
            break
            
         }
         case 'ArrowDown': {
            let next = event.currentTarget?.nextSibling as HTMLElement || event.currentTarget?.parentNode?.nextSibling?.firstChild as HTMLElement;
            next?.focus()
            let count = 0;
            while(next && !(next === getActiveElement(document)) && count < dimension*dimension){
               next = (next as ChildNode)?.nextSibling as HTMLElement || (next as ChildNode)?.parentNode?.nextSibling?.firstChild as HTMLElement
               next?.focus()
               count += 1
            }
            break
         }
      }
   };


   return (
      <Main>
         <AnswerContainer type="Across:" answers={acrossAnswerMap} grid={grid}></AnswerContainer>
         <CrosswordContainer>
            {template.map((row, i) => (
               <CrosswordRow key={i}>
                  {row.map((point, j) => {
                     let cellIndex = i * dimension + j;
                     if (point.value === BLANK_CHARACTER) {
                        return <CrosswordBlankBox key={cellIndex} />;
                     } else {
                        return (
                           <CrosswordInputBox
                              key={cellIndex}
                              value={point.value}
                              onInput={(event) => crosswordBoxInputHandler(event, cellIndex)}
                              onDelete={(event) => keyStrokeHandler(event, cellIndex)}
                           />
                        );
                     }
                  })}
               </CrosswordRow>
            ))}
         </CrosswordContainer>
         <AnswerContainer type="Down:" answers={downAnswerMap} grid={grid}></AnswerContainer>
      </Main>
   );
};

export default CrosswordBoxContainer;
