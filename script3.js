$(document).ready(function () {
    const $searchResults = $('#search-results');
    const $bookDetails = $('#book-details');
    const $pagination = $('#pagination');
    const $publicBookshelf = $('#public-bookshelf');

    // Book search functionality
    $('#search-button').on('click', function () {
        const query = $('#search-term').val();
        searchBooks(query, 0);
    });

    function searchBooks(query, startIndex) {
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=10`,
            method: 'GET',
            success: function (data) {
                displaySearchResults(data.items);
                displayPagination(data.totalItems, query);
            },
            error: function () {
                $searchResults.html('<p>Failed to fetch search results. Please try again later.</p>');
            }
        });
    }

    function displaySearchResults(books) {
        $searchResults.empty();
        books.forEach(book => {
            const thumbnail = book.volumeInfo.imageLinks?.thumbnail || '';
            const bookItem = `
                <div class="book">
                    <img src="${thumbnail}" alt="${book.volumeInfo.title}">
                    <h4><a href="#" data-id="${book.id}">${book.volumeInfo.title}</a></h4>
                    <p>${book.volumeInfo.authors?.join(', ')}</p>
                </div>`;
            $searchResults.append(bookItem);
        });

        $searchResults.find('a').on('click', function (e) {
            e.preventDefault();
            fetchBookDetails($(this).data('id'));
        });
    }

    function displayPagination(totalItems, query) {
        $pagination.empty();
        const pages = Math.min(Math.ceil(totalItems / 10), 5); // Limit to 5 pages

        for (let i = 0; i < pages; i++) {
            const pageButton = $('<button>').text(i + 1);
            pageButton.on('click', () => searchBooks(query, i * 10));
            $pagination.append(pageButton);
        }
    }

    function fetchBookDetails(bookId) {
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes/${bookId}`,
            method: 'GET',
            success: function (book) {
                const thumbnail = book.volumeInfo.imageLinks?.thumbnail || '';
                const bookDetail = `
                    <h2>${book.volumeInfo.title}</h2>
                    <img src="${thumbnail}" alt="${book.volumeInfo.title}">
                    <p>Author: ${book.volumeInfo.authors?.join(', ')}</p>
                    <p>${book.volumeInfo.description}</p>`;
                $bookDetails.html(bookDetail);
            },
            error: function () {
                $bookDetails.html('<p>Failed to load book details. Please try again later.</p>');
            }
        });
    }

    // Public bookshelf functionality
    function loadPublicBookshelf() {
        const userId = '110435800110781190850'; 
        const shelfId = '1001';

        $.ajax({
            url: `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${shelfId}/volumes`,
            method: 'GET',
            success: function (data) {
                if (data.items) {
                    displayBookshelf(data.items);
                } else {
                    $publicBookshelf.html('<p>No books found in this bookshelf.</p>');
                }
            },
            error: function () {
                $publicBookshelf.html('<p>Failed to load public bookshelf. Please try again later.</p>');
            }
        });
    }

    function displayBookshelf(books) {
        $publicBookshelf.empty();
        books.forEach(book => {
            const thumbnail = book.volumeInfo.imageLinks?.thumbnail || '';
            const bookItem = `
                <div class="book">
                    <img src="${thumbnail}" alt="${book.volumeInfo.title}">
                    <h4>${book.volumeInfo.title}</h4>
                    <p>${book.volumeInfo.authors?.join(', ')}</p>
                </div>`;
            $publicBookshelf.append(bookItem);
        });
    }

    loadPublicBookshelf();

    $('#current-year').text(new Date().getFullYear());
});
