import React, { useCallback, useEffect, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python'
import { javascript }  from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { onMessage } from './socket';

 const getLanguageExtension = (lang: string) => {
        switch (lang) {
            case 'python':
                return python();
            case 'javascript':
            default:
                return javascript({ jsx: true });
        }
    }

 // Generating a random client ID once per browser tab session
    function generateClientId(){
        return Math.random().toString(36).substring(2, 10);
    }

function Editor(){
    const [code, setCode ] = useState("// start typing")
    const [language, SetLanguage] = useState("javascript")

    generateClientId();

    // Stable client ID for this tab, generated once
    const clientId = useRef(generateClientId()).current;

    // WebSocket connection, kept in a red so it survives re-renders
    const ws = useRef<WebSocket | null>(null);

    

    const onChange = useCallback((val: string, viewUpdate: any) => {
        setCode(val);
    }, []);

    useEffect(() => onMessage((e) => setCode(e.data)), [])

    return (
        <div className="flex flex-col w-full max-w-4xl h-[80vh] mx-auto border border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e1e] border-b border-gray-700 shrink-0">
        <span className="text-sm font-medium text-gray-200">
          Collaborative code editor
        </span>
        <select
          value={language}
          onChange={(e) => getLanguageExtension(e.target.value)}
          className="bg-[#2d2d2d] text-gray-200 border border-gray-600 rounded px-2 py-1 text-xs
                     focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme={vscodeDark}
          extensions={[getLanguageExtension(language)]}
          onChange={onChange}
          className="h-full text-sm"
        />
      </div>
    </div>
    )
}

export default Editor;