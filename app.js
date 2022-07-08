let totalPages;

let url = {
  current: null,
  index: `https://api.jikan.moe/v4/anime?`,
  tv: `&type=tv`,
  movie: `&type=movie`,
  genre: `&genres=`,
};

const displayAnime = (url, page) => {
  url += page;
  url.current = url;
  $.get(url, (data) => {
    console.log(url);
    console.log("api response", data);
    totalPages = data.pagination.last_visible_page;
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
    let i = 1;
    $(".display-content").empty();
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
          Watch Trailer
        </a>`);
      }
      let summary;
      if (anime.synopsis && anime.synopsis.length > 150) {
        summary = anime.synopsis.substring(0, 550).concat("...");
      } else {
        summary = anime.synopsis;
      }
      let $result = $(`
            <div class="card" id=${i}>
              <div class="card-cover">
                <img src="${anime.images.jpg.image_url}" alt="" class="card-img"/>
              </div>
              <div class="card-info">
                <h2 class="anime title">${anime.title_english}</h2>
                <span class="genre">${genre}</span>
                <div class='card-demo'>
                  <p class="type">${anime.type}<span>Score: ${anime.score}</span></p>
                </div>
                <div class='card-mid'>
                  <p class="summary">${summary}</p>
                  <a class="link" href="${anime.url}" target="_blank">Read More..</a>
                </div>
                <div class='card-bot'>
                  <button class='fav'><i class="fa-regular fa-star"></i></button>
                </div>
              </div>
            </div>
            `);

      $result.appendTo(".display-content");
      if (anime.trailer.url) $(`#${i} .card-bot`).prepend($trailer);
      i++;
    }
  });
};

// FAVORITE
// $('.fav').on('mouseover',(e)=>{
//   console.log('hi')
// $('.fav').addClass('fa-solid')
// })

// PAGINATION
let pages1 = document.querySelector(".pages.one");
let pages2 = document.querySelector(".pages.two");

const pageS1 = document.querySelectorAll(".pageSearch")[0];
const pageS2 = document.querySelectorAll(".pageSearch")[1];
$(".pageSearch").on("focus", (e) => {
  $(".pageS").addClass("focused");
  $(".icon").addClass("focused");
});
$(".pageSearch").on("focusout", (e) => {
  $(".pageS").removeClass("focused");
  $(".icon").removeClass("focused");
});

$(".pageS.one").on("submit", (e) => {
  e.preventDefault();
  pagination(totalPages, pageS1.valueAsNumber);
  pageS1.value = "";
  $(".pageS").removeClass("focused");
  $(".icon").removeClass("focused");
});
$(".pageS.two").on("submit", (e) => {
  e.preventDefault();
  pagination(totalPages, pageS2.valueAsNumber);
  pageS2.value = "";
  $(".pageS").removeClass("focused");
  $(".icon").removeClass("focused");
});
function pagination(totalPages, page, addquery) {
  let btn = "";
  let beforePages = page - 1;
  let afterPages = page + 1;
  let activeBtn;
  if (page > 1) {
    btn += `<button class='prev btn' onclick=pagination(totalPages,${page - 1})>
   <i class="fa-solid fa-angle-left"></i><span>Prev</span>
 </button>`;
  }
  if (page > 2) {
    btn += `<button class="num btn" data-page=${1}  onclick=pagination(totalPages,${1})>1</button>`;
    if (page > 3) {
      btn += `<button class="dot btn">...</button> `;
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
    btn += `<button class="num btn ${activeBtn}" data-page=${pageLength}  onclick=pagination(totalPages,${pageLength})>${pageLength}</button>`;
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      btn += `<button class="dot btn">...</button> `;
    }
    btn += `<button class="num btn" data-page=${totalPages} onclick=pagination(totalPages,${totalPages})>${totalPages}</button>`;
  }
  if (page < totalPages || page) {
    btn += `<button class='next btn' onclick=pagination(totalPages,${
      page + 1
    })> <span>Next</span><i class="fa-solid fa-angle-right"></i></button>`;
  }
  pages1.innerHTML = btn;
  pages2.innerHTML = btn;
  let pageQ = `&page=${page}`;
  if (url.genre && !addquery) {
    displayAnime(url.index + url.genre, pageQ);
  } else if (addquery && url.genre) {
    displayAnime(url.index + url.genre + addquery, pageQ);
  } else if (addquery) {
    displayAnime(url.index + addquery, pageQ);
  } else {
    displayAnime(url.index, pageQ);
  }
  if (url.genre === `&genres=`) {
    $(".filterA").addClass("checked");
    $(".filter").removeClass("checked");
  }
}
pagination(totalPages, 1);
// Changing url based on page
// On click we get page number and pass in as url
// how do we keep genre and add page number
//
// function changePage(page,url){

// }

// SEARCH
let query = "";
let dropdown = document.querySelector(".dropdown");
dropdown.addEventListener("click", (e) => {
  const data = e.target.dataset.genre;
  const removeGenre = (data) => {
    const urlstart = url.genre.indexOf(data);
    const end = data.length;
    const newG = url.genre.split("");
    newG.splice(urlstart, end);
    url.genre = newG.join("");
  };
  if (e.target.classList.contains("filterT")) {
    let id = e.target.id;
    if (id === "tv") {
      $(" #tv").toggleClass("checked");
      $(" #movie").removeClass("checked");
      console.log(query, "when tv checnked");
      
      if (query === url.tv) {
        query = ''
        pagination(totalPages, 1);
      } else {
        query = url.tv;
        pagination(totalPages, 1, url.tv);
      }
    }
    if (id === "movie") {
      $(" #movie").toggleClass("checked");
      $(" #tv").removeClass("checked");
      if (query === url.movie) {
        query = ''
        pagination(totalPages, 1);
      } else {
        query = url.movie;
        pagination(totalPages, 1, url.movie);
      }
    }
  }
  if (e.target.classList.contains("filterA")) {
    url.genre = `&genres=`;
    $(".filterA").toggleClass("checked");
    $(".filter").removeClass("checked");
    pagination(totalPages, 1, query);
  }
  if (e.target.classList.contains("filter")) {
    let id = e.target.id;
    if (url.genre.includes(data)) {
      removeGenre(data);
      $(`#${id} `).removeClass("checked");
      pagination(totalPages, 1, query);
    } else {
      url.genre += `${data}`;
      $(".filterA").removeClass("checked");
      $(`#${id} `).addClass("checked");
      pagination(totalPages, 1, query);
      console.log(query, "after tv checnked");
    }
  }
});

// STICKY NAVBAR
const navbar = document.querySelector(".dropdown");
let sticky = navbar.offsetTop;
onscroll = () => {
  if (scrollY >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
};
