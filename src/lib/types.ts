export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
};

export type Folder = {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type TodoList = {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
};

export type TodoItem = {
  id: string;
  list_id: string;
  user_id: string;
  content: string;
  is_done: boolean;
  position: number;
  created_at: string;
};

export type FileRecord = {
  id: string;
  user_id: string;
  folder_id: string | null;
  storage_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
};

export type CalendarEvent = {
  id: string;
  user_id: string;
  title: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
};
