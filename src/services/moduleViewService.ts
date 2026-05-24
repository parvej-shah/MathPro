/**
 * Service for module view tracking APIs
 * Handles recording module views and retrieving recent views
 */

import axios from "axios";
import { BACKEND_URL } from "@/api.config";

export interface RecordViewRequest {
  courseId: number;
  moduleId: number;
  chapterId: number;
}

export interface RecordViewResponse {
  success: boolean;
  message: string;
  data: {
    courseId: number;
    moduleId: number;
    chapterId: number;
    timestamp: number;
  };
}

export interface MostRecentModule {
  moduleId: number;
  chapterId: number;
  timestamp: number;
  isRecent: boolean;
}

export interface NextModule {
  moduleId: number;
  chapterId: number;
  moduleTitle: string;
  chapterTitle: string;
}

export interface MostRecentResponse {
  success: boolean;
  data: {
    courseId: number;
    mostRecent: MostRecentModule | null;
    nextModule: NextModule | null;
  };
}

/**
 * Record a module view
 * @param courseId - The course ID
 * @param moduleId - The module ID being viewed
 * @param chapterId - The chapter ID containing the module
 * @returns Promise with the response data
 */
export async function recordModuleView(
  courseId: number,
  moduleId: number,
  chapterId: number
): Promise<RecordViewResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.post<RecordViewResponse>(
      `${BACKEND_URL}/user/module/recordView`,
      {
        courseId,
        moduleId,
        chapterId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Log error but don't throw - allow graceful degradation
    console.warn("Failed to record module view:", error?.response?.data || error?.message);
    throw error;
  }
}

/**
 * Get the most recent module for a course
 * @param courseId - The course ID
 * @returns Promise with the most recent module and next module data
 */
export async function getMostRecentModule(
  courseId: number | string
): Promise<MostRecentResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.get<MostRecentResponse>(
      `${BACKEND_URL}/user/module/mostRecent/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Log error but don't throw - allow graceful degradation
    console.warn("Failed to get most recent module:", error?.response?.data || error?.message);
    throw error;
  }
}

