let newList = document.getElementById('newList');
let newListName = document.getElementById('newListName');
let lists = document.getElementById('lists');

newList.addEventListener("click", function(){
    socket.emit('newList', {userId: userId, name: newListName.value});
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
 * @param {Object} data 
 * @returns HTML
 */
 function mediaCard(data){
    return `<a href='/${urlPath}/list/lists/${data.id}'>
                <div class='uk-card uk-card-default dashboard-favorite-padding'>
                    <div class='uk-card-media-top'>
                        <img src=https:\\\\www.themoviedb.org\\t\\p\\w600_and_h900_bestv2 onerror="this.onerror=null; this.src='/images/filmatory_default_poster.png'" alt=''>
                    </div>
                    <div class='uk-card-body'>
                        <h3 class='uk-card-title'>${data.title}</h3>
                        <p>Movies: 0</p>
                        <p>Shows: 0</p>
                    </div>
                </div>
            </a>`
}