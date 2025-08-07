import { TodoColumn } from "@/components/TodoColumn";
import TodoBoardHeader from "./TodoBoardHeader/TodoBoardHeader";
import css from "./TodoBoard.module.css";
import useManageTodoBoard from "./hooks/useManageTodoBoard";

export const TodoBoard = () => {
  const {
    boardRef,
    columns,
    filter,
    searchTerm,
    isSelectMode,
    setColumns,
    setSearchTerm,
    setFilter,
    handleDeleteColumn,
    handleEditColumnTitle,
    handleAddTodo,
    handleToggleComplete,
    handleEditTodo,
    handleDeleteTodo,
    handleMoveTodo,
    setIsSelectMode,
    handleToggleSelection,
    handleSelectAllInColumn,
    handleDeselectAllInColumn,
  } = useManageTodoBoard();

  return (
    <div className={css.board}>
      <TodoBoardHeader
        columns={columns}
        setColumns={setColumns}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        isSelectMode={isSelectMode}
        setIsSelectMode={setIsSelectMode}
      />

      {columns.length > 0 && (
        <div className={css.container}>
          <div ref={boardRef} className={css.columns}>
            {columns.map((column, index) => (
              <TodoColumn
                key={column.id}
                column={column}
                columnIndex={index}
                onAddTodo={handleAddTodo}
                onToggleComplete={handleToggleComplete}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
                onMoveTodo={handleMoveTodo}
                onDeleteColumn={handleDeleteColumn}
                onEditColumnTitle={handleEditColumnTitle}
                searchTerm={searchTerm}
                filter={filter}
                isSelectMode={isSelectMode}
                onToggleSelection={handleToggleSelection}
                onSelectAllInColumn={handleSelectAllInColumn}
                onDeselectAllInColumn={handleDeselectAllInColumn}
              />
            ))}
          </div>
        </div>
      )}

      {columns.length === 0 && (
        <div className={css.empty}>
          <h3>Create your first column to get started</h3>
        </div>
      )}
    </div>
  );
};

export default TodoBoard;
