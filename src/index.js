import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const refs = {
    input: document.querySelector('[name="searchQuery"]'),
    form: document.querySelector('#search-form'),
    btnSearch: document.querySelector('[type="submit"]'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
};

const KEY = '30180377-fac51c2acf971fb8cf8c6aeca';

async function onSubmitForm(event) {
    event.preventDefault();
    
    let searchInput = refs.input.value;
    
    if (!searchInput) {
        return Notiflix.Notify.warning('Fill the fields!');
    }
        
    const axiosInstance = axios.create({
        baseURL: 'https://pixabay.com/api/',
        headers: { 'Content-Type': 'application/json' },
        params: {
            key: KEY,
            q: `${searchInput}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
        },
    });
        
    const { data } = await axiosInstance.get();
        
    if (data.totalHits === 0) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } else {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        renderingImagesIn(data);
        console.log(data);
        return data;
        
    }
};

refs.form.addEventListener('submit', onSubmitForm);

function renderingImagesIn(data) {
    data.hits.forEach(image => {
        return refs.gallery.insertAdjacentHTML('beforeend',
    `<a class="photo-card" href="${image.largeImageURL}">
        <img src="${image.previewURL}" alt="${image.tags}" loading="lazy" />
    
        <div class="info">
        <p class="info-item">
        <b>Likes</b>${image.likes}
        </p>
        <p class="info-item">
        <b>Views</b>${image.views}
        </p>
        <p class="info-item">
        <b>Comments</b>${image.comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>${image.downloads}
        </p>
    </div>
</a>`
    )
    });
    
};




// let gallery = new SimpleLightbox('.gallery a');

// gallery.next();

const lightbox = new SimpleLightbox('.gallery a', { enableKeyboard: "true", captionDelay: "250ms", captions: "true", captionSelector: "img", captionType: "attr", captionsData: "alt" });

// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });