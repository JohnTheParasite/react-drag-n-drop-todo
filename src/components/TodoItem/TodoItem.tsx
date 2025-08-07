import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { type TodoItem as TodoItemType } from "@/types";
import useManageTodoItem from "./hooks/useManageTodoItem";
import classcat from "classcat";
import css from "./TodoItem.module.css";

type Props = {
  todo: TodoItemType;
  columnId: string;
  onToggleComplete: (todoId: string) => void;
  onEdit: (todoId: string, newText: string) => void;
  onDelete: (todoId: string) => void;
  isSelectMode: boolean;
  onToggleSelection: (todoId: string) => void;
};

export const TodoItem = ({
  todo,
  columnId,
  onToggleComplete,
  onEdit,
  onDelete,
  isSelectMode = false,
  onToggleSelection,
}: Props) => {
  const {
    ref,
    dragHandleRef,
    isDragging,
    isEditing,
    editText,
    setEditText,
    handleDelete,
    handleToggleComplete,
    handleEdit,
    handleOnBlur,
    handleKeyPress,
    handleToggleSelection,
  } = useManageTodoItem(
    todo,
    columnId,
    onEdit,
    onDelete,
    onToggleComplete,
    onToggleSelection
  );

  return (
    <div
      ref={ref}
      className={classcat([
        css.todoItem,
        {
          [css.completed]: todo.isCompleted,
          [css.dragging]: isDragging,
          [css.selected]: todo.isSelected,
        },
      ])}
    >
      <div className={css.todoContent}>
        {isSelectMode && (
          <input
            type="checkbox"
            checked={todo.isSelected}
            onChange={handleToggleSelection}
            className={css.selectionCheckbox}
            title="Select todo"
          />
        )}

        {isEditing ? (
          <TextInput
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleOnBlur}
            onKeyDown={handleKeyPress}
            placeholder="Enter task..."
          />
        ) : (
          <span
            className={css.todoText}
            onDoubleClick={isSelectMode ? undefined : handleEdit}
          >
            {todo.text}
          </span>
        )}

        {!isEditing && !isSelectMode && (
          <div
            ref={dragHandleRef}
            className={css.dragHandle}
            title="Drag to move"
          >
            ⋮⋮
          </div>
        )}
      </div>

      {!isSelectMode && (
        <div className={css.todoActions}>
          <span className={css.statusCompleted}>done</span>
          <div className={css.actions}>
            <Button
              title={
                todo.isCompleted ? "Mark as incomplete" : "Mark as complete"
              }
              className={css.editButton}
              onClick={handleToggleComplete}
            >
              {todo.isCompleted ? "❌" : "✅"}
            </Button>
            <Button
              title="Edit"
              className={css.editButton}
              onClick={handleEdit}
            >
              ✏️
            </Button>
            <Button
              title="Delete"
              className={css.deleteButton}
              data-id={todo.id}
              onClick={handleDelete}
            >
              🗑️
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
