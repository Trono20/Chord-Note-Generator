document.addEventListener('DOMContentLoaded', function() {
    populateDropdowns();
    document.getElementById('generateChordBtn').addEventListener('click', generateChord);
    document.getElementById('downloadMidiBtn').addEventListener('click', downloadMidi);
});

function populateDropdowns() {
    const rootNoteSelect = document.getElementById('rootNote');
    const chordTypeSelect = document.getElementById('chordType');

    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordTypes = ['major', 'minor', '7', 'm7', 'maj7'];

    notes.forEach(note => {
        const option = document.createElement('option');
        option.value = note;
        option.textContent = note;
        rootNoteSelect.appendChild(option);
    });

    chordTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        chordTypeSelect.appendChild(option);
    });
}

function generateChord() {
    const rootNote = document.getElementById('rootNote').value;
    const chordType = document.getElementById('chordType').value;

    if (!rootNote || !chordType) {
        alert('Please select both a root note and a chord type.');
        return;
    }

    const chords = {
        'major': ['C', 'E', 'G'],
        'minor': ['C', 'Eb', 'G'],
        '7': ['C', 'E', 'G', 'Bb'],
        'm7': ['C', 'Eb', 'G', 'Bb'],
        'maj7': ['C', 'E', 'G', 'B']
    };

    const rootIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(rootNote);
    const selectedChord = chords[chordType].map(note => transpose(note, rootIndex));

    document.getElementById('chordResult').innerHTML = `
        <p>${rootNote} ${chordType} chord: <span class="chord-notes">${selectedChord.join(' - ')}</span></p>`;
    
    // Show the Download MIDI button
    document.getElementById('downloadMidiBtn').style.display = 'inline-block';

    // Store chord data for MIDI generation
    window.currentChord = selectedChord;

    // Show chord recommendations
    showRecommendations(chordType);
}

function transpose(note, rootIndex) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const interval = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };

    return notes[(interval[note] + rootIndex) % 12];
}

function showRecommendations(chordType) {
    const recommendations = {
        'major': "Major chords are often used in uplifting, happy, or triumphant music. Great for pop songs and celebratory moments.",
        'minor': "Minor chords carry a more emotional and sometimes melancholic tone. They're perfect for sad songs or emotional ballads.",
        '7': "Dominant 7th chords add a bluesy or jazzy feel to music. They're commonly found in jazz, blues, and rock music.",
        'm7': "Minor 7th chords combine the emotional depth of minor chords with the smoothness of 7ths. Ideal for soulful and R&B music.",
        'maj7': "Major 7th chords sound dreamy and romantic. They add a lush, warm feel to music, often used in jazz, ballads, and love songs."
    };

    const recommendationText = recommendations[chordType];
    const recommendationElement = document.getElementById('chordRecommendation');
    
    recommendationElement.innerHTML = `<p><strong>Recommendation:</strong> ${recommendationText}</p>`;
    recommendationElement.style.display = 'block';
}

function downloadMidi() {
    if (!window.currentChord) return;

    const { Midi } = window['@tonejs/midi'];

    const midi = new Midi();
    const track = midi.addTrack();

    const noteDurations = 0.5;
    let currentTime = 0;

    window.currentChord.forEach(note => {
        track.addNote({
            name: note,
            time: currentTime,
            duration: noteDurations
        });
        currentTime += noteDurations;
    });

    const midiFile = midi.toArray();
    const blob = new Blob([midiFile], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'chord.mid';
    a.click();
    URL.revokeObjectURL(url);
}