let saveLangBtn = document.getElementById('admin-lang-save-btn');
let cancelLangBtn = document.getElementById('admin-lang-cancle-btn');
let adminLangSelectbox = document.getElementById("admin-lang-selectbox-edit");
let adminLangOptionDesc = document.getElementById('admin-lang-option-desc');
let langTextareaContent = document.getElementById('admin-lang-textarea-content');
let languageOutput = document.getElementById('selectLanguageOutput');

let adminAddLangErr = document.getElementById('admin-add-language-error');
let adminAddLangBtn = document.getElementById('admin-add-language-btn');
let adminLangOriginalName = document.getElementById('admin-lang-orginal-name-input');
let adminLangName = document.getElementById('admin-lang-name-input');
let adminLangCode = document.getElementById('admin-lang-code-input');

let adminDeleteLangBtn = document.getElementById('admin-lang-delete-btn');
let adminLangDeleteInput = document.getElementById('admin-lang-delete-input');
let adminLangDeleteError = document.getElementById('admin-deleted-language-error');
/**
 * Henter valgt språk
 * @Author Ørjan Dybevik - 233530
 */
function getLang(){
    adminLangOptionDesc.style.display = 'none';
    let selectedLang = adminLangSelectbox.options[adminLangSelectbox.selectedIndex].getAttribute('data-lang-id');
    if(selectedLang !== null){
        socket.emit('getLanguage', selectedLang);
        languageOutput.innerHTML = '';
    } else {
        languageOutput.innerHTML = 'Select a language';
    }
}

/**
 * Eventlistener som kansellerer valg som er gjort
 * @Author Ørjan Dybevik - 233530
 */
cancelLangBtn.addEventListener("click", function(e) {
    e.preventDefault();
    adminLangOptionDesc.style.display = 'block';
    adminLangSelectbox.selectedIndex = 0;
    langTextareaContent.style.display = 'none';
    langTextareaContent.value = '';
});

/**
 * Eventlistener som lagrer endringer
 * @Author Ørjan Dybevik - 233530
 */
saveLangBtn.addEventListener("click", function(e) {
    e.preventDefault();
    let selectedLang = adminLangSelectbox.options[adminLangSelectbox.selectedIndex].getAttribute('data-lang-id');
    if(langTextareaContent.value !== ''){
        socket.emit('saveLanguage', {langContent: langTextareaContent.value, langId: selectedLang})
        languageOutput.innerHTML = '';
    } else {
        languageOutput.innerHTML = 'Choose a language';
    }
});

/**
 * Viser språk som er valgt
 * @Author Ørjan Dybevik - 233530
 */
socket.on('displayLang', function(args){
    langTextareaContent.style.display = 'block';
    langTextareaContent.value = '';
    langTextareaContent.value += args;
});

/**
 * Tilbakestiller etter du har lagret endringer i ett språk
 * @Author Ørjan Dybevik - 233530
 */
socket.on('savedLanguage', function(){
    adminLangOptionDesc.style.display = 'block';
    adminLangSelectbox.selectedIndex = 0;
    langTextareaContent.style.display = 'none';
    langTextareaContent.value = '';
});

adminAddLangBtn.addEventListener("click", function(e){
    e.preventDefault();
    adminAddLangErr.style.display = 'none';
    adminAddLangErr.innerHTML = "";
    //Lager info
    admin_add_lang_details = {
        admindashlangoriginalname: adminLangOriginalName.value,
        admindashlangname: adminLangName.value,
        admindashlangcode: adminLangCode.value
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/admin/addlanguage`, {admin_add_lang_details: admin_add_lang_details});

    //Om suksess
    jqxhr.done(async function(result) {
        adminLangOriginalName.value = '';
        adminLangName.value = '';
        adminLangCode.value = '';
        swal("Success!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        window.location.href = `/${urlPath}/admin/admindashboard`;
    });

    //Om failure
    jqxhr.fail(function(result) {
        adminAddLangErr.style.display = 'block';
        adminAddLangErr.innerHTML = result.responseJSON.error;
    });
});

adminDeleteLangBtn.addEventListener("click", function(e){
    e.preventDefault();
    adminLangDeleteError.style.display = 'none';
    adminLangDeleteError.innerHTML = "";
    //Lager info
    admin_delete_lang_details = {
        admindashlangdelete: adminLangDeleteInput.value
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/admin/deletelanguage`, {admin_delete_lang_details: admin_delete_lang_details});

    //Om suksess
    jqxhr.done(async function(result) {
        adminLangDeleteInput.value = '';
        swal("Success!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        window.location.href = `/${urlPath}/admin/admindashboard`;
    });

    //Om failure
    jqxhr.fail(function(result) {
        adminLangDeleteError.style.display = 'block';
        adminLangDeleteError.innerHTML = result.responseJSON.error;
    });
});

