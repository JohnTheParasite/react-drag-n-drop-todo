import type { TodoColumn as TodoColumnType } from "@/types";
import { TodoFilter } from "@/constants";
import { v4 as uuid } from "uuid";
import { useCallback, useState } from "react";

const useManageTodoBoardHeader = (
  columns: TodoColumnType[],
  setColumns: (columns: TodoColumnType[]) => void,
  setFilter: (filter: TodoFilter) => void
) => {
  const [newColumnTitle, setNewColumnTitle] = useState("");

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

  return {
    newColumnTitle,
    handleSetColumnTitle,
    handleAddColumn,
    handleSetFilterAll,
    handleSetFilterCompleted,
    handleSetFilterIncomplete,
  };
};

export default useManageTodoBoardHeader;
