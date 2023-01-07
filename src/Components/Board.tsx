import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { DropResult } from "react-beautiful-dnd";
const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 14vw;
  background-color: ${(props) => props.theme.boardColor};
  padding-top: 10px;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  height: 360px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  flex-grow: 1;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  input {
    width: 95%;
  }
`;
const Header = styled.div<{ isDragging: boolean }>`
  padding-top: 10px;
  border-radius: 5px 5px 0 0;
`;
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  index: number;
  boards: {};
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, index, boards }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>({});
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });

    setValue("toDo", "");
  };
  const onDeleteClick = () => {
    setToDos((prev) => {
      const cp = { ...prev };
      delete cp[boardId];
      return { ...cp };
    });
  };
  return (
    <Draggable draggableId={boardId} index={index}>
      {(provided, snapshot) => (
        <Wrapper
          key={index} // index -> boardId
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          {...provided.draggableProps}
        >
          <Header
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
          >
            <Title>
              {boardId}{" "}
              <button
                onClick={() => {
                  console.log(typeof boards);
                  if (Object.keys(boards).length >= 3) {
                    onDeleteClick();
                  }
                }}
              >
                delete
              </button>
            </Title>
            <Form onSubmit={handleSubmit(onValid)}>
              <input
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`Add task on ${boardId}`}
              />
            </Form>
          </Header>
          <Droppable droppableId={boardId} direction="vertical" type="CARD">
            {(magic, info) => (
              <Area
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos?.map((toDo, index) => (
                  <DraggableCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                    boardId={boardId}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default Board;
