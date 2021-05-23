$('#searchBox').on('input',function() {
    if($(this).val() == "") {
        document.getElementById('searchDiv').style.display = 'none';
        document.getElementById('searchDiv').innerHTML = ``;
    } else {
        socket.emit("userInputSearch", $(this).val())
    }
});

function maxText(data, max){
    if(data.length > max){
        for(let i = max; i < max+20; i++){
            if(data.charAt(i) == ' '){
                return data.slice(0,i-1) + '...';
            }
        }
    }
    return data;
}

socket.on('resultatMedia', (resultMedia) => {
    document.getElementById('searchDiv').innerHTML = ``;
    document.getElementById('searchDiv').style.display = 'block';
    if(resultMedia.length === 0){
        document.getElementById('searchDiv').innerHTML += `<div class="uk-card uk-card-default uk-grid uk-grid-collapse uk-width-1-1@s search-result" style="background-color: rgb(223, 223, 223);">
                                                                <div class="uk-width-expand">
                                                                    <div class="uk-card-body">
                                                                        <h3 class="uk-card-title uk-text-center">No results found</h3>
                                                                    </div>
                                                                </div>
                                                            </div>`
        
    }
    for(const media of resultMedia) {
        document.getElementById('searchDiv').innerHTML += `<a href= "https://filmatoryeksamen.herokuapp.com/en/mediainfo/${media.type == 'tv' ? 'serieinfo' : 'filminfo'}/${media.id}">
                                                                <div class="uk-card uk-card-default uk-grid uk-grid-collapse uk-width-1-1@s search-result">
                                                                    <div class="uk-card-media-left uk-cover-container uk-width-auto">
                                                                        <img class="search-image-style center" src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${media.poster_path}" onerror="this.onerror=null; this.src='/images/filmatory_default_poster.png'" alt="">
                                                                    </div>
                                                                    <div class="uk-width-expand">
                                                                        <div class="uk-card-body">
                                                                            <h3 class="uk-card-title">${media.title}</h3>
                                                                            <p>${maxText(media.overview, 120)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>`
    }
});
            