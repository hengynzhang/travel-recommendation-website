const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');
const searchResults = document.getElementById('search-results');

const search = () => {
    fetch('../travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const matchedResults = [];
        const searchKeywords = searchInput.value.toLowerCase().split(' ');

        data.countries.forEach(country => {
            country.cities.forEach(city => {
                const cityName = city.name.toLowerCase();
                const cityDescription = city.description.toLowerCase();

                const containsKeywords = searchKeywords.some(keyword => {
                    return cityName.includes(keyword) || cityDescription.includes(keyword);
                });

                if (containsKeywords) {
                    matchedResults.push({
                        imgUrl: city.imageUrl,
                        name: city.name,
                        description: city.description
                    });
                }
            });
        });
        resultDisplay(matchedResults);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

const resultDisplay = (matchedResults) => {
    searchResults.classList.remove('hidden');
    if (matchedResults.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
        return;
    }

    searchResults.innerHTML = '';
    matchedResults.forEach(item => {
        const result = document.createElement('div');
        result.innerHTML = `
            <h3>${item.name}</h3>
            <img src=${item.imgUrl} alt=${item.name}>
            <p>${item.description}</p>
            <button>View</button>
        `;
        searchResults.appendChild(result);
    });
};

searchButton.addEventListener('click', search);
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.classList.add('hidden');
});

