import React, {useContext, useState} from 'react';
import {Button, Modal, Input} from "antd";
import './styles/sidebar.css'
import {NotesContext} from "../App";

const {confirm} = Modal;

const {Search} = Input;

function Sidebar(props) {
    const notesContext = useContext(NotesContext)
    const [searchValue, setSearchValue] = useState("");

    const showConfirm = (event, id) => {
        confirm({
            title: 'Do you Want to delete this item?',
            content: 'This item will be deleted immediately. You can\'t undo this action.',
            onOk() {
                notesContext.deleteNote(event, id);
            }
        });
    };

    const noteElements = notesContext.notes.filter(note=>{
        if(searchValue == "") {
            return note;
        }else if(note.value.toLowerCase().includes(searchValue.toLowerCase())){
            return note;
        }
    }).map((note, index) => (
        <div key={note.id}>
            <div
                className={`title ${
                    note.id === notesContext.currentNote.id ? 'selected-note' : ''
                }`}
                onClick={() => notesContext.setCurrentNoteId(note.id)}
            >
                <h3 className='text-snippet'>{note.value.split('\n')[0]}</h3>
                <Button className={"deleteBtn"} onClick={(event) => showConfirm(event, note.id)}>Delete</Button>
            </div>
        </div>
    ))

    return (
        <section className='sidebar'>
            <div className='sidebar-header'>
                <div>
                    <h2>Markdown Notes</h2>
                    <Button className={"addBtn"} onClick={notesContext.newNote}>Add</Button>
                </div>
                <Search onChange={event => setSearchValue(event.target.value)} value={searchValue} placeholder={"Search..."} className={"search"}/>
            </div>
            {noteElements}
        </section>
    )
}

export default Sidebar;
