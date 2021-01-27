function addingImages() {
    for (var i = 1; i <= 20; i++) {
        var image = document.createElement("img");
        image.setAttribute("src", "images/" + i + ".jpg");
        document.querySelector(".upcomingMovies").appendChild(image);
   }
}