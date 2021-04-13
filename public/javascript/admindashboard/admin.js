var socket = io.connect();
let saveLangBtn = document.getElementById('admin-lang-save-btn');
let cancelLangBtn = document.getElementById('admin-lang-cancle-btn');
let adminLangSelectbox = document.getElementById("admin-lang-selectbox-edit");
let adminLangOptionDesc = document.getElementById('admin-lang-option-desc');
let langTextareaContent = document.getElementById('admin-lang-textarea-content');

function getLang(){
    adminLangOptionDesc.style.display = 'none';
    let selectedLang = adminLangSelectbox.options[adminLangSelectbox.selectedIndex].getAttribute('data-lang-id');
    if(selectedLang !== null){
        socket.emit('getLanguage', selectedLang);
    } else {
        console.log("choose a language");
    }
}

cancelLangBtn.addEventListener("click", function(e) {
    e.preventDefault();
    adminLangOptionDesc.style.display = 'block';
    adminLangSelectbox.selectedIndex = 0;
    langTextareaContent.style.display = 'none';
    langTextareaContent.value = '';
});

saveLangBtn.addEventListener("click", function(e) {
    e.preventDefault();
    let selectedLang = adminLangSelectbox.options[adminLangSelectbox.selectedIndex].getAttribute('data-lang-id');
    if(langTextareaContent.value !== ''){
        socket.emit('saveLanguage', {langContent: langTextareaContent.value, langId: selectedLang})
    } else {
        console.log("Empty");
    }
});

socket.on('displayLang', function(args){
    langTextareaContent.style.display = 'block';
    langTextareaContent.value = '';
    langTextareaContent.value += args;
});

socket.on('savedLanguage', function(){
    adminLangOptionDesc.style.display = 'block';
    adminLangSelectbox.selectedIndex = 0;
    langTextareaContent.style.display = 'none';
    langTextareaContent.value = '';
});

