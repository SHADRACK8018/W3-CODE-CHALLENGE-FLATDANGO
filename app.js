document.addEventListener('DOMContentLoaded', () => {
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    const buyTicketButton = document.getElementById('buy-ticket');
    const filmsList = document.getElementById('films');

    fetchMovieDetails(1);
    fetchMoviesList();

    function fetchMovieDetails(movieId) {
        fetch(`http://localhost:3000/films/${movieId}`)
            .then(response => response.json())
            .then(film => {
                poster.src = film.poster;
                title.textContent = film.title;
                runtime.textContent = `Runtime: ${film.runtime} minutes`;
                showtime.textContent = `Showtime: ${film.showtime}`;
                availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
                buyTicketButton.textContent = 'Buy Ticket';
                buyTicketButton.disabled = film.tickets_sold >= film.capacity;
                buyTicketButton.removeEventListener('click', handleBuyTicket);
                buyTicketButton.addEventListener('click', () => handleBuyTicket(film));
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    function fetchMoviesList() {
        fetch('http://localhost:3000/films')
            .then(response => response.json())
            .then(films => {
                filmsList.innerHTML = '';
                films.forEach(film => {
                    const filmItem = document.createElement('li');
                    filmItem.textContent = film.title;
                    filmItem.classList.add('film', 'item');
                    filmItem.setAttribute('data-id', film.id);
                    filmItem.addEventListener('click', () => fetchMovieDetails(film.id));
                    filmsList.appendChild(filmItem);
                });
            })
            .catch(error => console.error('Error fetching movies list:', error));
    }

    function handleBuyTicket(film) {
        if (film.tickets_sold < film.capacity) {
            film.tickets_sold++;
            availableTickets.textContent = `Available Tickets: ${film.capacity - film.tickets_sold}`;
            fetch(`http://localhost:3000/films/${film.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickets_sold: film.tickets_sold }),
            }).catch(error => console.error('Error updating tickets sold:', error));
            if (film.tickets_sold >= film.capacity) {
                buyTicketButton.textContent = 'Sold Out';
                buyTicketButton.disabled = true;
                const filmItem = document.querySelector(`li[data-id='${film.id}']`);
                if (filmItem) {
                    filmItem.classList.add('sold-out');
                }
            }
        }
    }
});