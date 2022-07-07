let totalPages;
let pages = document.querySelector(".pages");

let url = {
  index:`https://api.jikan.moe/v4/anime?type=tv,movie,ova,special`,
  genre:`https://api.jikan.moe/v4/anime`,
}

const displayAnime = (url, page) => { 
    url += page
  
  $.get(url, (data) => {
    console.log(url);
    console.log("api response", data);
    totalPages = data.pagination.last_visible_page
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
    $(".display-content").empty()
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

const pageS = document.querySelector('#pageSearch')
$('#pageS').on('submit',(e)=>{
  e.preventDefault()
  pagination(totalPages,pageS.valueAsNumber)
  pageS.value = ''
})
function pagination(totalPages, page , query) {
  let btn = "";
  let beforePages = page - 1;
  let afterPages = page + 1;
  let activeBtn;
  if (page > 1) {
      btn += `<button class='prev' onclick=pagination(totalPages,${page - 1})>
   <i class="fa-solid fa-angle-left"></i><span>Prev</span>
 </button>`;
  }
  if (page > 2) {
    btn += `<button class="num" data-page=${1}  onclick=pagination(totalPages,${1})>1</button>`;
    if (page > 3) {
      btn += `<button class="dot">...</button> `;
    }
  }
  // SHOW HOW MANY PAGES BEFORE WHEN AT END
  if (page === totalPages) {
    beforePages = beforePages - 2;
  } else if (page === totalPages - 1) {
    beforePages = beforePages - 1;
  }
  // SHOW HOW MANY PAGES AFTER WHEN AT BEGINNING
  if (page === 1) {
    afterPages = afterPages + 2;
  } else if (page === 2) {
    afterPages = afterPages + 1;
  }
  // CREATE IN BETWEEN PAGES
  for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
    if (pageLength > totalPages) {
      continue;
    }
    if (pageLength === 0) {
      pageLength = pageLength + 1;
    }
    if (page === pageLength) {
      activeBtn = "active";
    } else {
      activeBtn = "";
    }
    btn += `<button class="num ${activeBtn}" data-page=${pageLength}  onclick=pagination(totalPages,${pageLength})>${pageLength}</button>`;
  }

  if (page < totalPages - 1 ) {
    if (page < totalPages - 2) {
      btn += `<button class="dot">...</button> `;
    }
    btn += `<button class="num" data-page=${totalPages} onclick=pagination(totalPages,${totalPages})>${totalPages}</button>`;
  }
  if (page < totalPages || page ) {
      btn += `<button class='next' onclick=pagination(totalPages,${
        page + 1
      })> <span>Next</span><i class="fa-solid fa-angle-right"></i></button>`;
  }
  pages.innerHTML = btn;
  let pageQ = `&page=${page}`
  if(url.index.length < url.genre.length){
    displayAnime(url.genre, pageQ)
  }else{
    displayAnime(url.index, pageQ)
  }
}
pagination(totalPages,1)
// Changing url based on page
// On click we get page number and pass in as url
// how do we keep genre and add page number
// 
// function changePage(page,url){

// }


// SEARCH
let query = "";
let dropdown = document.querySelector('.dropdown')
dropdown.addEventListener("click", (e) => {
  if(e.target.classList.contains('dropdown')){}
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
    url.genre = url.index+query
    pagination(totalPages,1)
  }
});
// displayAnime();
