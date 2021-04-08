const baseUrl = `https://www.flickr.com/services/rest/`;
let apiKey = "API_KEY_HERE";
let format = "format=json&nojsoncallback=1";
let search = "flickr.photos.search";
let sort = "relevance";
let currentPage = 1;
let pageTotal = 0;
let imgSize = "n";
let url = "";
let license = 0;
let sortMobile = "relevance";
let input = "";

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

document.querySelector("#navicon").addEventListener("click", () => {
  document.querySelectorAll(".option-menu").forEach((element) => {
    element.classList.toggle("show");
  });
  updateNavIcon();
});

function updateNavIcon() {
  if (document.querySelector("#burger").style.display == "none") {
    document.querySelector("#burger").style.display = "flex";
    document.querySelector("#cross").style.display = "none";
  } else {
    document.querySelector("#cross").style.display = "flex";
    document.querySelector("#burger").style.display = "none";
  }
}

async function searchRandom() {
  let images = await randomWord();
  updateUI(images);
  document.querySelector("a.previous").style.visibility = "hidden";
  document.querySelector("a.next").style.visibility = "hidden";
}

document.querySelector("#random-search").addEventListener("click", async () => {
  searchRandom();
});

document.querySelector("input").addEventListener("keyup", async () => {
  if (event.keyCode == 13 && isMobile) {
    searchMobile();
  } else if (event.keyCode == 13) {
    searchPc();
  }
});

document.querySelector(".button-search").addEventListener("click", async () => {
  if (isMobile) {
    searchMobile();
  } else {
    searchPc();
  }
});

async function searchMobile() {
  input = document.querySelector("input").value;
  let images = await getImagesMobile();
  updateNavButtons();
  updateUI(images);
  document.querySelector("footer").style.display = "flex";
  document.querySelector("input").blur();
}

async function searchPc() {
  input = document.querySelector("input").value;
  let images = await getImages();
  updateNavButtons();
  updateUI(images);
  document.querySelector("footer").style.display = "flex";
  document.querySelector("input").blur();
}

document.querySelector("a#relevance").addEventListener("click", async () => {
  sort = "relevance";
  searchPc();
});

document.querySelector("a#dpAsc").addEventListener("click", async () => {
  sort = "date-posted-asc";
  searchPc();
});

document.querySelector("a#dpDesc").addEventListener("click", async () => {
  sort = "date-posted-desc";
  searchPc();
});

function updateNavButtons() {
  if (currentPage == 1) {
    document.querySelector("a.previous").style.visibility = "hidden";
  } else {
    document.querySelector("a.previous").style.visibility = "visible";
  }
  if (currentPage == pageTotal || pageTotal == 1) {
    document.querySelector("a.next").style.visibility = "hidden";
  } else {
    document.querySelector("a.next").style.visibility = "visible";
  }
}

document.querySelector("a.next").addEventListener("click", async () => {
  nextPage();
});

document.querySelector("a.previous").addEventListener("click", async () => {
  previousPage();
});

document.addEventListener("keyup", async () => {
  if (event.keyCode == 39) {
    nextPage();
  }
});

document.addEventListener("keyup", async () => {
  if (event.keyCode == 37) {
    previousPage();
  }
});

async function nextPage() {
  if (currentPage < pageTotal) {
    currentPage++;
  }
  updateNavButtons();
  let images = await getImages();
  updateUI(images);
}

async function previousPage() {
  if (currentPage > 1) {
    currentPage--;
  }
  updateNavButtons();
  let images = await getImages();
  updateUI(images);
}

function mobileSort() {
  let sortValue = document.querySelector("#mobile-sort").value;
  if (sortValue == 0) {
    sortMobile = "relevance";
  } else if (sortValue == 1) {
    sortMobile = "date-posted-asc";
  } else if (sortValue == 2) {
    sortMobile = "date-posted-desc";
  }
  return sortMobile;
}

async function getImagesMobile() {
  let license = document.querySelector("#attribution").value;
  let inputLength = input.length;
  if (inputLength > 0) {
    try {
      mobileSort();
      let url = `${baseUrl}?method=${search}&text=${input}&api_key=${apiKey}&page=${currentPage}&sort=${sortMobile}&${format}&license=${license}&per_page=50`;
      let resp = await fetch(url);
      let data = await resp.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

async function getImages() {
  let license = document.querySelector("#attribution").value;
  let inputLength = input.length;
  if (inputLength > 0) {
    try {
      let url = `${baseUrl}?method=${search}&text=${input}&api_key=${apiKey}&page=${currentPage}&sort=${sort}&${format}&license=${license}`;
      let resp = await fetch(url);
      let data = await resp.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

function imgUrl(img) {
  let sizeInfo = document.querySelector("#image-size").value;
  if (sizeInfo == 0) {
    imgSize = "n";
  }
  if (sizeInfo == 1) {
    imgSize = "z";
  }
  if (sizeInfo == 2) {
    imgSize = "b";
  }
  let url = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_${imgSize}.jpg`;
  return url;
}

function updateUI(data) {
  let main = document.querySelector("main section.gallery");
  main.innerHTML = "";
  data.photos.photo.forEach((img) => {
    if (img.farm == 0) {
    } else {
      let figure = document.createElement("figure");
      let image = document.createElement("img");
      image.setAttribute("src", imgUrl(img, imgSize));
      image.setAttribute("alt", img.title);
      figure.appendChild(image);
      main.appendChild(figure);
      image.addEventListener(`click`, () => {
        lightbox(imgUrl(img, imgSize));
      });
      pageTotal = data.photos.pages;
      return pageTotal;
    }
  });
}

function lightbox(url) {
  let el = document.createElement("img");
  el.setAttribute("src", url);
  document.querySelector(".overlay").appendChild(el);
  document.querySelector(".overlay").classList.add("show");
  document.querySelector(".overlay").classList.remove("hide");
  document.querySelector("html").style.overflow = "hidden";

  document.querySelector(".overlay").addEventListener("click", () => {
    document.querySelector(".overlay").innerHTML = "";
    document.querySelector(".overlay").classList.remove("show");
    document.querySelector(".overlay").classList.add("hide");
    document.querySelector("html").style.overflow = "auto";
  });
}

async function randomWord() {
  var things = [
    "unlikely",
    "shout",
    "husband",
    "swop",
    "cart",
    "dialect",
    "cafe",
    "problem",
    "acute",
    "skate",
    "privilege",
    "pillow",
    "short",
    "delivery",
    "factor",
    "secretary",
    "mercy",
    "sugar",
    "formula",
    "palm",
  ];
  var randomInput = things[Math.floor(Math.random() * things.length)];
  try {
    let url = `${baseUrl}?method=${search}&text=${randomInput}&api_key=${apiKey}&page=${currentPage}&sort=${sort}&${format}&license=${license}`;
    let resp = await fetch(url);
    let data = await resp.json();
    document.querySelector("input").value = `${randomInput}`;
    input = randomInput;
    return data;
  } catch (error) {
    console.error(error);
  }
}
