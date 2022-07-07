let noPageURL;
const displayAnime = (Qparams) => {
  if (!Qparams) Qparams = "";
  let url = `https://api.jikan.moe/v4/anime?type=tv,movie,ova,special,ona${Qparams}`;
  if (Qparams.includes("&page=")) {
    let i = url.indexOf("&page");
    noPageURL = url.substring(0, i);
    url = noPageURL += Qparams;
  }
  $.get(url, (data) => {
    console.log(url);
    console.log("api response", data);
  }).done((res) => {
    const show = res.data;
    const arrayIterator = (key1, key2) => {
      let output = "";
      for (let i = 0; i < anime[key1].length; i++) {
        if (i === anime[key1].length - 1) {
          output += `${anime[key1][i][key2]} `;
        } else {
          output += `${anime[key1][i][key2]}, `;
        }
      }
      return output;
    };
    let time = 0;
    let i = 1;
    for (anime of show) {
      let themes = "";
      if (anime.themes) {
        themes = arrayIterator("themes", "name");
      }
      let genre = "";
      if (anime.genres) {
        genre = arrayIterator("genres", "name");
      }

      if (!anime.images.jpg.image_url || !anime.title_english) {
        continue;
      }
      let $trailer;
      if (anime.trailer.url) {
        $trailer =
          $(`<a class="trailer" href="${anime.trailer.url}" target="_blank">
          Trailer
        </a>`);
      }
      let $result = $(`
            <div class="card" id=${i}>
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
            </div>
            </div>
            `);
      $result.appendTo(".display-content");

      if (anime.trailer.url) $(`#${i} .card-info`).append($trailer);
      $(".card").hide().fadeIn(time);
      time += 300;
      i++;
    }
  });
};

// PAGINATION
$(".pageNums").on("click", "button", (e) => {
  $(".display-content").empty();
  const pageNum = e.target.innerText;
  displayAnime(`&page=${pageNum}`);
});

// SEARCH
let query = "";
$(".dropdown").on("click", (e) => {
  const data = e.target.dataset.genre;
  const removeGenre = (data) => {
    const start = query.indexOf(data);
    const end = data.length;
    const newQ = query.split("");
    newQ.splice(start, end);
    query = newQ.join("");
  };

  if (e.target.classList.contains("dropBtn")) {
    if (query.includes(data)) {
      removeGenre(data);
    } else {
      const dataArr = data.split("");
      const q = query.split("");
      const newQ = dataArr.concat(q);
      query = newQ.join("");
    }
    $(".dropdown-content").toggle();
  }
  if (e.target.classList.contains("filter")) {
    let id = e.target.id;
    if (query.includes(data)) {
      removeGenre(data);
      $(`#${id} .checked`).hide();
    } else {
      query += `${data}`;
      $(`#${id} .checked`).show();
    }
    $(".display-content").empty();

    console.log(query);
    displayAnime(query);
  }
});
displayAnime();
