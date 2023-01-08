import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { finished } from "stream";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  margin-top: 10vh;
`;

interface IForm {
  addToDo: string;
}
const Boards = styled.div`
  display: grid;
  width: 100%;
  height: 200px;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
`;
const AddForm = styled.div`
  margin-bottom: 10px;
  display: flex;
  width: 300px;
  input {
    width: 300px;
  }
`;
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ addToDo }: IForm) => {
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [addToDo]: [],
      };
    });
    setValue("addToDo", "");
  };
  const onDragEnd = (info: DropResult) => {
    const { destination, source, type } = info;
    if (!destination) return;
    if (type === "CARD" && destination?.droppableId === source.droppableId) {
      //same board movement
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (
      destination.droppableId !== "Remove" &&
      type === "CARD" &&
      destination.droppableId !== source.droppableId
    ) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];

        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
    if (destination.droppableId === "Remove") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (source.droppableId && destination.droppableId === "Boards") {
      setToDos((allBoards) => {
        const boardList = Object.keys(allBoards);
        const taskObj = boardList[source.index];
        boardList.splice(source.index, 1);
        boardList.splice(destination?.index, 0, taskObj);
        let boards = {};
        boardList.map((board) => {
          boards = { ...boards, [board]: allBoards[board] };
        });
        return {
          ...boards,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Droppable droppableId="Boards" direction="horizontal" type="BOARD">
          {(
            provided: DroppableProvided,
            {
              isDraggingOver,
              draggingOverWith,
              draggingFromThisWith,
              isUsingPlaceholder,
            }: DroppableStateSnapshot
          ) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                  boards={toDos}
                />
              ))}
              {provided.placeholder}

              <AddForm>
                <form onSubmit={handleSubmit(onValid)}>
                  <input
                    type="text"
                    {...register("addToDo", {
                      required: true,
                    })}
                    placeholder={`+ Add another list`}
                  />
                </form>
              </AddForm>
            </Boards>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}
export default App;
