import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { type TodoItem as TodoItemType, type TodoItemDragData } from "@/types";

const useManageTodoItem = (
  todo: TodoItemType,
  columnId: string,
  onEdit: (todoId: string, newText: string) => void,
  onDelete: (todoId: string) => void,
  onToggleComplete: (todoId: string) => void,
  onToggleSelection: (todoId: string) => void
) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleApplyChanges = useCallback(() => {
    if (isEditing) {
      if (editText.trim() !== todo.text && editText.trim() !== "") {
        onEdit(todo.id, editText.trim());
      } else {
        setEditText(todo.text);
      }
      setIsEditing(false);
    }
  }, [isEditing, editText, todo.text, todo.id, onEdit]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleOnBlur = useCallback(
    () => handleApplyChanges(),
    [handleApplyChanges]
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleApplyChanges();
      } else if (event.key === "Escape") {
        setEditText(todo.text);
        setIsEditing(false);
      }
    },
    [handleApplyChanges, todo.text]
  );

  const handleDelete = useCallback(
    () => onDelete(todo.id),
    [todo.id, onDelete]
  );

  const handleToggleComplete = useCallback(
    () => onToggleComplete(todo.id),
    [todo.id, onToggleComplete]
  );
  const handleToggleSelection = useCallback(
    () => onToggleSelection(todo.id),
    [todo.id, onToggleSelection]
  );

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;
    if (!element || !dragHandle) return;

    const dragData: TodoItemDragData = {
      type: "todo-item",
      todoId: todo.id,
      sourceColumnId: columnId,
    };

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({
          ...dragData,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      })
    );
  }, [todo.id, columnId]);

  return {
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
    handleApplyChanges,
    handleToggleSelection,
  };
};

export default useManageTodoItem;
