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
  isSelectMode: boolean;
  setIsSelectMode: (isSelectMode: boolean) => void;
};

export const TodoBoardHeader = ({
  columns,
  setColumns,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  isSelectMode,
  setIsSelectMode,
}: Props) => {
  const {
    dropdownRef,
    newColumnTitle,
    isDropdownOpen,
    hasSelectedTodos,
    handleToggleDropdown,
    handleSetColumnTitle,
    handleAddColumn,
    handleAddColumnKeyPress,
    handleSetFilterAll,
    handleSetFilterCompleted,
    handleSetFilterIncomplete,
    deleteSelected,
    markSelectedAsCompleted,
    markSelectedAsIncomplete,
    moveSelectedToColumn,
    toggleSelectMode,
  } = useManageTodoBoardHeader(
    columns,
    setColumns,
    setFilter,
    isSelectMode,
    setIsSelectMode
  );

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
          {!isSelectMode && (
            <div className={css.addColumnSection}>
              <TextInput
                value={newColumnTitle}
                onChange={handleSetColumnTitle}
                onKeyDown={handleAddColumnKeyPress}
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
          )}
        </div>
      </div>

      <div className={css.selectControls}>
        <Button
          onClick={toggleSelectMode}
          className={classcat([
            css.selectButton,
            { [css.selectButtonActive]: isSelectMode },
          ])}
        >
          {isSelectMode ? "Exit Select" : "Select"}
        </Button>

        {isSelectMode && hasSelectedTodos && (
          <div className={css.dropdownContainer} ref={dropdownRef}>
            <Button
              onClick={handleToggleDropdown}
              className={css.dropdownButton}
            >
              Select Actions ▼
            </Button>

            {isDropdownOpen && (
              <div className={css.dropdownMenu}>
                <button className={css.dropdownItem} onClick={deleteSelected}>
                  Delete Selected
                </button>
                <button
                  className={css.dropdownItem}
                  onClick={markSelectedAsCompleted}
                >
                  Mark as Completed
                </button>
                <button
                  className={css.dropdownItem}
                  onClick={markSelectedAsIncomplete}
                >
                  Mark as Incomplete
                </button>

                {columns.length > 1 && (
                  <>
                    <div className={css.dropdownDivider}></div>
                    <div className={css.moveSection}>
                      <span className={css.moveLabel}>Move to:</span>
                      {columns.map((column) => (
                        <button
                          key={column.id}
                          className={css.dropdownItem}
                          onClick={() => moveSelectedToColumn(column.id)}
                        >
                          {column.title}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TodoBoardHeader;
