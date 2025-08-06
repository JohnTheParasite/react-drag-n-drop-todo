import { type TodoColumn as TodoColumnType } from "@/types";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { TodoFilter } from "@/constants";
import css from "./TodoBoardHeader.module.css";
import classcat from "classcat";
import useManageTodoBoardHeader from "./hooks/useManageTodoBoardHeader";

type Props = {
  columns: TodoColumnType[];
  setColumns: (columns: TodoColumnType[]) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
};

export const TodoBoardHeader = ({
  columns,
  setColumns,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
}: Props) => {
  const {
    newColumnTitle,
    handleAddColumn,
    handleSetColumnTitle,
    handleSetFilterAll,
    handleSetFilterCompleted,
    handleSetFilterIncomplete,
  } = useManageTodoBoardHeader(columns, setColumns, setFilter);

  return (
    <>
      <header className={css.header}>
        <h1 className={css.title}>Todo Board</h1>
      </header>

      <div className={css.controls}>
        <div className={css.searchAndFilter}>
          <TextInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
          />

          <div className={css.filterButtons}>
            <Button
              onClick={handleSetFilterAll}
              className={classcat([
                css.filterButton,
                { [css.filterButtonActive]: filter === TodoFilter.ALL },
              ])}
            >
              All
            </Button>
            <Button
              onClick={handleSetFilterCompleted}
              className={classcat([
                css.filterButton,
                { [css.filterButtonActive]: filter === TodoFilter.COMPLETED },
              ])}
            >
              Completed
            </Button>
            <Button
              onClick={handleSetFilterIncomplete}
              className={classcat([
                css.filterButton,
                { [css.filterButtonActive]: filter === TodoFilter.INCOMPLETE },
              ])}
            >
              Incomplete
            </Button>
          </div>
        </div>

        <div className={css.actions}>
          <div className={css.addColumnSection}>
            <TextInput
              value={newColumnTitle}
              onChange={handleSetColumnTitle}
              placeholder="Enter column title..."
            />
            <Button
              onClick={handleAddColumn}
              className={css.addColumnButton}
              disabled={!newColumnTitle.trim()}
            >
              + Add Column
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoBoardHeader;
