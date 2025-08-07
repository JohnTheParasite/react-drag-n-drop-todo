import type { TodoColumn as TodoColumnType } from "@/types";
import { TodoFilter } from "@/constants";
import { v4 as uuid } from "uuid";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import type { TodoItem as TodoItemType } from "@/types/todo";

const useManageTodoBoardHeader = (
  columns: TodoColumnType[],
  setColumns: (columns: TodoColumnType[]) => void,
  setFilter: (filter: TodoFilter) => void,
  isSelectMode: boolean,
  setIsSelectMode: (isSelectMode: boolean) => void
) => {
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddColumn = useCallback(() => {
    if (newColumnTitle.trim()) {
      const newColumn: TodoColumnType = {
        id: uuid(),
        title: newColumnTitle.trim(),
        todos: [],
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
    }
  }, [columns, setColumns, newColumnTitle]);

  const handleSetColumnTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNewColumnTitle(value);
    },
    []
  );

  const handleSetFilterAll = useCallback(() => {
    setFilter(TodoFilter.ALL);
  }, [setFilter]);

  const handleSetFilterCompleted = useCallback(() => {
    setFilter(TodoFilter.COMPLETED);
  }, [setFilter]);

  const handleSetFilterIncomplete = useCallback(() => {
    setFilter(TodoFilter.INCOMPLETE);
  }, [setFilter]);

  const getSelectedTodos = useCallback(() => {
    const selectedTodos: Array<{
      todo: TodoItemType;
      columnId: string;
      columnIndex: number;
      todoIndex: number;
    }> = [];

    columns.forEach((column, columnIndex) => {
      column.todos.forEach((todo, todoIndex) => {
        if (todo.isSelected) {
          selectedTodos.push({
            todo,
            columnId: column.id,
            columnIndex,
            todoIndex,
          });
        }
      });
    });
    return selectedTodos;
  }, [columns]);

  const deleteSelected = useCallback(() => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      todos: column.todos.filter((todo) => !todo.isSelected),
    }));
    setColumns(updatedColumns);
    setIsDropdownOpen(false);
  }, [columns, setColumns, getSelectedTodos]);

  const markSelectedAsCompleted = useCallback(() => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      todos: column.todos.map((todo) =>
        todo.isSelected
          ? { ...todo, isCompleted: true, isSelected: false }
          : todo
      ),
    }));
    setColumns(updatedColumns);
    setIsDropdownOpen(false);
  }, [columns, setColumns]);

  const markSelectedAsIncomplete = useCallback(() => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      todos: column.todos.map((todo) =>
        todo.isSelected
          ? { ...todo, isCompleted: false, isSelected: false }
          : todo
      ),
    }));
    setColumns(updatedColumns);
    setIsDropdownOpen(false);
  }, [columns, setColumns]);

  const moveSelectedToColumn = useCallback(
    (targetColumnId: string) => {
      const selectedTodos = getSelectedTodos();
      if (selectedTodos.length === 0) return;

      const updatedColumns = columns.map((column) => {
        if (column.id === targetColumnId) {
          const todosToMove = selectedTodos
            .filter((item) => item.columnId !== targetColumnId)
            .map((item) => ({ ...item.todo, isSelected: false }));
          return {
            ...column,
            todos: [...column.todos, ...todosToMove],
          };
        } else {
          return {
            ...column,
            todos: column.todos.filter((todo) => !todo.isSelected),
          };
        }
      });
      setColumns(updatedColumns);
      setIsDropdownOpen(false);
    },
    [columns, setColumns, getSelectedTodos]
  );

  const toggleSelectMode = useCallback(() => {
    setIsSelectMode(!isSelectMode);

    if (isSelectMode) {
      const updatedColumns = columns.map((column) => ({
        ...column,
        todos: column.todos.map((todo) => ({ ...todo, isSelected: false })),
      }));
      setColumns(updatedColumns);
    }
  }, [isSelectMode, columns, setColumns]);

  const hasSelectedTodos = useMemo(() => {
    const selectedTodos = getSelectedTodos();
    return selectedTodos.length > 0;
  }, [getSelectedTodos]);

  const handleToggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    dropdownRef,
    newColumnTitle,
    isDropdownOpen,
    hasSelectedTodos,
    handleToggleDropdown,
    handleSetColumnTitle,
    handleAddColumn,
    handleSetFilterAll,
    handleSetFilterCompleted,
    handleSetFilterIncomplete,
    getSelectedTodos,
    deleteSelected,
    markSelectedAsCompleted,
    markSelectedAsIncomplete,
    moveSelectedToColumn,
    toggleSelectMode,
  };
};

export default useManageTodoBoardHeader;
