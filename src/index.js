import axios from 'axios';
import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';

const form = document.getElementById('search-form');
const input = document.querySelector('#search-input');
const BtnSubmit = document.querySelector("[type='submit']");
const gallery = document.querySelector('.gallery');

console.log(BtnSubmit);
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38934914-2e944618da476a445430d3d36';

const q = encodeURIComponent(input.value);
const params = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  event.currentTarget.value = input.value;

  console.log(event.currentTarget.value);

  const { data } = await getImages(q);
  console.log(data);
  createImgCard(data);
  // if (images.length === 0) {
  //   return Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  // }
}

function createImgCard(data) {
  //     const images = ;
  //   console.log(images);

  const markup = data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) =>
      `<div class="photo-card">
  <a class="gallery__link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
</div>`.join('')
  );

  return (gallery.insertAdjacentHTML = ('beforeend', markup));
}

async function getImages(page = 1, perPage = 40) {
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
