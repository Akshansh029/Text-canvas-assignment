import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "tailwindcss/tailwind.css";
import { Undo, Redo } from "lucide-react";

const TextCanvas = () => {
  const [texts, setTexts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [editorContent, setEditorContent] = useState("");
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const toolbarOptions = [["bold", "italic", "underline"], [{ align: [] }]];

  const addText = () => {
    const newText = {
      content: "Placeholder Text",
      font: selectedFont,
      size: selectedFontSize,
      position: { x: 0, y: 0 },
    };

    undoStack.current.push([...texts.map((text) => ({ ...text }))]); // deep clone
    setTexts([...texts, newText]);
    redoStack.current = [];
  };

  const updateText = (index, updatedContent) => {
    const newTexts = texts.map((text, idx) =>
      idx === index ? { ...text, content: updatedContent } : text
    );
    undoStack.current.push([...texts.map((text) => ({ ...text }))]); // deep clone
    setTexts(newTexts);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditorContent(texts[index].content);
  };

  const saveText = () => {
    if (editingIndex !== null) {
      updateText(editingIndex, editorContent);
      setEditingIndex(null);
      setEditorContent("");
    }
  };

  const removeTexts = () => {
    undoStack.current.push([...texts.map((text) => ({ ...text }))]); // deep clone
    setTexts([]);
    setEditorContent("");
    localStorage.removeItem("texts");
    redoStack.current = [];
  };

  const handleFontChange = (e) => setSelectedFont(e.target.value);
  const handleFontSizeChange = (e) => setSelectedFontSize(e.target.value);

  const handleDrag = (e, data, index) => {
    const newTexts = texts.map((text, idx) =>
      idx === index ? { ...text, position: { x: data.x, y: data.y } } : text
    );
    undoStack.current.push([...texts.map((text) => ({ ...text }))]); // deep clone
    setTexts(newTexts);
    redoStack.current = [];
  };

  const undo = () => {
    if (undoStack.current.length > 0) {
      redoStack.current.push([...texts.map((text) => ({ ...text }))]); // deep clone
      const previousState = undoStack.current.pop();
      setTexts(previousState);
    }
  };

  const redo = () => {
    if (redoStack.current.length > 0) {
      undoStack.current.push([...texts.map((text) => ({ ...text }))]); // deep clone
      const nextState = redoStack.current.pop();
      setTexts(nextState);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-6 items-center justify-center">
      <h1 className="font-mono text-4xl font-bold">Canvas Assignment</h1>
      {/* Box-shaped container */}
      <div className="border-2 border-gray-300 w-[75%] h-3/4 relative flex flex-col">
        <div className="flex gap-2 items-center justify-center w-full h-12 bg-gray-300">
          <button
            className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
            onClick={removeTexts}
          >
            Remove all
          </button>
          <button
            className="px-2 py-1 rounded-md flex gap-1 bg-white hover:bg-neutral-100 items-center justify-center"
            onClick={undo}
          >
            <Undo size={16} />
            <p className="text-black text-xs font-semibold">Undo</p>
          </button>
          <button
            className="px-3 py-1 rounded-md flex gap-1 bg-white hover:bg-neutral-100 items-center justify-center"
            onClick={redo}
          >
            <Redo size={16} />
            <p className="text-black text-xs font-semibold">Redo</p>
          </button>
        </div>
        {/* Canvas at the top */}
        <div className="flex-grow border-b-2 border-gray-300 p-2 bg-neutral-500 w-full text-white">
          {texts.map((text, index) => (
            <Draggable
              key={index}
              position={text.position || { x: 0, y: 0 }}
              onStop={(e, data) => handleDrag(e, data, index)}
            >
              <div
                className="absolute cursor-pointer"
                style={{ fontFamily: text.font, fontSize: text.size }}
                onDoubleClick={() => handleEdit(index)}
              >
                <div dangerouslySetInnerHTML={{ __html: text.content }} />
              </div>
            </Draggable>
          ))}
        </div>

        {/* Bottom controls section */}
        <div className="p-4 bg-gray-300 flex items-center justify-between">
          {/* Add Text Button */}
          <button
            onClick={addText}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded mr-2 w-[9rem]"
          >
            Add Text
          </button>

          {/* Font Selector */}
          <select
            onChange={handleFontChange}
            className="border p-2 mr-2 rounded"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Impact">Impact</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Garamond">Garamond</option>
            <option value="Palatino Linotype">Palatino Linotype</option>
            <option value="Brush Script MT">Brush Script MT</option>
          </select>

          {/* Font Size Selector */}
          <select
            onChange={handleFontSizeChange}
            className="border p-2 mr-2 rounded"
            defaultValue={"16px"}
          >
            <option value="16px">16px</option>
            <option value="10px">10px</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="22px">22px</option>
            <option value="24px">24px</option>
          </select>

          {/* Quill Text Editor */}
          <div className="flex items-center w-full gap-2">
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              modules={{ toolbar: toolbarOptions }}
              className="w-full border-[1px] border-slate-700 text-black"
            />

            {editingIndex !== null && (
              <button
                onClick={saveText}
                className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCanvas;
