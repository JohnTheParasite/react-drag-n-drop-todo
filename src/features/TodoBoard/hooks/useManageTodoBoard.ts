import { useState, useEffect, useRef, useCallback } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import type { TodoColumn as TodoColumnType, TodoItem, DragData } from "@/types";
import { TodoFilter, LocalStorageKeys } from "@/constants";
import { v4 as uuid } from "uuid";

const initialColumns: TodoColumnType[] = [
  {
    id: uuid(),
    title: "Personal",
    todos: [
      {
        id: uuid(),
        text: "Buy a new phone",
        isCompleted: false,
      },
      {
        id: uuid(),
        text: "Buy a new laptop",
        isCompleted: false,
      },
    ],
  },
  {
    id: uuid(),
    title: "Work",
    todos: [
      {
        id: uuid(),
        text: "Finish the project",
        isCompleted: false,
      },
      {
        id: uuid(),
        text: "Have a meeting with the team",
        isCompleted: true,
      },
    ],
  },
  {
    id: uuid(),
    title: "Home",
    todos: [
      {
        id: uuid(),
        text: "Buy a new fridge",
        isCompleted: false,
      },
      {
        id: uuid(),
        text: "Buy a new TV",
        isCompleted: true,
      },
    ],
  },
];

const useManageTodoBoard = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<TodoColumnType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(TodoFilter.ALL);

  const handleDeleteColumn = useCallback(
    (columnId: string) =>
      setColumns(columns.filter((column) => column.id !== columnId)),
    [columns]
  );

  const handleEditColumnTitle = useCallback(
    (columnId: string, newTitle: string) => {
      setColumns(
        columns.map((column) =>
          column.id === columnId ? { ...column, title: newTitle } : column
        )
      );
    },
    [columns]
  );

  const handleAddTodo = useCallback(
    (columnId: string, text: string) => {
      const newTodo: TodoItem = {
        id: uuid(),
        text,
        isCompleted: false,
      };

      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? { ...column, todos: [...column.todos, newTodo] }
            : column
        )
      );
    },
    [columns]
  );

  const handleToggleComplete = useCallback(
    (columnId: string, todoId: string) => {
      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                todos: column.todos.map((todo) =>
                  todo.id === todoId
                    ? {
                        ...todo,
                        isCompleted: !todo.isCompleted,
                        updatedAt: new Date(),
                      }
                    : todo
                ),
              }
            : column
        )
      );
    },
    [columns]
  );

  const handleEditTodo = useCallback(
    (columnId: string, todoId: string, newText: string) => {
      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                todos: column.todos.map((todo) =>
                  todo.id === todoId
                    ? { ...todo, text: newText, updatedAt: new Date() }
                    : todo
                ),
              }
            : column
        )
      );
    },
    [columns]
  );

  const handleDeleteTodo = useCallback(
    (columnId: string, todoId: string) => {
      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                todos: column.todos.filter((todo) => todo.id !== todoId),
              }
            : column
        )
      );
    },
    [columns]
  );

  const handleMoveTodo = useCallback(
    (
      sourceColumnId: string,
      targetColumnId: string,
      todoId: string,
      targetIndex?: number
    ) => {
      const sourceColumn = columns.find((col) => col.id === sourceColumnId);
      const todo = sourceColumn?.todos.find((todo) => todo.id === todoId);

      if (!todo) return;

      if (sourceColumnId === targetColumnId && targetIndex !== undefined) {
        const updatedColumns = columns.map((column) => {
          if (column.id === sourceColumnId) {
            const newTodos = [...column.todos];
            const currentIndex = newTodos.findIndex((t) => t.id === todoId);

            if (currentIndex !== -1) {
              const [movedTodo] = newTodos.splice(currentIndex, 1);
              newTodos.splice(targetIndex, 0, {
                ...movedTodo,
              });
            }

            return {
              ...column,
              todos: newTodos,
            };
          }
          return column;
        });

        setColumns(updatedColumns);
      } else {
        const updatedColumns = columns.map((column) => {
          if (column.id === sourceColumnId) {
            return {
              ...column,
              todos: column.todos.filter((todo) => todo.id !== todoId),
            };
          }
          if (column.id === targetColumnId) {
            const newTodos = [...column.todos];
            const updatedTodo = { ...todo, updatedAt: new Date() };

            if (targetIndex !== undefined) {
              newTodos.splice(targetIndex, 0, updatedTodo);
            } else {
              newTodos.push(updatedTodo);
            }

            return {
              ...column,
              todos: newTodos,
            };
          }
          return column;
        });

        setColumns(updatedColumns);
      }
    },
    [columns]
  );

  const handleMoveColumn = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) return;

      const newColumns = [...columns];
      const [movedColumn] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(targetIndex, 0, movedColumn);

      setColumns(newColumns);
    },
    [columns]
  );

  useEffect(() => {
    const element = boardRef.current;
    if (!element) return;

    return combine(
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          const data = source.data as unknown as DragData;
          return data.type === "column";
        },
        onDrop: ({ source, location }) => {
          const data = source.data as unknown as DragData;
          if (data.type === "column") {
            const dropTargets = location.current.dropTargets;
            const boardDropTarget = dropTargets.find(
              (target) => target.element === element
            );

            if (boardDropTarget) {
              const boardRect = element.getBoundingClientRect();
              const mouseX = location.current.input.clientX;
              const relativeX = mouseX - boardRect.left;

              const columnWidth = 320 + 16; // column width + margin
              const targetIndex = Math.floor(relativeX / columnWidth);
              const clampedTargetIndex = Math.max(
                0,
                Math.min(targetIndex, columns.length - 1)
              );

              if (data.sourceIndex !== clampedTargetIndex) {
                handleMoveColumn(data.sourceIndex, clampedTargetIndex);
              }
            }
          }
        },
      })
    );
  }, [columns]);

  useEffect(() => {
    const savedData = localStorage.getItem(LocalStorageKeys.TodoBoard);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const restoredColumns = parsedData.map((column: any) => ({
          ...column,
          createdAt: new Date(column.createdAt),
          todos: column.todos.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
          })),
        }));
        setColumns(restoredColumns);
      } catch (error) {
        console.error("Failed to load data from localStorage:", error);
        setColumns(initialColumns);
      }
    } else {
      setColumns(initialColumns);
    }
  }, []);

  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem(LocalStorageKeys.TodoBoard, JSON.stringify(columns));
    }
  }, [columns]);

  return {
    boardRef,
    columns,
    setColumns,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    handleDeleteColumn,
    handleEditColumnTitle,
    handleAddTodo,
    handleToggleComplete,
    handleEditTodo,
    handleDeleteTodo,
    handleMoveTodo,
  };
};

export default useManageTodoBoard;
