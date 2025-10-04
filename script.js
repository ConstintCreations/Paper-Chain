let coinData;
let historyData = {};
let currentCoins;
let selectedCoin = null;

async function fetchCoinData(codes = ['BTC', 'ETH', 'XRP']) {
    try {
        const response = await fetch('/api/coins?codes=' + codes.join(','));
        const data = await response.json();
        coinData = data;
    } catch (error) {
        
    }
}

async function fetchCoinHistory(code = 'BTC') {
    try {
        const response = await fetch('/api/coin/history?code=' + code);
        const data = await response.json();
        historyData[code] = data;
        console.log(historyData);
    } catch (error) {
        
    }
}


/*fetchCoinHistory('BTC').then(data => {
    if (data) {
        console.log('Coin History:', data);
    }
});*/


/*fetchCoinData('BTC').then(data => {
    if (data) {
        console.log('Coin Data:', data);
    }
});*/

loadData();

function saveCoinData() {
    localStorage.setItem('coinData', JSON.stringify(coinData));
}

function saveHistoryData() {
    if (historyData) {
        localStorage.setItem('historyData', JSON.stringify(historyData));
    }
}

function saveCurrentCoins() {
    localStorage.setItem('currentCoins', JSON.stringify(currentCoins));
}

async function loadData() {
    const sidebarCoins = localStorage.getItem('currentCoins');
    const coin = localStorage.getItem('coinData');
    const history = localStorage.getItem('historyData');
    if (!sidebarCoins) {
        currentCoins = ['BTC', 'ETH', 'XRP'];
        saveCurrentCoins();
    } else {
        currentCoins = JSON.parse(sidebarCoins);
    }
    if (!coin) {
        await fetchCoinData(currentCoins);
        saveCoinData();
    } else {
        coinData = JSON.parse(coin);
    }
    if (!history) {
        historyData = {};
    } else {
        historyData = JSON.parse(history);
    }
    console.log(coinData);
    console.log(historyData);
    loadSidebar();
}

async function loadSidebar() {
    const sidebarCoins = document.querySelector('.sidebar-coins');
    sidebarCoins.querySelectorAll('.sidebar-item').forEach(el => el.remove());
    if (currentCoins.length > 0) {

        currentCoins.forEach(cCoin => {
            let coin = coinData.find(c => c.code === cCoin);
            const coinElement = document.createElement('div');
            coinElement.classList.add('sidebar-item');
            coinElement.dataset.code = coin.code;
            coinElement.innerHTML = `
                <div class="item-main-info">
                    <img src="${coin.png32}" alt="${coin.symbol ? coin.symbol : ""}" class="item-logo">
                    <h2 class="item-name">${coin.name} (${coin.code.replace(/_/g, '')})</h2>
                </div>
                <div class="item-price-info">
                    <p class="item-price">${coin.rate.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} PC</p>
                    <div class="item-change ${coin.delta.day >= 1 ? 'positive' : 'negative'}">
                        <i class="fa-solid ${coin.delta.day >= 1 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
                        <div class="change-amount">${coin.delta.day >= 1 ? '+' : ''}${((coin.delta.day-1)*100).toFixed(2)}%</div>
                        <div class="change-interval">(1d)</div>
                    </div>
                </div>
            `;

            sidebarCoins.appendChild(coinElement);

            coinElement.addEventListener('click', () => {
                toggleSelected(coinElement, coin.code);
            });
        });
        
    }
}

const coinContent = document.querySelector('.coin-content');
const portfolioContent = document.querySelector('.portfolio-content');

function toggleSelected(element, code = null) {
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.toggle('selected');

    coinContent.classList.add('active');
    portfolioContent.classList.remove('active');
    if (code) {
        selectedCoin = code;
    
        if (Object.keys(historyData).includes(code)) {
            updateChart(true);
            updateChart();
        } else {
            fetchCoinHistory(code).then(() => {
                saveHistoryData();
                updateChart();
            });
        }
    }
}

const portfolioButton = document.querySelector('.sidebar-portfolio');

portfolioButton.addEventListener('click', () => {
    toggleSelected(portfolioButton);
    coinContent.classList.remove('active');
    portfolioContent.classList.add('active');
});

const addCoinButton = document.querySelector('.add-coin-button');
const addCoinModal = document.querySelector('.add-coin-modal');
const closeModalButton = document.querySelector('.close-modal-button');

addCoinButton.addEventListener('click', () => {
    addCoinModal.style.display = 'block';
});

fetch('/coins.json').then(response => response.json()).then(data => {
    const coinResultsContainer = document.querySelector('.coin-results');
    data.forEach(coin => {
        const coinElement = document.createElement('div');
        coinElement.classList.add('coin-result');
        coinElement.dataset.code = coin.code;
        if (currentCoins.includes(coin.code)) {
            coinElement.classList.add('selected');
        }
        coinElement.innerHTML = `
            <img src="${coin.png32}" alt="${coin.symbol ? coin.symbol : ""}" class="coin-logo">
            <h2 class="coin-name">${coin.name} (${coin.code.replace(/_/g, '')})</h2>
        `;

        coinResultsContainer.appendChild(coinElement);

        coinElement.addEventListener('click', () => {
            coinElement.classList.toggle('selected');
        });
    });
});

const searchInput = document.querySelector('.coin-search');
searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll('.coin-result').forEach(coinElement => {
        const coinName = coinElement.querySelector('.coin-name').textContent.toLowerCase();
        if (coinName.includes(filter)) {
            coinElement.style.display = '';
        } else {
            coinElement.style.display = 'none';
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        localStorage.clear();
        location.reload();
    }
});

closeModalButton.addEventListener('click', () => {
    addCoinModal.style.display = 'none';
    const selectedCoins = [];
    document.querySelectorAll('.coin-result.selected').forEach(coinElement => {
        const code = coinElement.dataset.code;
        selectedCoins.push(code);
    });

    if (JSON.stringify(selectedCoins) !== JSON.stringify(currentCoins)) {
        currentCoins = selectedCoins;
        saveCurrentCoins();
        const foundAllCoins = currentCoins.every(code => coinData.find(c => c.code === code));
        if (foundAllCoins) {
            loadSidebar();
        } else {
            fetchCoinData(currentCoins).then(() => {
                saveCoinData();
                loadSidebar();
            });
        }
    }
});

const coinActionInput = document.querySelector('.action-input');
const coinActionAmount = document.querySelector('.action-amount');

coinActionInput.addEventListener('input', () => {
    const amount = parseFloat(parseFloat(coinActionInput.value).toFixed(4) * coinPrice);
    if (!isNaN(amount)) {
        coinActionAmount.textContent = `${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} PC`;
    } else {
        coinActionAmount.textContent = '0.00 PC';
    }
});

coinActionInput.addEventListener('blur', () => {
    coinActionInput.value = Number(parseFloat(coinActionInput.value).toFixed(4));
});

const coinChart = document.querySelector('.coin-chart').getContext('2d');

let chart = null;

async function updateChart(empty = false) {
    if (!chart) {
        chart = new Chart(coinChart, {
            type: 'line',
            data: {
                labels: historyData[selectedCoin].history.map(entry => 
                    new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                ),
                datasets: [{
                    label: 'Price (PC)',
                    data: historyData[selectedCoin].history.map(entry => entry.rate.toFixed(2)),
                    borderColor: '#7f60e6ff',
                    backgroundColor: '#9f88e866',
                    fill: true,
                    tension: 0.2
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: false,
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + " PC";
                            },
                            autoSkip: true,
                            maxTicksLimit: 4
                        },
                        grid : {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.update();
    if (empty) {
        return;
    } else {
        chart.data.labels = historyData[selectedCoin].history.map(entry => 
            new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        );
        chart.data.datasets[0].data = historyData[selectedCoin].history.map(entry => entry.rate.toFixed(2));

        chart.update();
    }
    
}