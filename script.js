document.getElementById('find-Notes').addEventListener('click', function () {
    const note = document.getElementById('note-select').value;
    const chordType = document.getElementById('chord-select').value;

    const chordResult = getChordNotes(note, chordType);

    document.getElementById('chord-result').innerHTML = `<h3>${note} ${chordType.charAt(0).toUpperCase() + chordType.slice(1)} Chord</h3><p>${chordResult.join(', ')}</p>`;
});

function getChordNotes(note, chordType) {
    // Define the basic notes in a chromatic scale
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Determine the starting index of the selected note
    const rootIndex = notes.indexOf(note);
    
    // Chord formulas (intervals in semitones)
    const chordFormulas = {
        'major': [0, 4, 7],
        'minor': [0, 3, 7],
        'diminished': [0, 3, 6],
        'augmented': [0, 4, 8],
        'maj7': [0, 4, 7, 11],
        'min7': [0, 3, 7, 10],
        'dom7': [0, 4, 7, 10],
        'dim7': [0, 3, 6, 9],
        'aug7': [0, 4, 8, 10]
    };

    // Get the interval pattern for the selected chord type
    const formula = chordFormulas[chordType];
    
    // Compute the notes for the chord
    let chordNotes = formula.map(interval => notes[(rootIndex + interval) % notes.length]);
    
    return chordNotes;
}