import React from "react";
import { type TodoColumn as TodoColumnType } from "@/types/todo";
import { Button } from "@/components/Button";
import { TodoItem } from "@/components/TodoItem";
import { TodoFilter } from "@/constants/filters";
import { TextInput } from "@/components/TextInput";
import classcat from "classcat";
import css from "./TodoColumn.module.css";
import useManageTodoColumn from "./hooks/useManageTodoColumn";

type Props = {
  column: TodoColumnType;
  columnIndex: number;
  onAddTodo: (columnId: string, text: string) => void;
  onToggleComplete: (columnId: string, todoId: string) => void;
  onEditTodo: (columnId: string, todoId: string, newText: string) => void;
  onDeleteTodo: (columnId: string, todoId: string) => void;
  onMoveTodo: (
    sourceColumnId: string,
    targetColumnId: string,
    todoId: string,
    targetIndex?: number
  ) => void;
  onDeleteColumn: (columnId: string) => void;
  onEditColumnTitle: (columnId: string, newTitle: string) => void;
  searchTerm: string;
  filter: TodoFilter;
  isSelectMode: boolean;
  onToggleSelection: (columnId: string, todoId: string) => void;
  onSelectAllInColumn: (columnId: string) => void;
  onDeselectAllInColumn: (columnId: string) => void;
};

export const TodoColumn = ({
  column,
  columnIndex,
  onAddTodo,
  onToggleComplete,
  onEditTodo,
  onDeleteTodo,
  onMoveTodo,
  onDeleteColumn,
  onEditColumnTitle,
  searchTerm,
  filter,
  isSelectMode = false,
  onToggleSelection,
  onSelectAllInColumn,
  onDeselectAllInColumn,
}: Props) => {
  const {
    ref,
    columnDragHandleRef,
    isDraggedOver,
    isColumnDragging,
    newTodoText,
    isEditingTitle,
    editTitle,
    handleSetNewTodoText,
    handleEditColumnTitle,
    handleAddTodo,
    handleNewTodoKeyPress,
    handleEditTitle,
    handleTitleKeyPress,
    handleSetEditTitle,
    handleDeleteColumn,
    filteredTodos,
    completedCount,
    totalCount,
    selectedTodosInColumn,
  } = useManageTodoColumn(
    column,
    columnIndex,
    onAddTodo,
    onMoveTodo,
    onDeleteColumn,
    onEditColumnTitle,
    searchTerm,
    filter
  );

  return (
    <div
      ref={ref}
      className={classcat([
        css.todoColumn,
        {
          [css.draggedOver]: isDraggedOver,
          [css.columnDragging]: isColumnDragging,
        },
      ])}
      data-testid={`todo-column-${column.id}`}
    >
      <div className={css.columnHeader}>
        {!isEditingTitle && (
          <div
            ref={columnDragHandleRef}
            className={css.dragHandle}
            title="Drag to move column"
          >
            ⋮⋮
          </div>
        )}

        {isEditingTitle ? (
          <TextInput
            value={editTitle}
            onChange={handleEditColumnTitle}
            onBlur={handleEditTitle}
            onKeyDown={handleTitleKeyPress}
          />
        ) : (
          <h3
            className={css.columnTitle}
            onDoubleClick={isSelectMode ? undefined : handleSetEditTitle}
          >
            {column.title}
          </h3>
        )}

        {!isEditingTitle && !isSelectMode && (
          <div className={css.columnActions}>
            <span className={css.todoCount}>
              {completedCount}/{totalCount}
            </span>
            <Button
              onClick={handleEditTitle}
              className={css.editTitleButton}
              title="Edit title"
            >
              ✏️
            </Button>
            <Button
              onClick={handleDeleteColumn}
              className={css.deleteColumnButton}
              title="Delete column"
            >
              🗑️
            </Button>
          </div>
        )}
      </div>

      {isSelectMode && (
        <div className={css.columnSelectionControls}>
          <div className={css.selectionInfo}>
            <span className={css.selectedCount}>
              {selectedTodosInColumn} selected
            </span>
          </div>
          <div className={css.selectionButtons}>
            <Button
              onClick={() => onSelectAllInColumn(column.id)}
              className={css.selectionButton}
            >
              Select All
            </Button>
            <Button
              onClick={() => onDeselectAllInColumn(column.id)}
              className={css.selectionButton}
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {!isSelectMode && (
        <div className={css.addTodoForm}>
          <TextInput
            value={newTodoText}
            onChange={handleSetNewTodoText}
            onKeyDown={handleNewTodoKeyPress}
            placeholder="Add a new task..."
          />
          <Button
            className={css.addTodoButton}
            onClick={handleAddTodo}
            disabled={!newTodoText.trim()}
          >
            +
          </Button>
        </div>
      )}

      <div className={css.todoList} data-testid="todo-list">
        {filteredTodos.length === 0 ? (
          <div className={css.emptyState}>
            {searchTerm || filter !== TodoFilter.ALL
              ? "No matching tasks"
              : "No tasks yet"}
          </div>
        ) : (
          <>
            {filteredTodos.map((todo) => (
              <React.Fragment key={todo.id}>
                <TodoItem
                  todo={todo}
                  columnId={column.id}
                  onToggleComplete={(todoId) =>
                    onToggleComplete(column.id, todoId)
                  }
                  onEdit={(todoId, newText) =>
                    onEditTodo(column.id, todoId, newText)
                  }
                  onDelete={(todoId) => onDeleteTodo(column.id, todoId)}
                  isSelectMode={isSelectMode}
                  onToggleSelection={(todoId) =>
                    onToggleSelection(column.id, todoId)
                  }
                  searchTerm={searchTerm}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </div>

      {isDraggedOver && <div className={css.dropIndicator}>Drop task here</div>}
    </div>
  );
};

export default TodoColumn;
