import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const form = document.getElementById('search-form');
const input = document.querySelector('#search-input');
const BtnSubmit = document.querySelector("[type='submit']");
const gallery = document.querySelector('.gallery');
const sticky = form.offsetTop;
const loadMoreBtn = document.querySelector('.load-more');

console.log(BtnSubmit);
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38934914-2e944618da476a445430d3d36';

const perPage = 40;
let page = 1;
let q = '';
const params = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

form.addEventListener('submit', onSubmit);
window.addEventListener('scroll', formSticky);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  event.currentTarget.value = input.value;
  if (!event.currentTarget.value) {
    return Notify.failure(
      'Sorry, the search field cannot be empty. Please enter information to search.'
    );
  }

  console.log(event.currentTarget.value);

  const { data } = await getImages(q);
  console.log(data);
  createImgCard(data);
  showInfo(data);
  stopSearch(data);
  // event.target.reset();
}

function showInfo(data) {
  if (data.hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function createImgCard(data) {
  const markup = data.hits.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
      return (
        acc +
        `<div class="photo-card">
  <a class="gallery__link" href="${largeImageURL}"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
  </a>
</div>`
      );
    },
    ''
  );

  console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

async function getImages(page = 1, perPage = 40) {
  q = encodeURIComponent(input.value);
  const url = `${BASE_URL}?key=${API_KEY}&q=${q}&${params}&page=${page}&per_page=${perPage}`;
  console.log(url);
  try {
    const response = await axios.get(url);
    console.log(response);
    return response;
  } catch (error) {
    Notify.failure(error);
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}

function formSticky() {
  if (window.scrollY > sticky) {
    form.classList.add('on-scroll');
    gallery.style.paddingTop = `72px`;
  } else {
    form.classList.remove('on-scroll');
    gallery.style.paddingTop = `24px`;
  }
}

async function onLoadMore(page) {
  page += 1;
  const { data } = await getImages(q, page, perPage);
  createImgCard(data);
  stopSearch(data);
  smoothScroll();
}

function stopSearch(data) {
  console.log(data);
  if (data.hits.length < 40 && data.hits.length > 0) {
    loadMoreBtn.style.display = 'none';
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  if (data.hits.length === 40) {
    loadMoreBtn.style.display = 'block';
  }
}
