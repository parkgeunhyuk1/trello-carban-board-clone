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
    setToDos((prev) => {
      const cp = { ...prev };
      console.log(cp);
      console.log(toDoId);
      console.log(cp[boardId]);
      console.log(cp[boardId][index]);
      const result = cp[boardId].filter((item) => item.id === toDoId);
      console.log(result);
      return { ...cp, result }; //그래서 여기에 ...cp 붙여주면 되는데? 왜 result 시발
    });
  };
  //문제점: 필터로 다른 보드까지 다건드리는거임 지금. 그리고 왜 result로 바뀌는지 파악해봐야함

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
