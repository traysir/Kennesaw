$(document).ready(function () {
    let currentBooks = [];
    let searchHistory = [];

    // Search Functionality
    $('#search-button').on('click', function () {
        const query = $('#search-term').val().trim();
        if (!query) {
            alert('Please enter a search term!');
            return;
        }
        updateSearchHistory(query);
        searchBooks(query, 0); // Start with the first page
    });

    function searchBooks(query, startIndex) {
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=10`)
            .done(function (data) {
                if (data.items) {
                    currentBooks = data.items.map(book => ({
                        id: book.id,
                        title: book.volumeInfo.title,
                        authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196?text=No+Image',
                        description: book.volumeInfo.description || 'No description available.',
                    }));
                    renderResults(currentBooks, 'grid');
                    displayPagination(data.totalItems, query);
                } else {
                    $('#search-results').html('<p>No results found.</p>');
                }
            })
            .fail(function () {
                alert('Failed to fetch books. Please try again.');
            });
    }

    function renderResults(books, view) {
        const templateId = view === 'grid' ? '#grid-template' : '#list-template';
        const template = $(templateId).html();
        const rendered = Mustache.render(template, { books });
        $('#search-results').html(rendered);
    }

    $('#toggle-grid').on('click', function () {
        renderResults(currentBooks, 'grid');
    });

    $('#toggle-list').on('click', function () {
        renderResults(currentBooks, 'list');
    });

    function displayPagination(totalItems, query) {
        $('#pagination').empty();
        const pages = Math.min(Math.ceil(totalItems / 10), 5); // Limit to 5 pages
        for (let i = 0; i < pages; i++) {
            const pageButton = $('<button>').text(i + 1);
            pageButton.on('click', () => searchBooks(query, i * 10));
            $('#pagination').append(pageButton);
        }
    }

    function updateSearchHistory(term) {
        if (!searchHistory.includes(term)) {
            searchHistory.push(term);
            $('#history-container').append(`<button class="history-item">${term}</button>`);
        }
    }

    $('#history-container').on('click', '.history-item', function () {
        const term = $(this).text();
        $('#search-term').val(term);
        searchBooks(term, 0);
    });

    function loadPublicBookshelf() {
        $.getJSON('../google-books-search.json', function (data) {
            const books = data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
                thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196?text=No+Image',
                description: book.volumeInfo.description || 'No description available.',
            }));
            const rendered = Mustache.render($('#grid-template').html(), { books });
            $('#public-bookshelf').html(rendered);
        }).fail(function () {
            alert('Failed to load public bookshelf. Please check the JSON file.');
        });
    }

    $('#bookshelf-tab').on('click', function () {
        $('#search-section').hide();
        $('#bookshelf-section').show();
        loadPublicBookshelf();
    });

    $('#search-tab').on('click', function () {
        $('#search-section').show();
        $('#bookshelf-section').hide();
    });
});
console.log('Mustache version:', Mustache);
