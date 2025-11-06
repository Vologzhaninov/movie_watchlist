const movieMain = document.getElementById('movie-main')
let movieWatchList = JSON.parse(localStorage.getItem('movieWatchList')) || []

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

function renderWatchList() {
    let html = ''
    for (let movie of movieWatchList) {   
        html += `
            <div class="movie-card">
                <img class="poster-img" src="${movie.Poster}" alt="Movie Poster" />
                <div class="movie-info">
                    <h2>${movie.Title}
                        <span>${movie.Year}</span>
                        <span>
                            <img class="rating-icon" src="images/rating.png" alt="Star icon" />
                            ${movie.imdbRating}
                        </span>
                    </h2>
                    <p>${movie.Runtime}
                        <span>${movie.Genre}</span>
                        <span>
                            <img class="remove-icon" id="${movie.imdbID}" src="images/remove.png" alt="Remove film icon" />
                            Remove
                        </span>
                    </p> 
                    ${createReadMoreBlock(movie.Plot)}
                </div>
            </div>
        `
    }
    movieMain.innerHTML = html
}

movieMain.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-icon')) {
        const movieID = event.target.id
        let index = movieWatchList.findIndex(movie => movie.imdbID === movieID)
        if (index !== -1) {
            movieWatchList.splice(index, 1)
            localStorage.setItem('movieWatchList', JSON.stringify(movieWatchList))
        }
        renderWatchList()           
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

renderWatchList()