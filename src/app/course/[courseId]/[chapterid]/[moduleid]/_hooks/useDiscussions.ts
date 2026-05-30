"use client";

import { useReducer, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/api.config";

interface Discussion {
  id: number;
  name: string;
  content: string;
  [key: string]: unknown;
}

interface DiscussionState {
  discussions: Discussion[];
  loading: boolean;
  newDiscussion: string;
  activeThreads: Record<number, boolean>;
  subdiscussionTexts: Record<number, string>;
  subdiscussionComments: Record<number, unknown[]>;
  openDialog: boolean;
  deleteOption: string;
  activeCommentDeletionData: { id: number; discussion_id?: number } | null;
}

type DiscussionAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DISCUSSIONS"; payload: { discussions: Discussion[]; threads: Record<number, boolean>; texts: Record<number, string>; comments: Record<number, unknown[]> } }
  | { type: "SET_NEW_DISCUSSION"; payload: string }
  | { type: "TOGGLE_THREAD"; id: number }
  | { type: "SET_SUBDISCUSSION_TEXT"; id: number; text: string }
  | { type: "SET_SUBDISCUSSION_COMMENTS"; id: number; comments: unknown[] }
  | { type: "OPEN_DELETE_DIALOG"; option: string; data: { id: number; discussion_id?: number } }
  | { type: "CLOSE_DELETE_DIALOG" };

function reducer(state: DiscussionState, action: DiscussionAction): DiscussionState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DISCUSSIONS":
      return {
        ...state,
        loading: false,
        discussions: action.payload.discussions,
        activeThreads: action.payload.threads,
        subdiscussionTexts: action.payload.texts,
        subdiscussionComments: action.payload.comments,
      };
    case "SET_NEW_DISCUSSION":
      return { ...state, newDiscussion: action.payload };
    case "TOGGLE_THREAD":
      return { ...state, activeThreads: { ...state.activeThreads, [action.id]: !state.activeThreads[action.id] } };
    case "SET_SUBDISCUSSION_TEXT":
      return { ...state, subdiscussionTexts: { ...state.subdiscussionTexts, [action.id]: action.text } };
    case "SET_SUBDISCUSSION_COMMENTS":
      return { ...state, subdiscussionComments: { ...state.subdiscussionComments, [action.id]: action.comments } };
    case "OPEN_DELETE_DIALOG":
      return { ...state, openDialog: true, deleteOption: action.option, activeCommentDeletionData: action.data };
    case "CLOSE_DELETE_DIALOG":
      return { ...state, openDialog: false, deleteOption: "", activeCommentDeletionData: null };
    default:
      return state;
  }
}

const initial: DiscussionState = {
  discussions: [],
  loading: false,
  newDiscussion: "",
  activeThreads: {},
  subdiscussionTexts: {},
  subdiscussionComments: {},
  openDialog: false,
  deleteOption: "",
  activeCommentDeletionData: null,
};

export interface UseDiscussionsReturn {
  discussions: Discussion[];
  discussionLoading: boolean;
  newDiscussion: string;
  setNewDiscussion: (text: string) => void;
  activeThreads: Record<number, boolean>;
  setActiveThreads: (threads: Record<number, boolean>) => void;
  subdiscussionTexts: Record<number, string>;
  setSubdiscussionTexts: (updater: (prev: Record<number, string>) => Record<number, string>) => void;
  subdiscussionComments: Record<number, unknown[]>;
  openDiscussionDeleteDialogue: boolean;
  setOpenDicussionDeleteDialogue: (open: boolean) => void;
  deleteOption: string;
  setDeleteOption: (option: string) => void;
  activeCommentDeletionData: { id: number; discussion_id?: number } | null;
  setActiveCommentDeletionData: (data: { id: number; discussion_id?: number } | null) => void;
  fetchDiscussions: (moduleId: number) => void;
  fetchSubdiscussions: (discussionId: number) => void;
  postSubdiscussion: (discussionId: number) => void;
  submitNewDiscussion: (moduleId: number) => void;
  deleteDiscussion: () => void;
}

export function useDiscussions(): UseDiscussionsReturn {
  const [state, dispatch] = useReducer(reducer, initial);

  const fetchDiscussions = useCallback((moduleId: number) => {
    if (!moduleId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    dispatch({ type: "SET_LOADING", payload: true });

    axios
      .get(`${BACKEND_URL}/user/discussion/list/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const discussions: Discussion[] = res.data.data;
        const threads: Record<number, boolean> = {};
        const texts: Record<number, string> = {};
        const comments: Record<number, unknown[]> = {};
        discussions.forEach((d) => {
          threads[d.id] = false;
          texts[d.id] = "";
          comments[d.id] = [];
        });
        dispatch({ type: "SET_DISCUSSIONS", payload: { discussions, threads, texts, comments } });
      })
      .catch(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, []);

  const fetchSubdiscussions = useCallback((id: number) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/user/subDiscussion/list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        dispatch({ type: "SET_SUBDISCUSSION_COMMENTS", id, comments: res.data.data });
      })
      .catch(() => {});
  }, []);

  const postSubdiscussion = useCallback((id: number) => {
    const text = state.subdiscussionTexts[id];
    if (!text || text.length === 0) return;
    const token = localStorage.getItem("token");
    axios
      .post(`${BACKEND_URL}/user/subDiscussion/create/${id}`, { content: text }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchSubdiscussions(id);
        dispatch({ type: "SET_SUBDISCUSSION_TEXT", id, text: "" });
        toast.success("Your comment was added!");
      })
      .catch(() => {});
  }, [state.subdiscussionTexts, fetchSubdiscussions]);

  const submitNewDiscussion = useCallback((moduleId: number) => {
    if (state.newDiscussion.length === 0) return;
    const token = localStorage.getItem("token");
    axios
      .post(`${BACKEND_URL}/user/discussion/create/${moduleId}`, { content: state.newDiscussion }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchDiscussions(moduleId);
        dispatch({ type: "SET_NEW_DISCUSSION", payload: "" });
        toast.success("Your comment was added!");
      })
      .catch(() => {});
  }, [state.newDiscussion, fetchDiscussions]);

  const deleteDiscussion = useCallback(() => {
    const token = localStorage.getItem("token");
    const { deleteOption, activeCommentDeletionData } = state;
    if (!activeCommentDeletionData) return;

    let url = "";
    if (deleteOption === "subdiscussion") {
      url = `${BACKEND_URL}/user/subDiscussion/delete/${activeCommentDeletionData.id}`;
    } else {
      return; // discussion-level delete not wired on backend yet
    }

    axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast.success("Your comment was deleted successfully!");
        if (deleteOption === "subdiscussion" && activeCommentDeletionData.discussion_id) {
          fetchSubdiscussions(activeCommentDeletionData.discussion_id);
        }
        dispatch({ type: "CLOSE_DELETE_DIALOG" });
      })
      .catch(() => {
        toast.error("Comment deletion failed!");
      });
  }, [state, fetchSubdiscussions]);

  // Shim setters that match the existing DiscussionSection prop interface so we
  // don't have to change DiscussionSection in this phase.
  const setNewDiscussion = useCallback((text: string) => {
    dispatch({ type: "SET_NEW_DISCUSSION", payload: text });
  }, []);

  const setActiveThreads = useCallback((threads: Record<number, boolean>) => {
    // DiscussionSection sets the whole map; mirror into reducer
    Object.entries(threads).forEach(([id, val]) => {
      if (state.activeThreads[Number(id)] !== val) {
        dispatch({ type: "TOGGLE_THREAD", id: Number(id) });
      }
    });
  }, [state.activeThreads]);

  const setSubdiscussionTexts = useCallback((updater: (prev: Record<number, string>) => Record<number, string>) => {
    const next = updater(state.subdiscussionTexts);
    Object.entries(next).forEach(([id, text]) => {
      if (state.subdiscussionTexts[Number(id)] !== text) {
        dispatch({ type: "SET_SUBDISCUSSION_TEXT", id: Number(id), text });
      }
    });
  }, [state.subdiscussionTexts]);

  const setOpenDicussionDeleteDialogue = useCallback((open: boolean) => {
    if (!open) dispatch({ type: "CLOSE_DELETE_DIALOG" });
  }, []);

  const setDeleteOption = useCallback((option: string) => {
    // Kept for prop interface compat; option is typically set together with OPEN_DELETE_DIALOG
    dispatch({ type: "OPEN_DELETE_DIALOG", option, data: state.activeCommentDeletionData ?? { id: 0 } });
  }, [state.activeCommentDeletionData]);

  const setActiveCommentDeletionData = useCallback((data: { id: number; discussion_id?: number } | null) => {
    if (data) {
      dispatch({ type: "OPEN_DELETE_DIALOG", option: state.deleteOption, data });
    } else {
      dispatch({ type: "CLOSE_DELETE_DIALOG" });
    }
  }, [state.deleteOption]);

  return {
    discussions: state.discussions,
    discussionLoading: state.loading,
    newDiscussion: state.newDiscussion,
    setNewDiscussion,
    activeThreads: state.activeThreads,
    setActiveThreads,
    subdiscussionTexts: state.subdiscussionTexts,
    setSubdiscussionTexts,
    subdiscussionComments: state.subdiscussionComments,
    openDiscussionDeleteDialogue: state.openDialog,
    setOpenDicussionDeleteDialogue,
    deleteOption: state.deleteOption,
    setDeleteOption,
    activeCommentDeletionData: state.activeCommentDeletionData,
    setActiveCommentDeletionData,
    fetchDiscussions,
    fetchSubdiscussions,
    postSubdiscussion,
    submitNewDiscussion,
    deleteDiscussion,
  };
}
