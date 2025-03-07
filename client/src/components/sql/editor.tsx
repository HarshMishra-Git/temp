import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SQLEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function SQLEditor({ value, onChange, readOnly = false }: SQLEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        sql(),
        oneDark,
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.editable.of(!readOnly),
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [readOnly]);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value
        }
      });
    }
  }, [value]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated SQL</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={editorRef} 
          className="border rounded-md overflow-hidden font-mono text-sm"
        />
      </CardContent>
    </Card>
  );
}
