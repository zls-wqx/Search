let currentPage = 1;
const resultsPerPage = 10;

async function performSearch(page = 1) {
    const query = document.getElementById('search-query').value.trim();
    if (!query) {
        alert('Please enter a search query');
        return;
    }

    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data, page);
    } catch (error) {
        console.error('Error fetching search results:', error);
        alert('An error occurred while fetching search results.');
    }
}

function displayResults(data, page) {
    const resultsContainer = document.getElementById('results');
    const paginationContainer = document.getElementById('pagination');
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        const start = (page - 1) * resultsPerPage;
        const end = start + resultsPerPage;
        const resultsToShow = data.RelatedTopics.slice(start, end);

        resultsToShow.forEach(item => {
            if (item.Text && item.FirstURL) {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <a href="${item.FirstURL}" target="_blank">${item.Text}</a>
                    <div class="snippet">${item.Result || ''}</div>
                `;
                resultsContainer.appendChild(resultItem);
            }
        });

        // Pagination buttons
        const totalPages = Math.ceil(data.RelatedTopics.length / resultsPerPage);
        if (totalPages > 1) {
            if (page > 1) {
                const prevButton = document.createElement('button');
                prevButton.innerText = 'Previous';
                prevButton.onclick = () => performSearch(page - 1);
                paginationContainer.appendChild(prevButton);
            }

            if (page < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.innerText = 'Next';
                nextButton.onclick = () => performSearch(page + 1);
                paginationContainer.appendChild(nextButton);
            }
        }
    } else {
        resultsContainer.innerHTML = '<p>No results found</p>';
    }
}
