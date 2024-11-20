document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const backToTopButton = document.getElementById('back-to-top');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    fetch('google-books-book.json')
        .then(response => response.json())
        .then(data => {
            const singleBook = `
                <h4>${data.volumeInfo.title}</h4>
                <p>Author: ${data.volumeInfo.authors.join(', ')}</p>
                <p>Description: ${data.volumeInfo.description}</p>
                <a href="${data.volumeInfo.previewLink}" target="_blank">Read More</a>
            `;
            document.getElementById('single-book').innerHTML = singleBook;
        });

    fetch('google-books-search.json')
        .then(response => response.json())
        .then(data => {
            let books = data.items.map(book => `
                <div class="book">
                    <h4>${book.volumeInfo.title}</h4>
                    <p>Author: ${book.volumeInfo.authors.join(', ')}</p>
                    <a href="${book.volumeInfo.previewLink}" target="_blank">Read More</a>
                </div>
            `).join('');
            document.getElementById('multiple-books').innerHTML = books;
        });

    fetch('openlibrary-book.json')
        .then(response => response.json())
        .then(data => {
            const bonusBook = `
                <h4>${data['ISBN:0201558025'].title}</h4>
                <p>Author: ${data['ISBN:0201558025'].authors.map(author => author.name).join(', ')}</p>
            `;
            document.getElementById('bonus').innerHTML = bonusBook;
        });
});
