const url = 'http://www.omdbapi.com/?apikey='
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const movieMain = document.getElementById('movie-main')
const modalBox = document.getElementById('modal-box')
const modalInput = document.getElementById('modal-input')
const modalBtn = document.getElementById('modal-btn')
let apiKey = localStorage.getItem('omdbAPIkey') || ''
let movieWatchList = JSON.parse(localStorage.getItem('movieWatchList')) || []

modalBtn.addEventListener('click', () => {
    const inputKey = modalInput.value.trim()
    if (inputKey) {
        apiKey = inputKey
        localStorage.setItem('omdbAPIkey', inputKey)
    }
    window.location.reload()   
})

window.addEventListener('click', (event) => {
    if (event.target === modalBox) {
        modalBox.style.display = 'none'
    }
})

function createReadMoreBlock(text) {
    const limit = 300
      if (text.length <= limit) {
        return `<p class="plot-text">${text}</p>` // no button if text is short
      }

      const visible = text.substring(0, limit)
      const hidden = text.substring(limit)

      return `
        <p class="plot-text">
          ${visible}<span class="dots">...</span><span class="more-text" hidden>${hidden}</span>
          <button class="read-more-btn" aria-expanded="false">Read more</button>
        </p>
      `
    }

function getMovieSearchList() {
    const movieTitle = searchInput.value.trim()
    fetch(url + `${apiKey}&type=movie&s=` + movieTitle)
        .then(resSearch => resSearch.json())
        .then(dataSearch => {
            //console.log('Movie search list data:', dataSearch.Search) // Debugging line
            if (dataSearch.Response === 'False') {
                searchInput.placeholder = 'Searching something with no data'
                movieMain.innerHTML = `<p class="error-msg">
                    Unable to find what you're looking for. 
                    Please try another search.</p>`
                return
            } else { 
                let html = ''
                for (let movie of dataSearch.Search) {
                    fetch(url + `${apiKey}&type=movie&plot=full&i=` + movie.imdbID)
                        .then(resMovie => resMovie.json())
                        .then(dataMovie => {
                            //console.log('Movie data:', dataMovie) // Debugging line
                            html += `
            <div class="movie-card">
                <img class="poster-img" src="${dataMovie.Poster}" alt="Movie Poster" />
                <div class="movie-info">
                    <h2>${dataMovie.Title}
                        <span>${dataMovie.Year}</span>
                        <span>
                            <img class="rating-icon" src="images/rating.png" alt="Star icon" />
                            ${dataMovie.imdbRating}
                        </span>
                    </h2>
                    <p>${dataMovie.Runtime}
                        <span>${dataMovie.Genre}</span>
                        <span>
                            <img class="add-icon" id="${dataMovie.imdbID}" src="images/add.png" alt="Add film icon" />
                            Watchlist
                        </span>
                    </p> 
                    ${createReadMoreBlock(dataMovie.Plot)}
                </div>
            </div>
            `
            movieMain.innerHTML = html
                        })
                }
            }
        })
}

searchBtn.addEventListener('click', () => {
    if (!apiKey) {
        modalBox.style.display = 'flex'
        modalInput.focus()
        return
    }
    getMovieSearchList()
})

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-icon')) {
        const movieID = event.target.id
        fetch(url + `${apiKey}&type=movie&plot=full&i=` + movieID)
            .then(response => response.json())
            .then(data => {
                //console.log(data) // Debugging line
                if (data.Response === 'True') {
                    movieWatchList.push(data)
                    localStorage.setItem('movieWatchList', JSON.stringify(movieWatchList))
                    alert('Added to your Watchlist') // feedback
                }
            })
    }
    if (event.target.classList.contains('read-more-btn')) {
        const readMoreBtn = event.target
        const plotText = readMoreBtn.previousElementSibling
        const dots = plotText.previousElementSibling
        
        if (readMoreBtn.getAttribute('aria-expanded') === 'false') {
            plotText.removeAttribute('hidden')
            dots.setAttribute('hidden', '')
            readMoreBtn.setAttribute('aria-expanded', 'true')
            readMoreBtn.textContent = 'Read less'
        } else {
            plotText.setAttribute('hidden', '')
            dots.removeAttribute('hidden')
            readMoreBtn.setAttribute('aria-expanded', 'false')
            readMoreBtn.textContent = 'Read more'
        }
    }
})
