document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    applyTheme();

    // Event Listeners
    document.getElementById("save-btn").addEventListener("click", saveNote);
    document.getElementById("toggle-theme").addEventListener("click", toggleTheme);

    // Formatting Buttons
    document.getElementById("bold-btn").addEventListener("click", () => formatText("bold"));
    document.getElementById("italic-btn").addEventListener("click", () => formatText("italic"));
    document.getElementById("underline-btn").addEventListener("click", () => formatText("underline"));
    document.getElementById("list-btn").addEventListener("click", () => formatText("insertUnorderedList"));
});

// Save note to localStorage
function saveNote() {
    let noteContent = document.getElementById("note").innerHTML.trim();
    
    if (!noteContent || noteContent === "<br>") {
        alert("⚠ Cannot save an empty note!");
        return;
    }

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(noteContent);
    localStorage.setItem("notes", JSON.stringify(notes));

    document.getElementById("note").innerHTML = ''; // Clear after saving
    loadNotes();
}

// Load saved notes
function loadNotes() {
    let notesList = document.getElementById("notes-list");
    notesList.innerHTML = '';
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
        notesList.innerHTML = "<p>No notes yet! Add one above.</p>";
    } else {
        notes.forEach((note, index) => {
            let noteDiv = document.createElement("div");
            noteDiv.className = "note-item";
            noteDiv.innerHTML = `
                <div contenteditable="false" id="note-${index}" class="note-content">${note}</div>
                <button onclick="editNote(${index})">✏ Edit</button>
                <button onclick="deleteNote(${index})">❌ Delete</button>
            `;
            notesList.appendChild(noteDiv);
        });
    }
}

// Delete note
function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes"));
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
}

// Edit note
function editNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes"));
    let noteDiv = document.getElementById(`note-${index}`);

    if (noteDiv.contentEditable === "false") {
        noteDiv.contentEditable = "true";
        noteDiv.focus();
    } else {
        let updatedContent = noteDiv.innerHTML.trim();
        if (!updatedContent || updatedContent === "<br>") {
            alert("⚠ Cannot save an empty note!");
            return;
        }
        notes[index] = updatedContent;
        localStorage.setItem("notes", JSON.stringify(notes));
        noteDiv.contentEditable = "false";
        loadNotes();
    }
}

// Toggle Dark Mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    document.getElementById("toggle-theme").innerText = document.body.classList.contains("dark-mode") ? "☀ Light Mode" : "🌙 Dark Mode";
}

// Apply saved theme
function applyTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("toggle-theme").innerText = "☀ Light Mode";
    }
}

// Text Formatting
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById("note").focus();
}
