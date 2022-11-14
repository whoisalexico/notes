import {useCallback, useEffect, useMemo, useState} from "react";
import {Layout, Input, Modal} from 'antd';
import MDEditor from '@uiw/react-md-editor';
import 'antd/dist/antd.css';
import "easymde/dist/easymde.min.css";
import './App.css';
import Note from "./components/Note";
import Dexie from "dexie";
import {useLiveQuery} from "dexie-react-hooks";


export const db = new Dexie('notes-database');
db.version(1).stores({
    notes: '++id, value',
});

const {notes} = db;

const {Sider, Content} = Layout;

const {Search} = Input;

const { confirm } = Modal;

const showConfirm = () => {
    confirm({
        title: 'Do you Want to delete these item?',
        content: 'This item will be deleted immediately. You can\'t undo this action.',
    });
};

function App() {
    const getDate = new Date();

    const allItems = useLiveQuery(() => notes.toArray(), [])

    const [value, setValue] = useState("");

    const [searchValue, setSearchValue] = useState("");

    async function addNote() {
        try {
            await notes.add({
                value,
            })
        } catch (e) {
            console.log(e)

        }

    }

    /*async function deleteNote(){
        try{
            await notes.delete()
        }
    }*/


    let onChange = useCallback(function (value) {
        setValue(value)
        notes.update({
            "value": value,
        })
    }, []);

    return (
        <Layout className="layout">
            <Sider className="sidebar" style={{width: '500px',}}>
                <Search placeholder="Search..." onChange={setSearchValue}/>
                {allItems && allItems.map((item) => (
                    <Note id={item.id} value={item.value}/>
                ))}
                <button onClick={addNote}>Add</button>
                <button onClick={showConfirm}>Delete</button>
            </Sider>
            <Content>
                <MDEditor
                    value={value}
                    onChange={setValue}
                    height={405}
                    preview={"edit"}
                />
            </Content>
        </Layout>
    );
}

export default App;
