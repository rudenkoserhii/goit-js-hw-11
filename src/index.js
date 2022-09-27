import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    body: document.querySelector('body'),
    input: document.querySelector('[name="searchQuery"]'),
    form: document.querySelector('#search-form'),
    btnSearch: document.querySelector('[type="submit"]'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
};

const KEY = '30180377-fac51c2acf971fb8cf8c6aeca';
let pageCount = 0;

refs.body.style.display = "flex";
refs.body.style.alignItems = "center";
refs.body.style.justifyContent = "center";
refs.body.style.flexDirection = "column";

refs.gallery.style.display = "flex";
refs.gallery.style.flexWrap = "wrap";
refs.gallery.style.gap = "10px";
refs.gallery.style.alignItems = "center";
refs.gallery.style.justifyContent = "center";
refs.gallery.style.marginTop = "10px";
refs.gallery.style.marginBottom = "10px";


refs.btnLoadMore.style.visibility = "hidden";
refs.btnLoadMore.style.fontSize = "20px";
refs.btnLoadMore.style.fontFamily = "Century Gothic, sans-serif";

refs.input.style.fontSize = "20px";
refs.input.style.fontFamily = "Century Gothic, sans-serif";

refs.btnSearch.style.fontSize = "20px";
refs.btnSearch.style.fontFamily = "Century Gothic, sans-serif";

refs.form.style.backgroundColor = "aquamarine";
refs.form.style.width = "100%";
refs.form.style.padding = "10px 10px";
refs.form.style.gap = "10px";
refs.form.style.display = "flex";
refs.form.style.justifyContent = "center";
refs.form.style.alignItems = "center";






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
        scrollStart();
    } else if ((pageCount * 40) >= data.totalHits) {
        Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
        renderingImagesIn(data);
        scrollMore()
        refs.btnLoadMore.style.visibility = "hidden";
    } else if (data.totalHits >= 40 && pageCount === 1) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        renderingImagesIn(data);
        scrollStart()
        refs.btnLoadMore.style.visibility = "visible";
    } else {
        renderingImagesIn(data);
        scrollMore()
        refs.btnLoadMore.style.visibility = "visible";
    }
};

refs.btnLoadMore.addEventListener('click', () => {
    pageCount += 1;
    getResponse(pageCount);
    scrollMore()
})

refs.form.addEventListener('submit', onSubmitForm);

function renderingImagesIn(data) {
    data.hits.forEach(image => {
        return refs.gallery.insertAdjacentHTML('beforeend',
            `<a class="photo-link" href="${image.largeImageURL}">
                <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width=300 height=200 />
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
        );
    });

    lightbox.refresh();
    

    
    const photoLinks = refs.gallery.querySelectorAll('.photo-link').forEach(photoLink => {
        photoLink.style.display = "flex";
        photoLink.style.alignItems = "center";
        photoLink.style.justifyContent = "center";
        photoLink.style.flexDirection = "column";
        photoLink.style.textDecoration = "none";
    });
    const infoS = refs.gallery.querySelectorAll('.info').forEach(info => {
        info.style.fontFamily = "Century Gothic, sans-serif";
        info.style.display = "flex";
        info.style.alignItems = "center";
        info.style.justifyContent = "center";
        info.style.gap = "10px";
        info.style.color = "black";
    });
    const infoItemS = refs.gallery.querySelectorAll('.info-item').forEach(infoItem => {
        infoItem.style.display = "flex";
        infoItem.style.alignItems = "center";
        infoItem.style.justifyContent = "center";
        infoItem.style.flexDirection = "column"
    });
};

const lightbox = new SimpleLightbox('.gallery a', { enableKeyboard: "true", captionDelay: "250ms", captions: "true", captionSelector: "img", captionType: "attr", captionsData: "alt" });

function scrollStart() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 0.22,
        behavior: "smooth",
    });
};
    
function scrollMore() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2.18,
        behavior: "smooth",
    });
};
