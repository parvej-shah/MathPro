/**
 * Minimal shared shapes for the course player. The backend payload is large and
 * loosely typed; these capture only the fields the player actually reads so the
 * extracted components/hooks can avoid `any` without a full schema.
 */

export type ModuleCategory =
  | "VIDEO"
  | "PDF"
  | "TEXT"
  | "QUIZ"
  | "ASSIGNMENT"
  | "CODE";

export interface ModuleData {
  category?: ModuleCategory | string;
  quiz?: unknown[];
  is_cf?: boolean;
  cf_name?: string;
  youtube_id?: string;
  [key: string]: unknown;
}

export interface CourseModule {
  id: number;
  title: string;
  serial: number;
  score: number;
  chapter_id: number;
  is_free?: boolean;
  description?: string;
  data?: ModuleData;
  [key: string]: unknown;
}

export interface Chapter {
  id: number;
  title: string;
  is_live?: boolean;
  is_free?: boolean;
  allowed_unlock?: boolean;
  modules: CourseModule[];
  [key: string]: unknown;
}

export interface Course {
  isTaken?: boolean;
  maxModuleSerialProgress?: number;
  chapters: Chapter[];
  [key: string]: unknown;
}
