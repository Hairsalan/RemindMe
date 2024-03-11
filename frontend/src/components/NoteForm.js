import { useState } from "react"
import { useNotesContext } from "../hooks/useNotesContext"
import { useAuthContext } from "../hooks/useAuthContext"

const NoteForm = () => {

    const { dispatch } = useNotesContext()
    const {user} = useAuthContext()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!user) {
            setError('You must be logged in')
            return
        }

        const note = {title, body}

        const response = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if (response.ok) {
            setTitle('')
            setBody('')
            setError(null)
            setEmptyFields([])
            console.log('new note added',json)
            dispatch({type: 'CREATE_NOTE', payload: json})
        }
    }
    



    return (
        <form className="create"        onSubmit={handleSubmit}>
            <h3>Add a new Note</h3>

            <label>Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}

            />

            <label>Text:</label>
            <textarea
                onChange={(e) => setBody(e.target.value)}
                value={body}
                className={emptyFields.includes('body') ? 'error' : ''}
            ></textarea>

        

            <button type="submit">Add Note</button>
            {error && <div className="error">
                {error}</div>}

        </form>
        

    )
}


export default NoteForm