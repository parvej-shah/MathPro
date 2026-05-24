/**
 * Utility functions for unrestricted module access feature
 * Handles smart module selection and backend API integration
 */

import { getMostRecentModule, recordModuleView } from "@/services/moduleViewService";

// ============================================================================
// Type Definitions
// ============================================================================

export interface LastAccessedModule {
  moduleId: number;
  chapterId: number;
  timestamp: number; // Unix timestamp in milliseconds
}

export interface CourseData {
  chapters: Chapter[];
  maxModuleSerialProgress: number;
  isTaken: boolean;
  [key: string]: any;
}

export interface Chapter {
  id: number;
  modules: Module[];
  is_live: boolean;
  [key: string]: any;
}

export interface Module {
  id: number;
  chapter_id: number;
  serial: number;
  title: string;
  is_free: boolean;
  is_live: boolean;
  data: any;
  score: number;
  [key: string]: any;
}

export interface SmartModuleSelectorInput {
  courseData: CourseData;
  courseId: string;
  requestedModuleId?: number;
  requestedChapterId?: number;
}

export interface SmartModuleSelectorOutput {
  moduleId: number;
  chapterId: number;
  reason: "url" | "next" | "recent" | "progress" | "completed" | "first-time";
}

// ============================================================================
// Constants
// ============================================================================

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000; // 604800000 milliseconds
const LOCAL_STORAGE_KEY_PREFIX = "lms_last_module_";

// ============================================================================
// Local Storage Management Functions
// ============================================================================

/**
 * Saves the last accessed module to backend
 * @param courseId - The ID of the course
 * @param moduleId - The ID of the module being accessed
 * @param chapterId - The ID of the chapter containing the module
 */
export async function saveLastAccessedModule(
  courseId: string,
  moduleId: number,
  chapterId: number
): Promise<void> {
  try {
    const courseIdNum = parseInt(courseId);
    if (isNaN(courseIdNum)) {
      console.warn("Invalid courseId:", courseId);
      return;
    }

    await recordModuleView(courseIdNum, moduleId, chapterId);
  } catch (error) {
    // Gracefully handle errors - don't block user experience
    console.warn("Failed to save last accessed module to backend:", error);
  }
}

/**
 * Retrieves the last accessed module from backend
 * @param courseId - The ID of the course
 * @returns The last accessed module data or null if not found/invalid
 */
export async function getLastAccessedModule(
  courseId: string
): Promise<LastAccessedModule | null> {
  try {
    const courseIdNum = parseInt(courseId);
    if (isNaN(courseIdNum)) {
      return null;
    }

    const response = await getMostRecentModule(courseIdNum);
    
    if (response.success && response.data.mostRecent && response.data.mostRecent.isRecent) {
      return {
        moduleId: response.data.mostRecent.moduleId,
        chapterId: response.data.mostRecent.chapterId,
        timestamp: response.data.mostRecent.timestamp * 1000, // Convert to milliseconds
      };
    }

    return null;
  } catch (error) {
    // Gracefully handle errors - return null to fallback to progress-based selection
    console.warn("Failed to retrieve last accessed module from backend:", error);
    return null;
  }
}

/**
 * Checks if a timestamp is within the specified number of days from now
 * @param timestamp - Unix timestamp in milliseconds
 * @param daysThreshold - Number of days to check (default: 7)
 * @returns True if the timestamp is within the threshold, false otherwise
 */
export function isRecentAccess(
  timestamp: number,
  daysThreshold: number = 7
): boolean {
  const now = Date.now();
  const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;
  return now - timestamp <= thresholdMs;
}

// ============================================================================
// Smart Module Selection Algorithm
// ============================================================================

/**
 * Selects the optimal module to display based on various factors
 * Priority order:
 * 1. URL parameters (explicit user intent)
 * 2. Recent access (within 7 days) - from backend API
 * 3. Progress-based (next incomplete module)
 * 4. Completion state (first module if all complete)
 * 5. First-time user (first module)
 *
 * @param input - The input parameters for module selection
 * @returns Promise with the selected module information with reason
 */
export async function selectOptimalModule(
  input: SmartModuleSelectorInput
): Promise<SmartModuleSelectorOutput> {
  const { courseData, courseId, requestedModuleId, requestedChapterId } = input;

  // Priority 1: URL parameters (explicit user intent)
  if (requestedModuleId && requestedChapterId) {
    const foundModule = findModuleById(courseData, requestedModuleId, requestedChapterId);
    if (foundModule) {
      return {
        moduleId: foundModule.id,
        chapterId: foundModule.chapter_id,
        reason: "url",
      };
    }
  }

  // Priority 2: Next module from mostRecent API (preferred) or recent access (within 7 days)
  try {
    const courseIdNum = parseInt(courseId);
    if (!isNaN(courseIdNum)) {
      const response = await getMostRecentModule(courseIdNum);
      
      // First, try to use nextModule if available (this is what user wants to continue from)
      if (response.success && response.data.nextModule) {
        const foundNextModule = findModuleById(
          courseData,
          response.data.nextModule.moduleId,
          response.data.nextModule.chapterId
        );
        if (foundNextModule) {
          return {
            moduleId: foundNextModule.id,
            chapterId: foundNextModule.chapter_id,
            reason: "next",
          };
        }
      }
      
      // Fallback: Use mostRecent module if it's recent (within 7 days)
      if (response.success && response.data.mostRecent && response.data.mostRecent.isRecent) {
        const foundModule = findModuleById(
          courseData,
          response.data.mostRecent.moduleId,
          response.data.mostRecent.chapterId
        );
        if (foundModule) {
          return {
            moduleId: foundModule.id,
            chapterId: foundModule.chapter_id,
            reason: "recent",
          };
        }
      }
    }
  } catch (error) {
    // If API fails, continue to next priority
    console.warn("Failed to get most recent/next module, falling back to progress:", error);
  }

  // Priority 3: Progress-based (next incomplete module)
  if (courseData.maxModuleSerialProgress > 0) {
    const nextIncompleteModule = findNextIncompleteModule(
      courseData,
      courseData.maxModuleSerialProgress
    );
    if (nextIncompleteModule) {
      return {
        moduleId: nextIncompleteModule.id,
        chapterId: nextIncompleteModule.chapter_id,
        reason: "progress",
      };
    }

    // Priority 4: All modules complete, return first module
    const firstModule = getFirstModule(courseData);
    if (firstModule) {
      return {
        moduleId: firstModule.id,
        chapterId: firstModule.chapter_id,
        reason: "completed",
      };
    }
  }

  // Priority 5: First-time user (no progress)
  const firstModule = getFirstModule(courseData);
  if (firstModule) {
    return {
      moduleId: firstModule.id,
      chapterId: firstModule.chapter_id,
      reason: "first-time",
    };
  }

  // Fallback: Should never reach here if course has content
  // Return first available module or throw error
  throw new Error("No modules found in course");
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Finds a module by its ID and chapter ID
 * @param courseData - The course data
 * @param moduleId - The module ID to find
 * @param chapterId - The chapter ID to find
 * @returns The module if found, undefined otherwise
 */
function findModuleById(
  courseData: CourseData,
  moduleId: number,
  chapterId: number
): Module | undefined {
  const chapters = courseData?.chapters || [];

  for (const chapter of chapters) {
    if (chapter.id === chapterId) {
      const modules = chapter?.modules || [];
      for (const foundModule of modules) {
        if (foundModule.id === moduleId) {
          return foundModule;
        }
      }
    }
  }

  return undefined;
}

/**
 * Finds the next incomplete module after the given progress point
 * @param courseData - The course data
 * @param maxProgress - The maximum progress serial number
 * @returns The next incomplete module if found, undefined otherwise
 */
function findNextIncompleteModule(
  courseData: CourseData,
  maxProgress: number
): Module | undefined {
  const chapters = courseData?.chapters || [];
  let nextModule: Module | undefined = undefined;

  for (const chapter of chapters) {
    const modules = chapter?.modules || [];
    for (const foundModule of modules) {
      if (foundModule.serial === maxProgress + 1) {
        return foundModule;
      }
    }
  }

  return nextModule;
}

/**
 * Gets the first module of the first chapter
 * @param courseData - The course data
 * @returns The first module if found, undefined otherwise
 */
function getFirstModule(courseData: CourseData): Module | undefined {
  const chapters = courseData?.chapters || [];

  if (chapters.length === 0) {
    return undefined;
  }

  // Find first live chapter
  for (const chapter of chapters) {
    if (chapter.is_live) {
      const modules = chapter?.modules || [];
      if (modules.length > 0) {
        // Return the module with the lowest serial number
        return modules.reduce((lowest, current) =>
          current.serial < lowest.serial ? current : lowest
        );
      }
    }
  }

  return undefined;
}
