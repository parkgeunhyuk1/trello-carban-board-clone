import { ALL } from "dns";
import React from "react";
import { Draggable, DropResult } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, IToDoState, toDoState } from "../atoms";

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}
const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
  display: flex;
  justify-content: space-between;
`;

const DraggableCard = ({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDragabbleCardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const onDeleteClick = () => {
    setToDos((allBoards) => {
      let copyBoards = { ...allBoards };
      const result = copyBoards[boardId].filter((item) => item.id !== toDoId);
      console.log(result);
      copyBoards[boardId] = result;
      return copyBoards;
    });
  };

  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {toDoText}
          <button
            onClick={() => {
              onDeleteClick();
            }}
          >
            Delete
          </button>
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
