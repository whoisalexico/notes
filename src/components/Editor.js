import React from 'react';
import MDEditor from "@uiw/react-md-editor";

function Editor({currentNote, updateNote}) {
    return (
        <div>
            <MDEditor
                value={currentNote.value}
                onChange={updateNote}
                height={928}
                preview={"live"}
            />
        </div>
    );
}

export default Editor;