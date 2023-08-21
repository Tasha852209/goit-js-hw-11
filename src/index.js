import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';

const form = document.getElementById('search-form');
const input = document.querySelector('#search-input');
const BtnSubmit = document.querySelector("[type='submit']");
const gallery = document.querySelector('.gallery');

console.log(BtnSubmit);
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38934914-2e944618da476a445430d3d36';

let q = '';
const params = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  event.currentTarget.value = input.value;

  console.log(event.currentTarget.value);

  const { data } = await getImages(q);
  console.log(data);
  gallery.innerHTML = createImgCard(data);

  // if (images.length === 0) {
  //   return Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  // }
}

function createImgCard(data) {
  const markup = data.hits.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
      return (
        acc +
        `<div class="gallery-card">
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
  return markup;
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

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
