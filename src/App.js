import {useEffect, useState} from "react";
import {Button, Layout, Input, Modal} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import Sidebar from "./components/Sidebar";
import Dexie from "dexie";
import Editor from "./components/Editor";


export const db = new Dexie('notes-database');
db.version(1).stores({
    notesdb: '++id, value',
});

const {notesdb} = db;

const {Sider, Content} = Layout;

const {Search} = Input;

const {confirm} = Modal;

const showConfirm = () => {
    confirm({
        title: 'Do you Want to delete these item?',
        content: 'This item will be deleted immediately. You can\'t undo this action.',
        onOk() {
            console.log("amogus")
        }
    });
};

function App() {
    /*const notesList = useLiveQuery(() => notesdb.toArray(), []);*/
    let notesList = [];
    const [notes, setNotes] = useState([]);

    const [currentNoteId, setCurrentNoteId] = useState((notesList[0] && notesList[0].id) || "");
    useEffect(() => {
        notesdb.toArray().then((data) => {
            notesList = data;
            setNotes(notesList)
        })
    })

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

    function searchNotes(){

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
                            <Sidebar notes={notes} currentNote={findCurrentNote()} setCurrentNoteId={setCurrentNoteId}
                                     newNote={addNote} deleteNote={deleteNote}/>
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
