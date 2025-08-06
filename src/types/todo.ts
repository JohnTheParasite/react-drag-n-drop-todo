export interface TodoItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface TodoColumn {
  id: string;
  title: string;
  todos: TodoItem[];
}

export interface TodoBoard {
  columns: TodoColumn[];
}

export interface TodoItemDragData {
  type: "todo-item";
  todoId: string;
  sourceColumnId: string;
}

export interface ColumnDragData {
  type: "column";
  columnId: string;
  sourceIndex: number;
}

export type DragData = TodoItemDragData | ColumnDragData;
