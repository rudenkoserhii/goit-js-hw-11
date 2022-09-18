import debounce from "lodash.debounce";
import Notiflix from "notiflix";


const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'), 
};
let name = '';

function onInputFill() {
    refs.countryInfo.replaceChildren('');
    refs.countryList.replaceChildren('');
    
    name = refs.input.value.trim();
    if (name.length > 0) {
        fetchCountries(name);
    } return;
};

refs.input.addEventListener('input', debounce(onInputFill, 300));

function fetchCountries(name) {
    const options = ['name', 'capital', 'population', 'flags', 'languages'];
    
    const url = `https://restcountries.com/v3.1/name/${name}?fields=${options.join(',')}`;
    fetch(url).then(response => {
    if (response.ok) {
      return response.json()
    } else if(response.status === 404) {
      return Promise.reject('error 404')
    } else {
      return Promise.reject('some other error: ' + response.status)
    }
  })
  .then(data => addCountryInfo(data))
  .catch(error => Notiflix.Notify.failure('Oops, there is no country with that name'));
};

function addCountryInfo(data) {
    if
    //     (data.status === 404) {
    //     Notiflix.Notify.failure('Oops, there is no country with that name');
    // } else if
        (data.length === 1) {
        const selectedCountryInfo = `<div class = "country_name_container"><img class = "flag" src = "${data[0].flags.svg}" alt = "Flag of the country" width = "100px"></img>
            <h2 class="country_title"> ${data[0].name.official}</h2></div>
            <ul class="country_list-info"><li class="country_list-info_name">Capital: <span class="country_list-info_item">${data[0].capital}</span></li>
            <li class="country_list-info_name">Population: <span class="country_list-info_item">${data[0].population}</span></li>
            <li class="country_list-info_name">Languages: <span class="country_list-info_item">${(Object.values(data[0].languages)).join(', ')}</span></li></ul>`;
        refs.countryInfo.insertAdjacentHTML('beforeend', selectedCountryInfo);
        
        const refsIn = {
            countryNameContainer: document.querySelector('.country_name_container'),
            countryTitle: document.querySelector('.country_title'),
            countryListInfo: document.querySelector('.country_list-info'),
            countryListInfoName: document.querySelectorAll('.country_list-info_name'),
            countryListInfoItem: document.querySelectorAll('.country_list-info_item'),
        };
        
        refsIn.countryNameContainer.style.display = "flex";
        refsIn.countryNameContainer.style.alignItems= "center";
        refsIn.countryNameContainer.style.justifyContent = "left";
        refsIn.countryNameContainer.style.gap = "20px";
        refsIn.countryTitle.style.fontSize = "50px";
        refsIn.countryListInfo.style.listStyleType = "none";
        refsIn.countryListInfoName.forEach(item => item.style.fontWeight = "bold");
        refsIn.countryListInfoItem.forEach(item => item.style.fontWeight = "normal");
        if (data[0].name.official.toLowerCase().includes('russi')) {
            refsIn.countryTitle.textContent = 'Russian war ship F*ck Off!';
        };
    } else if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (data.length < 10 && data.length > 1) {
        for (let i = 0; i < data.length; i += 1) {
            const countrySearchlist =
                `<li class="country_searchlist">
                <img class = "country_searchlist_flag" src = "${data[i].flags.svg}" alt = "Small flag of the country" width = "20px"></img>
                <p class="country_searchlist_name">${data[i].name.official}</p></li>`;
            refs.countryList.insertAdjacentHTML('beforeend', countrySearchlist);
        }
        
        const refsInSearch = {
            countrysSearchList: document.querySelectorAll('.country_searchlist'),
            countrysSearchlistName: document.querySelectorAll('.country_searchlist_name'),
        };
        
        refsInSearch.countrysSearchList.forEach(item => item.style.display = "flex");
        refsInSearch.countrysSearchList.forEach(item => item.style.alignItems= "center");
        refsInSearch.countrysSearchList.forEach(item => item.style.justifyContent = "left");
        refsInSearch.countrysSearchList.forEach(item => item.style.gap = "10px");
        refs.countryList.style.listStyleType = "none";
        refsInSearch.countrysSearchlistName.forEach((item) => {
            item.style.fontWeight = "bold";
            item.style.fontSize = "16px";
            item.style.margin = "3px 0px";
        });
    };
};


