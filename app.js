$.get(
  "https://api.jikan.moe/v4/anime?type=tv,movie,ova,special,ona",
  function (data) {}
).done((res) => {
  const show = res.data;
   console.log(show)
  const arrayIterator =(key1, key2) =>{
   let output = ''
   for(let i = 0; i < anime[key1].length;i++){
      if (i === anime[key1].length - 1) {
         output += `${anime[key1][i][key2]} `;
       } else {
         output += `${anime[key1][i][key2]}, `;
       }
   }
   return output
  }
  for (anime of show) {
    let themes = "";
    if (anime.themes) {
      themes = arrayIterator('themes','name')
    }
    let genre = "";
    if (anime.genres) {
      genre = arrayIterator('genres','name')
    }

    if (
      !anime.images.jpg.image_url ||
      !anime.title_english ||
      !anime.trailer.url
    ) {
      continue;
    }
    let $result = $(`
            <div class="card">
                <div class="card-cover">
                  <a class="link" href="${anime.url}" target="_blank">
                    <img
                      src="${anime.images.jpg.image_url}"
                      alt=""
                      class="card-img"
                    />
                    </a>
                    </div>
                    <div class="card-info">
                    <h2 class="anime title">${anime.title_english}</h2>
                  <h3 class="theme">${themes}</h3>
                  <h4 class="genre">${genre}</h4>
                  <p class="summary">
                  ${anime.synopsis}
                  </p>
                  <p class="type">${anime.type}<span>Score: ${anime.score}</span></p>
                  <a class="trailer" href="${anime.trailer.url}" target="_blank">Trailer</a>
                </div>
              </div>
         `);
    $result.appendTo(".display");
  }
});
