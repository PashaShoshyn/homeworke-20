const API_KEY = "YOUR_PIXABAY_KEY"; 
const BASE_URL = "https://pixabay.com/api/";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.getElementById("load-more");

let query = "";
let page = 1;


async function fetchImages(searchQuery, pageNum) {
  try {
    const response = await fetch(
      `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${pageNum}&per_page=12&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Помилка запиту");
    }

    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return [];
  }
}


function renderCard({ webformatURL, largeImageURL, likes, views, comments, downloads }) {
  return `
    <li>
      <div class="photo-card">
        <img src="${webformatURL}" alt="" data-large="${largeImageURL}" />
        <div class="stats">
          <p class="stats-item"><i class="material-icons">thumb_up</i> ${likes}</p>
          <p class="stats-item"><i class="material-icons">visibility</i> ${views}</p>
          <p class="stats-item"><i class="material-icons">comment</i> ${comments}</p>
          <p class="stats-item"><i class="material-icons">cloud_download</i> ${downloads}</p>
        </div>
      </div>
    </li>
  `;
}


function updateGallery(images) {
  const markup = images.map(renderCard).join("");
  gallery.insertAdjacentHTML("beforeend", markup);

  
  const { lastElementChild } = gallery;
  if (lastElementChild) {
    lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.target.query.value.trim();

  if (!query) return;

  page = 1;
  gallery.innerHTML = "";
  const images = await fetchImages(query, page);

  if (images.length === 0) {
    gallery.innerHTML = "<p>Нічого не знайдено 😢</p>";
    loadMoreBtn.classList.add("hidden");
    return;
  }

  updateGallery(images);
  loadMoreBtn.classList.remove("hidden");
});


loadMoreBtn.addEventListener("click", async () => {
  page++;
  const images = await fetchImages(query, page);
  updateGallery(images);

  if (images.length === 0) {
    loadMoreBtn.classList.add("hidden");
  }
});