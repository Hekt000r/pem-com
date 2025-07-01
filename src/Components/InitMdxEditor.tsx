'use client'

import '@mdxeditor/editor/style.css';

// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  MDXEditor,
  linkDialogPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  Separator,
  CreateLink,
  linkPlugin,
  imagePlugin,
  InsertImage
} from '@mdxeditor/editor'
import React from 'react'
import "./markdown.css"

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
            toolbarClassName: "my-className",
            toolbarContents: () => (
                <>
                <UndoRedo/>
                <Separator/>
                <BoldItalicUnderlineToggles/>
                <Separator/>
                <BlockTypeSelect/>
                <Separator/>
                <ListsToggle/>
                <Separator/>
                <CreateLink/>
                <InsertImage/>
                </>
            )
        }), // <-- ADD THIS
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        imagePlugin(),
        linkDialogPlugin()
      ]}
      {...props}
      ref={editorRef}
      className='markdown'
      contentEditableClassName='prose'
    />
  )
}
// from mdx docs