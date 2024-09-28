'use client'

import React, { useState } from 'react';

export default function NoteModal({ onSave, onClose }) {
    const [noteInputValue, setNoteInputValue] = useState('');

    const handleSubmit = () => {
        onSave(noteInputValue); // Call onSave with the input note
        
    };

    return (
        <div className="modal">
            <h2>Add a Note</h2>
            <textarea
                value={noteInputValue}
                onChange={(e) => setNoteInputValue(e.target.value)}
                placeholder="Type your note here..."
            />
            <button onClick={handleSubmit}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}

