import Notiflix from 'notiflix';
import './css/styles.css';

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

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function renderList(countries) {
  return countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" width="40" height="40">${country.name.common}</li>`;
    })
    .join('');
}

function renderCountry(countries) {
  return countries
    .map(country => {
      return `<img src="${country.flags.svg}" width="50">
            <h1>${country.name.common}</h1>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Language: ${Object.values(country.languages)}</p>
            `;
    })
    .join('');
}
