import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TerritoryEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TerritoryEditor({ content, onChange }: TerritoryEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Empieza a escribir tu historia del territorio...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
      <div className="flex items-center gap-1 p-3 border-b border-[var(--border)] bg-[#faf8f3]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-[#eee8dc] transition-colors ${
            editor.isActive('bold') ? 'bg-[#eee8dc] font-bold' : ''
          }`}
          title="Negrita"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-[#eee8dc] transition-colors ${
            editor.isActive('italic') ? 'bg-[#eee8dc] italic' : ''
          }`}
          title="Cursiva"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-[#eee8dc] transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#eee8dc]' : ''
          }`}
          title="Título"
        >
          <span className="font-serif font-bold text-sm">H2</span>
        </button>
        <div className="w-px h-6 bg-[var(--border)] mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-[#eee8dc] transition-colors disabled:opacity-30"
          title="Deshacer"
        >
          ↩
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-[#eee8dc] transition-colors disabled:opacity-30"
          title="Rehacer"
        >
          ↪
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
