import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  dropTargetForElements,
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  type DragData,
  type ColumnDragData,
  type TodoColumn as TodoColumnType,
} from "@/types";
import { TodoFilter } from "@/constants";

const useManageTodoColumn = (
  column: TodoColumnType,
  columnIndex: number,
  onAddTodo: (columnId: string, text: string) => void,
  onMoveTodo: (
    sourceColumnId: string,
    targetColumnId: string,
    todoId: string,
    targetIndex?: number
  ) => void,
  onDeleteColumn: (columnId: string) => void,
  onEditColumnTitle: (columnId: string, newTitle: string) => void,
  searchTerm: string,
  filter: TodoFilter
) => {
  const ref = useRef<HTMLDivElement>(null);
  const columnDragHandleRef = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isColumnDragging, setIsColumnDragging] = useState(false);
  const [, setTodoDropIndex] = useState<number | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const filteredTodos = useMemo(
    () =>
      column.todos.filter((todo) => {
        const matchesSearch = todo.text
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesFilter =
          filter === TodoFilter.ALL ||
          (filter === TodoFilter.COMPLETED && todo.isCompleted) ||
          (filter === TodoFilter.INCOMPLETE && !todo.isCompleted);

        return matchesSearch && matchesFilter;
      }),
    [column.todos, searchTerm, filter]
  );

  const completedCount = useMemo(
    () => column.todos.filter((todo) => todo.isCompleted).length,
    [column.todos]
  );
  const totalCount = useMemo(() => column.todos.length, [column.todos]);
  const handleEditColumnTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value),
    []
  );

  const handleAddTodo = useCallback(() => {
    if (newTodoText.trim()) {
      onAddTodo(column.id, newTodoText.trim());
      setNewTodoText("");
    }
  }, [column.id, newTodoText, onAddTodo]);

  const handleEditTitle = useCallback(() => {
    if (isEditingTitle) {
      if (editTitle.trim() !== column.title && editTitle.trim() !== "") {
        onEditColumnTitle(column.id, editTitle.trim());
      } else {
        setEditTitle(column.title);
      }
      setIsEditingTitle(false);
    } else {
      setIsEditingTitle(true);
    }
  }, [column.id, column.title, editTitle, isEditingTitle, onEditColumnTitle]);

  const handleTitleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEditTitle();
      } else if (e.key === "Escape") {
        setEditTitle(column.title);
        setIsEditingTitle(false);
      }
    },
    [column.title, handleEditTitle]
  );

  const handleSetEditTitle = useCallback(() => setIsEditingTitle(true), []);

  const handleDeleteColumn = useCallback(
    () => onDeleteColumn(column.id),
    [column.id, onDeleteColumn]
  );

  const handleSetNewTodoText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewTodoText(e.target.value),
    []
  );

  useEffect(() => {
    const element = ref.current;
    const columnDragHandle = columnDragHandleRef.current;
    if (!element || !columnDragHandle) return;

    const columnDragData: ColumnDragData = {
      type: "column",
      columnId: column.id,
      sourceIndex: columnIndex,
    };

    return combine(
      draggable({
        element,
        dragHandle: columnDragHandle,
        getInitialData: () => ({
          ...columnDragData,
        }),
        onDragStart: () => setIsColumnDragging(true),
        onDrop: () => setIsColumnDragging(false),
      }),

      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          const data = source.data as unknown as DragData;
          return data.type === "todo-item";
        },
        onDragEnter: ({ source }) => {
          const data = source.data as unknown as DragData;
          if (data.type === "todo-item") {
            setIsDraggedOver(true);

            if (data.sourceColumnId === column.id) {
              setTodoDropIndex(column.todos.length);
            }
          }
        },
        onDragLeave: ({ source }) => {
          const data = source.data as unknown as DragData;
          if (data.type === "todo-item") {
            setIsDraggedOver(false);
            setTodoDropIndex(null);
          }
        },
        onDrop: ({ source, location }) => {
          const data = source.data as unknown as DragData;
          if (data.type === "todo-item") {
            setIsDraggedOver(false);
            setTodoDropIndex(null);

            if (data.sourceColumnId !== column.id) {
              onMoveTodo(data.sourceColumnId, column.id, data.todoId);
            } else {
              const todoListElement = ref.current!.querySelector(
                '[data-testid="todo-list"]'
              ) as HTMLElement;

              if (todoListElement) {
                const currentFilteredTodos = column.todos.filter((todo) => {
                  const matchesSearch = todo.text
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                  const matchesFilter =
                    filter === TodoFilter.ALL ||
                    (filter === TodoFilter.COMPLETED && todo.isCompleted) ||
                    (filter === TodoFilter.INCOMPLETE && !todo.isCompleted);
                  return matchesSearch && matchesFilter;
                });

                const todoListRect = todoListElement.getBoundingClientRect();
                const mouseY = location.current.input.clientY;
                const todoListRelativeY = mouseY - todoListRect.top;
                const todoItemHeight = 68;
                const targetIndexInFiltered = Math.max(
                  0,
                  Math.floor(todoListRelativeY / todoItemHeight)
                );
                const clampedTargetInFiltered = Math.min(
                  targetIndexInFiltered,
                  currentFilteredTodos.length - 1
                );

                const currentIndexInOriginal = column.todos.findIndex(
                  (todo) => todo.id === data.todoId
                );

                if (
                  currentIndexInOriginal !== -1 &&
                  clampedTargetInFiltered < currentFilteredTodos.length
                ) {
                  const targetTodo =
                    currentFilteredTodos[clampedTargetInFiltered];
                  const targetIndexInOriginal = column.todos.findIndex(
                    (todo) => todo.id === targetTodo.id
                  );

                  if (
                    targetIndexInOriginal !== -1 &&
                    currentIndexInOriginal !== targetIndexInOriginal
                  ) {
                    onMoveTodo(
                      data.sourceColumnId,
                      column.id,
                      data.todoId,
                      targetIndexInOriginal
                    );
                  }
                } else if (
                  clampedTargetInFiltered === currentFilteredTodos.length
                ) {
                  const targetIndexInOriginal = column.todos.length - 1;
                  if (currentIndexInOriginal !== targetIndexInOriginal) {
                    onMoveTodo(
                      data.sourceColumnId,
                      column.id,
                      data.todoId,
                      targetIndexInOriginal
                    );
                  }
                }
              }
            }
          }
        },
      })
    );
  }, [column.id, columnIndex, onMoveTodo, column.todos, searchTerm, filter]);

  return {
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
    handleEditTitle,
    handleTitleKeyPress,
    handleSetEditTitle,
    handleDeleteColumn,
    filteredTodos,
    completedCount,
    totalCount,
  };
};

export default useManageTodoColumn;
