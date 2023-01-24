(() => {

    const sectionEdit = document.querySelector('.editNote-container');
    const numChar = document.querySelector('.editNote__numCharacters');
    const title = document.querySelector('.editNote__title');
    const textarea = document.querySelector('.textarea');
    const main = document.querySelector('.main');
    
    let editStatus = false;
    let idEdit;
    let db;


    
    fetch('./getNotes').then(res => res.json()).then(res => {
        let notesE = "";
        Object.keys(res.notes).forEach(i => {
            notesE = createNote(res.notes[i]) + notesE;
        });
        main.innerHTML = notesE;
        db = res;
    })



    main.addEventListener('click', (e) => {
        const tg = e.target.className;
        
        let note = tg == "note__title" || tg == "note__date" ?
        e.target.parentElement : tg == 'note' ? e.target : 0

        if (note) {
            sectionEdit.style.transform = 'translateX(0)';
            sectionEdit.style.opacity = 1;
            editStatus = true;
            idEdit = note.id;

            title.value = db.notes[note.id].title;
            textarea.value = db.notes[note.id].content;
            numChar.textContent = `${textarea.value.length}`;
        }

        if (e.target.id == 'cta-delete') {
            deleteNote(e.target.parentElement.id)
        }
    })



    document.getElementById('cta-addNote')
    .addEventListener('click', () => {
        sectionEdit.style.transform = 'translateX(0)';
        sectionEdit.style.opacity = 1;
    })

    textarea.addEventListener('keyup', (e) => {
        numChar.textContent = `${e.target.value.length} caracteres`;
    })

    document.querySelector('.fa-arrow-left-long')
    .addEventListener('click', (e) => {
        sectionEdit.style.transform = 'translateX(100%)';
        sectionEdit.style.opacity = 0;

        const data = {
            title: title.value || "Titulo",
            content: textarea.value,
            date: getDate(),
            time: getTime()
        }

        if (editStatus) {
            data.id = idEdit;
            updateNote(data);
            editStatus = false;
        }
        else { setNote(data); }

        // Limpia los campos.
        title.value = '';
        textarea.value = '';
        numChar.textContent = "0 caracteres";
    })

    

    function  getDate() {
        const DATE = new Date();
        let date = '';
        date += ("0"+DATE.getDate()).slice(-2)+"/";
        date += ("0"+(DATE.getMonth()+1)).slice(-2)+"/";
        date += DATE.getFullYear();
        return date;
    }

    function  getTime() {
        const DATE = new Date();
        let time = '';
        time += ("0"+DATE.getHours()).slice(-2)+":";
        time += ("0"+DATE.getMinutes()).slice(-2)+":";
        time += ("0"+DATE.getSeconds()).slice(-2);
        return time;
    }

    function createNote(data) {
        return `
        <div class="note" id="${data.id}">
            <span class="note__title">${data.title}</span>
            <i class="fa-solid fa-xmark" id="cta-delete"></i>
            <span class="note__date">${data.date} - ${data.time}</span>
        </div>
        `
    }

    function updateNote(data) {
        fetch("/updateNote", {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            delete db.notes[data.id];
            main.removeChild(document.getElementById(data.id));
            data.id = res.id;
            db.notes[res.id] = data;
            main.innerHTML = createNote(data) + main.innerHTML;
            main.scrollTop = 0;
        })
    }

    function setNote(data) {
        fetch("/setNote", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            data.id = res.id;
            db.notes[data.id] = data;
            main.innerHTML = createNote(data) + main.innerHTML;
        })
    }

    function  deleteNote(id) {
        fetch("/deleteNote", {
            method: "DELETE",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({id})
        }).then(res => res.json()).then(res => {
            if (res.delete) {
                main.removeChild(document.getElementById(id))
            }
        })
    }
})();