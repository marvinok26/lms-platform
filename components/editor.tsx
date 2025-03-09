"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { useState, useEffect } from 'react'
import TextAlign from '@tiptap/extension-text-align'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Quote,
  Code,
  ImageIcon,
  Undo,
  Redo,
  Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            TextAlign.configure({
                types: ['heading', 'paragraph'],
              }),
            StarterKit,
            Placeholder.configure({
                placeholder: 'Enter a description...',
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[200px] p-4 focus:outline-none prose max-w-none',
            },
        },
    });

    if (!isMounted) {
        return null;
    }

    const toggleBold = () => {
        editor?.chain().focus().toggleBold().run();
    };

    const toggleItalic = () => {
        editor?.chain().focus().toggleItalic().run();
    };

    const toggleUnderline = () => {
        editor?.chain().focus().toggleUnderline().run();
    };

    const toggleBulletList = () => {
        editor?.chain().focus().toggleBulletList().run();
    };

    const toggleOrderedList = () => {
        editor?.chain().focus().toggleOrderedList().run();
    };

    const setLink = () => {
        const url = window.prompt('URL');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        } else {
            editor?.chain().focus().unsetLink().run();
        }
    };
    
    const setHeading1 = () => {
        editor?.chain().focus().toggleHeading({ level: 1 }).run();
    };
    
    const setHeading2 = () => {
        editor?.chain().focus().toggleHeading({ level: 2 }).run();
    };
    
    const toggleBlockquote = () => {
        editor?.chain().focus().toggleBlockquote().run();
    };
    
    const toggleCodeBlock = () => {
        editor?.chain().focus().toggleCodeBlock().run();
    };
    
    const setHorizontalRule = () => {
        editor?.chain().focus().setHorizontalRule().run();
    };
    
    const insertImage = () => {
        const url = window.prompt('Image URL');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    };
    
    const undo = () => {
        editor?.chain().focus().undo().run();
    };
    
    const redo = () => {
        editor?.chain().focus().redo().run();
    };
    
    const alignLeft = () => {
        editor?.chain().focus().setTextAlign('left').run();
    };
    
    const alignCenter = () => {
        editor?.chain().focus().setTextAlign('center').run();
    };
    
    const alignRight = () => {
        editor?.chain().focus().setTextAlign('right').run();
    };

    return (
        <div className="rounded border border-slate-200 bg-white">
            <div className="flex flex-wrap gap-2 p-2 border-b border-slate-200">
                <div className="flex gap-1 border-r pr-2 border-slate-200">
                    <button
                        type="button"
                        onClick={undo}
                        className="p-1.5 rounded hover:bg-slate-100 transition"
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={redo}
                        className="p-1.5 rounded hover:bg-slate-100 transition"
                        title="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="flex gap-1 border-r pr-2 border-slate-200">
                    <button
                        type="button"
                        onClick={setHeading1}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('heading', { level: 1 }) ? "bg-slate-200" : ""
                        )}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={setHeading2}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('heading', { level: 2 }) ? "bg-slate-200" : ""
                        )}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="flex gap-1 border-r pr-2 border-slate-200">
                    <button
                        type="button"
                        onClick={toggleBold}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('bold') ? "bg-slate-200" : ""
                        )}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={toggleItalic}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('italic') ? "bg-slate-200" : ""
                        )}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={toggleUnderline}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('underline') ? "bg-slate-200" : ""
                        )}
                        title="Underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="flex gap-1 border-r pr-2 border-slate-200">
                    <button
                        type="button"
                        onClick={alignLeft}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive({ textAlign: 'left' }) ? "bg-slate-200" : ""
                        )}
                        title="Align Left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={alignCenter}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive({ textAlign: 'center' }) ? "bg-slate-200" : ""
                        )}
                        title="Align Center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={alignRight}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive({ textAlign: 'right' }) ? "bg-slate-200" : ""
                        )}
                        title="Align Right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="flex gap-1 border-r pr-2 border-slate-200">
                    <button
                        type="button"
                        onClick={toggleBulletList}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('bulletList') ? "bg-slate-200" : ""
                        )}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={toggleOrderedList}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('orderedList') ? "bg-slate-200" : ""
                        )}
                        title="Ordered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={toggleBlockquote}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('blockquote') ? "bg-slate-200" : ""
                        )}
                        title="Blockquote"
                    >
                        <Quote className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={toggleCodeBlock}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('codeBlock') ? "bg-slate-200" : ""
                        )}
                        title="Code Block"
                    >
                        <Code className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={setLink}
                        className={cn(
                            "p-1.5 rounded hover:bg-slate-100 transition",
                            editor?.isActive('link') ? "bg-slate-200" : ""
                        )}
                        title="Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={insertImage}
                        className="p-1.5 rounded hover:bg-slate-100 transition"
                        title="Insert Image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={setHorizontalRule}
                        className="p-1.5 rounded hover:bg-slate-100 transition"
                        title="Horizontal Rule"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} className="prose-sm overflow-hidden" />
        </div>
    )
}