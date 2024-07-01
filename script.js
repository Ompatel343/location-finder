const btn = document.querySelector(".btn");
const loc = document.querySelector(".location");

let cords, countryName, locality, countryName2;

const renderCountry = function (data) {
  const name = data.name.common;
  const flag = data.flags.svg;
  const region = data.region;
  const language = Object.values(data.languages)[0];
  const currency = Object.values(data.currencies)[0].name;

  const html = `
  <article class="country">
    <img class="country__img" src="${flag}" />
    <div class="country__data">
      <h3 class="country__name">${locality},${countryName2},${name}</h3>
      <h class="country__name">info about ${name}</h>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}M people</p>
      <p class="country__row"><span>🗣️</span>${language}</p>
      <p class="country__row"><span>💰</span>${currency}</p>
    </div>
  </article>
  `;
  loc.insertAdjacentHTML("beforeend", html);
  loc.classList.remove("hidden");
  btn.classList.add("hidden");
};

const success = function (position) {
  console.log(position);
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  cords = [latitude, longitude];
  console.log(latitude, longitude);
};

const fail = function () {
  alert("sorry we coulden't get your position");
};

navigator.geolocation.getCurrentPosition(success, fail);

const WhereAmI = function (coords) {
  console.log(cords);
  fetch(`
    https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${cords[0]}&longitude=${cords[1]}&localityLanguage=en
  `)
    .then(function (response) {
      if (!response.ok) {
        throw new error(`error.status`);
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(`you are in ${data.locality},${data.countryName}`);
      locality = data.locality;
      countryName2 = data.principalSubdivision;

      return data;
    })
    .then(function (data) {
      return fetch(
        `https://restcountries.com/v3.1/name/${data.countryName}?fullText=true`
      );
    })
    .then(function (response) {
      if (!response.ok) {
        throw new error(`error.status`);
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry(data[0]);
    })
    .catch(function (error) {
      console.log(error);
    });
};

btn.addEventListener("click", WhereAmI);
