"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/api.config";
import type { CourseModule } from "../_components/types";

interface AssignmentSubmission {
  youtube_link: string;
  github_link: string;
}

interface UseAssignmentReturn {
  assignmentEvaluted: any[];
  assignmentSubmission: AssignmentSubmission;
  setAssignmentSubmission: (submission: AssignmentSubmission) => void;
  submitAssignment: (e: React.FormEvent) => void;
  fetchEvalutedAssignment: (moduleId: number) => void;
}

export function useAssignment(
  activeModule: CourseModule | null,
  onProgressSubmit: (moduleId: number, score: number) => void,
): UseAssignmentReturn {
  const [assignmentEvaluted, setAssignmentEvaluted] = useState<any[]>([]);
  const [assignmentSubmission, setAssignmentSubmission] = useState<AssignmentSubmission>({
    youtube_link: "",
    github_link: "",
  });

  const fetchEvalutedAssignment = useCallback((moduleId: number) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/user/assignment/view/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAssignmentEvaluted(res.data.data);
        if (res.data.data.length > 0) {
          setAssignmentSubmission(res.data.data[0].submission);
        } else {
          setAssignmentSubmission({ youtube_link: "", github_link: "" });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch evaluation whenever the active module is an ASSIGNMENT
  useEffect(() => {
    if (activeModule?.data?.category === "ASSIGNMENT" && activeModule.id != null) {
      fetchEvalutedAssignment(activeModule.id);
    }
  }, [activeModule?.id, activeModule?.data?.category, fetchEvalutedAssignment]);

  const submitAssignment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModule?.id) return;
    const token = localStorage.getItem("token");

    const isEdit = assignmentEvaluted?.length > 0;
    const url = isEdit
      ? `${BACKEND_URL}/user/assignment/edit/${activeModule.id}`
      : `${BACKEND_URL}/user/assignment/submit/${activeModule.id}`;
    const method = isEdit ? axios.put : axios.post;

    method(url, { submission: assignmentSubmission }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast.success("Assignment Submitted Successfully");
        onProgressSubmit(activeModule.id, activeModule.score ?? 0);
      })
      .catch(() => {
        toast.error("Something Went Wrong");
      });
  }, [activeModule, assignmentEvaluted, assignmentSubmission, onProgressSubmit]);

  return {
    assignmentEvaluted,
    assignmentSubmission,
    setAssignmentSubmission,
    submitAssignment,
    fetchEvalutedAssignment,
  };
}
