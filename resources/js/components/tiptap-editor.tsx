import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo,
    Strikethrough,
    UnderlineIcon,
    Undo,
} from 'lucide-react';
import { useCallback } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

function ToolbarToggle({
    pressed,
    onPressedChange,
    children,
    title,
}: {
    pressed: boolean;
    onPressedChange: () => void;
    children: React.ReactNode;
    title: string;
}) {
    return (
        <Toggle
            size="sm"
            pressed={pressed}
            onPressedChange={onPressedChange}
            aria-label={title}
            title={title}
        >
            {children}
        </Toggle>
    );
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            Image,
            Placeholder.configure({ placeholder: placeholder ?? 'Start writing...' }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none min-h-[500px] px-12 py-10 outline-none focus:outline-none',
            },
        },
    });

    const setLink = useCallback(() => {
        if (!editor) {
            return;
        }

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) {
            return;
        }

        const url = window.prompt('Image URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <div className="print:hidden sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-background px-2 py-1.5">
                <ToolbarToggle
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                >
                    <UnderlineIcon className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <Strikethrough className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('code')}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                    title="Code"
                >
                    <Code className="size-4" />
                </ToolbarToggle>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarToggle
                    pressed={editor.isActive('heading', { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    title="Heading 1"
                >
                    <Heading1 className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <Heading2 className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                >
                    <Heading3 className="size-4" />
                </ToolbarToggle>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarToggle
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                >
                    <ListOrdered className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                >
                    <Quote className="size-4" />
                </ToolbarToggle>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarToggle
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    title="Align Left"
                >
                    <AlignLeft className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    title="Align Center"
                >
                    <AlignCenter className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    title="Align Right"
                >
                    <AlignRight className="size-4" />
                </ToolbarToggle>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarToggle
                    pressed={editor.isActive('link')}
                    onPressedChange={setLink}
                    title="Link"
                >
                    <LinkIcon className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={false}
                    onPressedChange={addImage}
                    title="Image"
                >
                    <ImageIcon className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    <Minus className="size-4" />
                </ToolbarToggle>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarToggle
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >
                    <Undo className="size-4" />
                </ToolbarToggle>
                <ToolbarToggle
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >
                    <Redo className="size-4" />
                </ToolbarToggle>
            </div>

            <EditorContent
                editor={editor}
                className={cn(
                    'flex-1 cursor-text',
                    '[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
                )}
            />
        </div>
    );
}
