import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    input: document.querySelector('[name="searchQuery"]'),
    form: document.querySelector('#search-form'),
    btnSearch: document.querySelector('[type="submit"]'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
};

const KEY = '30180377-fac51c2acf971fb8cf8c6aeca';
let pageCount = 0;



refs.btnLoadMore.style.visibility = "hidden";


function onSubmitForm(event) {
    event.preventDefault();
    refs.gallery.replaceChildren('');
    pageCount = 1;
    refs.btnLoadMore.style.visibility = "hidden";
    
    getResponse(pageCount);
};

async function getResponse(pageCount) {
    
    const searchInput = refs.input.value;
    
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
            page: pageCount,
            per_page: 40,
        },
    });
        
    const { data } = await axiosInstance.get();
        
    if (data.totalHits === 0) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } else if (data.totalHits > 0 && data.totalHits <= 40 && pageCount === 1) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        renderingImagesIn(data);
    } else if ((pageCount * 40) >= data.totalHits) {
        Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
        renderingImagesIn(data);
        refs.btnLoadMore.style.visibility = "hidden";
    } else if (data.totalHits >= 40 && pageCount === 1) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        renderingImagesIn(data);
        refs.btnLoadMore.style.visibility = "visible";
    } else {
        renderingImagesIn(data);
        refs.btnLoadMore.style.visibility = "visible";
    }
};

refs.btnLoadMore.addEventListener('click', () => {
    pageCount += 1;
    getResponse(pageCount);
})

refs.form.addEventListener('submit', onSubmitForm);

function renderingImagesIn(data) {
    data.hits.forEach(image => {
        return refs.gallery.insertAdjacentHTML('beforeend',
            `<a class="photo-link" href="${image.largeImageURL}">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width=300 height=200 />
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
    })

    lightbox.refresh();
    
    console.log(lightbox);
};

const lightbox = new SimpleLightbox('.gallery a', { enableKeyboard: "true", captionDelay: "250ms", captions: "true", captionSelector: "img", captionType: "attr", captionsData: "alt" });

    
    
// const { height: cardHeight } = document
//   .querySelector(".gallery")
//         .firstElementChild.getBoundingClientRect();
    

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
