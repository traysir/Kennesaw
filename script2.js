document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');

    searchButton.addEventListener('click', function () {
        const query = document.getElementById('search-term').value;
        searchBooks(query);
    });

    function searchBooks(query) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
            .then(response => response.json())
            .then(data => displaySearchResults(data.items));
    }

    function displaySearchResults(books) {
        searchResults.innerHTML = books
            .map(book => `
                <div class="book">
                    <img src="${book.volumeInfo.imageLinks?.thumbnail || ''}" alt="${book.volumeInfo.title}">
                    <h4><a href="book-details.html?id=${book.id}">${book.volumeInfo.title}</a></h4>
                    <p>${book.volumeInfo.authors?.join(', ')}</p>
                </div>
            `)
            .join('');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    if (bookId) {
        fetchBookDetails(bookId);
    }

    function fetchBookDetails(bookId) {
        fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
            .then(response => response.json())
            .then(book => displayBookDetails(book));
    }

    function displayBookDetails(book) {
        const bookDetails = document.getElementById('book-details');
        bookDetails.innerHTML = `
            <h2>${book.volumeInfo.title}</h2>
            <img src="${book.volumeInfo.imageLinks?.thumbnail || ''}" alt="${book.volumeInfo.title}">
            <p>Author: ${book.volumeInfo.authors?.join(', ')}</p>
            <p>${book.volumeInfo.description}</p>
        `;
    }
});
