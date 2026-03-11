"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

interface EditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  className?: string;
  editable?: boolean;
}

export default function Editor({
  content = "",
  placeholder = "Start typing...",
  onChange,
  className,
  editable = true,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div
      className={cn(
        "min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        !editable && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      <EditorContent editor={editor} className="prose prose-sm max-w-none" />
    </div>
  );
}
