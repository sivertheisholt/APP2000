let newList = document.getElementById('newList');
let newListName = document.getElementById('newListName');
let lists = document.getElementById('lists');
let createListOutput = document.getElementById('createListOutput');

/**
 * EventListener for å legge til ny liste
 * @author Sivert - 233518, Ørjan - 233530
 */
newList.addEventListener("click", function(){
    if(newListName.value == ""){
        return createListOutput.innerHTML = "You need to name your list";
    }
    socket.emit('newList', {userId: userId, name: newListName.value});
    createListOutput.innerHTML = "";
    newListName.value = "";
});

socket.on('newListResult', function(result){
    let media = mediaCard({
        id: result,
        title: newListName.value,
    })
    lists.innerHTML += media;
});

/**
 * Lager HTML for ny liste
 * @param {Object} list Liste informasjon
 * @returns HTML
 * @author Sivert - 233518
 */
 function mediaCard(list){
    return `<a href='/${urlPath}/list/lists/${list.id}'>
                <div class='uk-card uk-card-default dashboard-favorite-padding'>
                    <div class='uk-card-media-top'>
                        <img src=https:\\\\www.themoviedb.org\\t\\p\\w600_and_h900_bestv2 onerror="this.onerror=null; this.src='/images/filmatory_default_poster.png'" alt=''>
                    </div>
                    <div class='uk-card-body'>
                        <h3 class='uk-card-title'>${list.title}</h3>
                        <p>Movies: 0</p>
                        <p>Shows: 0</p>
                    </div>
                </div>
            </a>`
}