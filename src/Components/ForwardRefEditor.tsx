'use client'
// ForwardRefEditor.tsx
import dynamic from 'next/dynamic'
import { forwardRef } from "react"
import { type MDXEditorMethods, type MDXEditorProps} from '@mdxeditor/editor'

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('./InitMdxEditor'), {
  // Make sure we turn SSR off
  ssr: false
})
// also from MDX docs
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => <Editor {...props} editorRef={ref} />)