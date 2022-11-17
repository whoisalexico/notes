import React, {useState} from 'react';
import './styles/sidebar.css'
import {Button, Modal, Input} from "antd";


const {confirm} = Modal;
const {Search} = Input;


function Sidebar(props) {
    const [searchValue, setSearchValue] = useState("");
    const showConfirm = (event, id) => {
        confirm({
            title: 'Do you Want to delete these item?',
            content: 'This item will be deleted immediately. You can\'t undo this action.',
            onOk() {
                props.deleteNote(event, id);
            }
        });
    };
    const noteElements = props.notes.filter(note=>{
        if(searchValue == "") {
            return note;
        }else if(note.value.toLowerCase().includes(searchValue.toLowerCase())){
            return note;
        }
    }).map((note, index) => (
        <div key={note.id}>
            <div
                className={`title ${
                    note.id === props.currentNote.id ? 'selected-note' : ''
                }`}
                onClick={() => props.setCurrentNoteId(note.id)}
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
                    <Button className={"addBtn"} onClick={props.newNote}>Add</Button>
                </div>
                <Search onChange={event => setSearchValue(event.target.value)} value={searchValue} placeholder={"Search..."} className={"search"}/>
            </div>
            {noteElements}
        </section>
    )
}

export default Sidebar;
