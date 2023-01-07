import { ALL } from "dns";
import React, { useState } from "react";
import { Draggable, DropResult } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, IToDoState, toDoState } from "../atoms";

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
  boards: any;
}
const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
  display: flex;
  justify-content: space-between;
`;
const Form = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  input {
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 10px 10px;
    background-color: ${(props) => props.theme.cardColor};
    display: flex;
    justify-content: space-between;
  }
`;
const DraggableCard = ({
  toDoId,
  toDoText,
  index,
  boardId,
  boards,
}: IDragabbleCardProps) => {
  const setToDos = useSetRecoilState(toDoState);
  const onDeleteClick = () => {
    setToDos((allBoards) => {
      let copyBoards = { ...allBoards };
      const result = copyBoards[boardId].filter((item) => item.id !== toDoId);
      console.log(result);
      copyBoards[boardId] = result;
      return { ...copyBoards };
    });
  };
  const [editState, setEditState] = useState(false);
  const [textEdited, setTextEdited] = useState("");
  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textEdited === "") {
      alert("한글자 이상 써주세요");
      return;
    }
    setToDos((allBoards) => {
      let copyBoards = { ...allBoards };
      console.log(copyBoards[boardId][index]);
      copyBoards[boardId][index]["text"] = textEdited;
      setEditState((prev) => !prev);
      return { ...copyBoards };
    });
  };
  return (
    <div>
      {editState === false ? (
        <Draggable draggableId={toDoId + ""} index={index}>
          {(provided) => (
            <Card
              onClick={() => {
                setEditState((prev) => !prev);
              }}
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
      ) : (
        <Form onSubmit={onHandleSubmit}>
          <input
            onChange={(e) => {
              e.preventDefault();
              setTextEdited(e.target.value);
            }}
          ></input>
        </Form>
      )}
    </div>
  );
};

export default React.memo(DraggableCard);
