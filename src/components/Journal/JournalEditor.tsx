"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import {
  FaBold,
  FaHeading,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaStrikethrough,
  FaUndo,
  FaSave,
} from "react-icons/fa";
import Placeholder from "@tiptap/extension-placeholder";
import axios from "axios";
import { displayToast } from "@/utils/toastUtils";
import nProgress from "nprogress";
import { useEffect, useCallback } from "react";
import usePassage from "@/hooks/usePassage";
import { useRouter } from "next/router";

const JournalEditor = ({
  date,
  content,
  setContent,
  loading,
}: {
  date: Date;
  content: string;
  setContent: (content: string) => void;
  loading: boolean;
}) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        Placeholder.configure({
          placeholder: "Start writing...",
        }),
      ],
      editorProps: {
        attributes: {
          class: "prose focus:outline-none mt-5 prose-stone",
        },
      },
      content: content,
    },
    [content, loading]
  );

  const router = useRouter();
  const { isAuthorized } = usePassage();

  useEffect(() => {
    if (content === editor?.getHTML()) {
      window.removeEventListener("beforeunload", beforeUnload);
    } else {
      window.addEventListener("beforeunload", beforeUnload);
    }

    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [content, editor?.getHTML()]);

  const beforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  }, []);

  const saveContent = async () => {
    const keys = JSON.parse(
      localStorage.getItem("keys")?.length! > 0 &&
        localStorage.getItem("keys") !== "undefined"
        ? localStorage.getItem("keys")!
        : "{}"
    );

    if (!isAuthorized) {
      return router.push("/login");
    }

    nProgress.start();

    try {
      await axios.post(
        "/api/github/entry",
        {
          content: editor?.getHTML()!,
        },
        {
          params: {
            secretKey: keys.secret,
            initKey: keys.vector,
            date: date.toDateString(),
          },
        }
      );

      displayToast("Journal Entry Saved");
      setContent(editor?.getHTML()!);
    } catch (error) {
      displayToast("Error saving journal entry", true);
    } finally {
      nProgress.done();
    }
  };

  return (
    <div className="p-3 wired-divider-container">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{date.toDateString()}</h2>
        <button onClick={saveContent}>
          <FaSave />
        </button>
      </div>

      <div className="my-5">
        <wired-divider />
      </div>

      {loading && (
        <div className="flex justify-center items-center ">
          <p>Loading ...</p>
        </div>
      )}

      <div className={loading ? "hidden" : ""}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex space-x-3 editor-menu-bar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active item" : "item"}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active item" : "item"}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active item" : "item"}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? "is-active item" : "item"
        }
      >
        <FaHeading />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active item" : "item"}
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active item" : "item"}
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active item" : "item"}
      >
        <FaQuoteLeft />
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="item"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="item"
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default JournalEditor;
