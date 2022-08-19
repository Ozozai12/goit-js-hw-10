import Notiflix from 'notiflix';
import './css/styles.css';
import fetchCountries from './fetchCountries';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const searchQuery = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchQuery.addEventListener('input', debounce(textInput, DEBOUNCE_DELAY));

function textInput() {
  fetchCountries(searchQuery.value.trim())
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryInfo.insertAdjacentHTML('beforeend', renderCountry(countries));
      } else if (countries.length <= 10) {
        countryList.insertAdjacentHTML('beforeend', renderList(countries));
      } else {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(countries => {
      if (!searchQuery.value || searchQuery.value === ' ') {
        Notiflix.Notify.warning('Type something to begin searching');
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}



function renderList(countries) {
  return countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" width="70"><span>${country.name.common}</span></li>`;
    })
    .join('');
}

function renderCountry(countries) {
  return countries
    .map(country => {
      return `<img src="${country.flags.svg}" width="90">
            <h1>${country.name.common}</span></h1>
            <p>Capital: <span>${country.capital}</span></p>
            <p>Population: <span>${country.population}</span></p>
            <p>Languages: <span>${Object.values(country.languages)}</span></p>
            `;
    })
    .join('');
}
