import React, {Component} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';
import {createNote, deleteNote} from './graphql/mutations';
import {listNotes} from './graphql/queries';

class App extends Component {
    state = {
        note: "",
        notes: []
    };

    handleChangeNote = event => this.setState({note: event.target.value});

    handleAddNote = async event => {
        const {note, notes} = this.state;
        event.preventDefault();
        const input = {note};
        const result = await API.graphql(graphqlOperation(createNote, {input}));
        const newNote = result.data.createNote;
        const updatedNotes = [newNote, ...notes];
        this.setState({note: "", notes: updatedNotes});
    };

    handleDeleteNote = async noteId => {
        const {notes} = this.state;
        const input = {id: noteId};
        const result = await API.graphql(graphqlOperation(deleteNote, {input}));
        const deletedNoteId = result.data.deleteNote.id;
        const updatedNotes = notes.filter( note => note.id !== deletedNoteId);
        this.setState({notes: updatedNotes});
    };

    async componentDidMount() {
        const result = await API.graphql(graphqlOperation(listNotes));
        this.setState({notes: result.data.listNotes.items});
    }

    render() {
        const {note, notes} = this.state;

        return (
            <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
                <h1 className="code f2-1">
                    Amplify Notetaker
                </h1>
                <form className="mb3" onSubmit={this.handleAddNote}>
                    <input className="pa2 f4"
                           placeholder="Write your note"
                           onChange={this.handleChangeNote}
                           value={note}/>
                    <button className="pa2 f4" type="submit">
                        Add Note
                    </button>
                </form>

                {/* notes list */}
                <div>
                    {notes.map(item => (
                        <div key={item.id} className="flex items-center">
                            <li className="list pa1 f3">{item.note}</li>
                            <button className="bg-transparent bn f4"
                                    onClick={() => this.handleDeleteNote(item.id)}>
                                <span>&times;</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default withAuthenticator(App, {includeGreetings: true});
