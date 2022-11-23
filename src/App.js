import {createContext, useEffect, useState} from "react";
import {Button, Layout} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import {notesdb} from "./db";

const {Sider, Content} = Layout;
export const NotesContext = createContext();

function App() {
    let notesList = [];
    const [notes, setNotes] = useState([]);

    const [currentNoteId, setCurrentNoteId] = useState((notesList[0] && notesList[0].id) || "");
    useEffect(() => {
        notesdb.toArray().then((data) => {
            notesList = data;
            setNotes(notesList)
        })
    }, [currentNoteId])

    function addNote() {
        notesdb.add({
            value: "Type your note here",
        }).then((data) => {
            setCurrentNoteId(data);
        })
        setNotes(notesList)
    }

    function updateNote(text) {
        setNotes((oldNotes) => {
            const newArray = []
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if (oldNote.id === currentNoteId) {
                    newArray.unshift({...oldNote, value: text})
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
        notesdb.update(currentNoteId, {"value": text})
    }

    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId
            }) || notes[0]
        )
    }

    function deleteNote(event, noteId) {
        notesdb.delete(noteId)
        setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId))
    }

    return (
        <>
            {
                notes.length > 0 ? (
                    <Layout className="layout">
                        <Sider className={"sidebar"} width={350}>
                            <NotesContext.Provider value={notes}>
                            <Sidebar notes={notes} currentNote={findCurrentNote()} setCurrentNoteId={setCurrentNoteId}
                                     newNote={addNote} deleteNote={deleteNote}/>
                            </NotesContext.Provider>
                        </Sider>
                        <Content>
                            {currentNoteId && notes.length > 0 && (
                                <Editor currentNote={findCurrentNote()} updateNote={updateNote}/>
                            )}
                        </Content>
                    </Layout>
                ) : (
                    <div className={"no-notes"}>
                        <h1 className={"no-notes-title"}>You have no notes</h1>
                        <Button onClick={addNote}>Add new one</Button>
                    </div>
                )
            }
        </>
    );
}

export default App;
