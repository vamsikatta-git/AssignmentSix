const api_key = "89703a5d";

const fav = async (id) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&i=${id}`);
  const data = await response.json();

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


  if (!favorites.some(movie => movie.imdbID === id)) {
    favorites.push(data);
    localStorage.setItem('favorites', JSON.stringify(favorites)); 
    Toastify({
      text: "Added to Favorites",
      duration: 3000, 
      close: true,    
      gravity: "top", 
      position: "right", 
      backgroundColor: "red", 
    }).showToast();
  } else {
    Toastify({
      text: "Already in Favorites",
      duration: 3000, 
      close: true,    
      gravity: "top",  
      position: "right",
      backgroundColor: "orange", 
    }).showToast();
  }

  if (document.getElementById('favDiv')) {
    displayFavorites(favorites);
  }
};

const movieDetailsDiv = async(id)=>{
  const response = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&i=${id}`);
  const data = await response.json();
  console.log(data);
  localStorage.setItem('selectedMovie', JSON.stringify(data)); 

  window.location.href = 'moviedetails.html';
}
const movieDetails = (movie)=>{
  const detailsDiv = document.getElementById('movieDetails');
  console.log(movie)
  detailsDiv.innerHTML = `
    <img src="${movie.Poster === 'N/A' ? 'https://via.placeholder.com/150' : movie.Poster}" alt="Movie Poster">
    <div>
    <h2>${movie.Title}</h2>
    <p class="text-light"><strong class="new-text">Released :</strong> ${movie.Year}</p>
    <p class="text-light"><strong class="new-text">Type :</strong> ${movie.Type}</p>
    <p class="text-light"><strong class="new-text">Plot :</strong> ${movie.Plot}</p>
    <p class="text-light"><strong class="new-text">Director :</strong> ${movie.Director}</p>
    <p class="text-light" ><strong class="new-text">Actors :</strong> ${movie.Actors}</p>
    <p class="text-light"><strong class="new-text">IMDB Rating :</strong> ${movie.imdbRating}</p>
    <h3 class="new-text">Ratings</h3>
    ${movie.Ratings.map((item,index)=>`<p class="text-light m-0"><i>${item.Source}</i> : ${item.Value}</p>`)}
    </div>
  `;
}
const saveReview = (id) => {
  const rating = document.getElementById('rating').value;
  const review = document.getElementById('review').value;

  // Save rating and review to localStorage
  let ratings = JSON.parse(localStorage.getItem('ratings')) || {};
  let reviews = JSON.parse(localStorage.getItem('reviews')) || {};

  ratings[id] = rating;
  reviews[id] = review;

  localStorage.setItem('ratings', JSON.stringify(ratings));
  localStorage.setItem('reviews', JSON.stringify(reviews));

  Toastify({
    text: "Rating and Review Saved",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "green",
  }).showToast();
};
const displayFavorites = (favorites) => {
  const favDiv = document.getElementById('favDiv');

  if (!favDiv) return; 

  favDiv.innerHTML = favorites.map(item => `
    <div class="col">
      <div class="card">
        <img src="${item.Poster === "N/A" ? "https://via.placeholder.com/150" : item.Poster}" class="card-img-top" alt="poster">
        <div class="card-body bg-dark text-light">
          <h5 class="card-title"><strong>Title:</strong> ${item.Title}</h5>
          <p class="card-text"><strong>Type:</strong> ${item.Type}</p>
          <p class="card-text"><strong>Released In:</strong> ${item.Year}</p>
          <button class="btn btn-danger" onclick="removeFavorites('${item.imdbID}')">Remove from Favorites</button>
        </div>
      </div>
    </div>
  `).join('');
};

function removeFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(movie => movie.imdbID !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  Toastify({
    text: "Removed from favorites",
      duration: 3000, 
      close: true,    
      gravity: "top",  
      position: "right",
      backgroundColor: "red", 
  }).showToast();
  displayFavorites(favorites);
}


const fetchingApi = async (event) => {
  event.preventDefault();
  const inputSearch = document.getElementById('search-btn');
  let inputValue = inputSearch.value;
  if (!inputValue) return;
  const response = await fetch(`https://www.omdbapi.com/?apikey=${api_key}&s=${inputValue}`);
  const data = await response.json();
  const items = data.Search;
  console.log(items)
  localStorage.setItem('cardItems',JSON.stringify(items))

  if (document.getElementById('cards-div')) {
    displayCards(items);
  }
};

const displayCards = (items)=>{
  const cardsDiv = document.getElementById('cards-div');
  cardsDiv.innerHTML = items
    .map((item) => `
      <div class="col">
        <div class="card">
          <img src="${item.Poster === "N/A" ? "https://via.placeholder.com/150" : item.Poster}" onclick="movieDetailsDiv('${item.imdbID}')" class="card-img-top" alt="poster">
          <div class="card-body bg-dark text-light">
            <h5 class="card-title"><strong>Title:</strong> ${item.Title}</h5>
            <p class="card-text"><strong>Type:</strong> ${item.Type}</p>
            <p class="card-text"><strong>Released In:</strong> ${item.Year}</p>
            <button class="btn btn-success" onclick="fav('${item.imdbID}')">Add To Favorites</button>
          </div>
        </div>
      </div>
    `)
    .join("");
}


window.onload = () => {;

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const cardItems = JSON.parse(localStorage.getItem('cardItems')) || []
  if (document.getElementById('favDiv')) {
    displayFavorites(favorites);
  }
  if (document.getElementById('cards-div')) {
    displayCards(cardItems);
  }
  const selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));

  if (!selectedMovie) {
    console.error("No movie data found in localStorage.");
    return;
  }

  const detailsDiv = document.getElementById('movieDetails');
  if (!detailsDiv) {
    return;
  }

  movieDetails(selectedMovie);
};
