let coinData;
let historyData = {};
let currentCoins;
let selectedCoin = null;
let balance = 100000.00;
let lastAccessedCoinData;
let lastAccessedCoinHistory = {};
let transactions = [];
let portfolio = {};

async function fetchCoinData(codes = ['BTC', 'ETH', 'XRP']) {
    lastAccessedCoinData = Date.now();
    try {
        const response = await fetch('/api/coins?codes=' + codes.join(','));
        const data = await response.json();
        coinData = data;
    } catch (error) {
        
    }
}

async function fetchCoinHistory(code = 'BTC') {
    lastAccessedCoinHistory[code] = Date.now();
    console.log(lastAccessedCoinHistory);
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

function savePortfolioStuff() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

function loadPortfolioStuff() {
    const savedBalance = localStorage.getItem('balance');
    const savedTransactions = localStorage.getItem('transactions');
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedBalance) {
        balance = parseFloat(savedBalance);
    }
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
    if (savedPortfolio) {
        portfolio = JSON.parse(savedPortfolio);
    }
}

function saveCoinData() {
    localStorage.setItem('coinData', JSON.stringify(coinData));
    localStorage.setItem('lastAccessedCoinData', lastAccessedCoinData);
}

function saveHistoryData() {
    if (historyData) {
        localStorage.setItem('historyData', JSON.stringify(historyData));
        localStorage.setItem('lastAccessedCoinHistory', JSON.stringify(lastAccessedCoinHistory));
    }
}

function saveCurrentCoins() {
    localStorage.setItem('currentCoins', JSON.stringify(currentCoins));
}

async function loadData() {
    const sidebarCoins = localStorage.getItem('currentCoins');
    const coin = localStorage.getItem('coinData');
    const lastAccessCoin = localStorage.getItem('lastAccessedCoinData');
    const lastAccessHistory = localStorage.getItem('lastAccessedCoinHistory');
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
        lastAccessedCoinData = parseInt(lastAccessCoin);
        if (Date.now() - lastAccessedCoinData > 15 * 60 * 1000) {
            await fetchCoinData(currentCoins);
            saveCoinData();
        } else {
            coinData = JSON.parse(coin);
        }
    }
    if (!history) {
        historyData = {};
        lastAccessedCoinHistory = {};
    } else {
        historyData = JSON.parse(history);
        lastAccessedCoinHistory = lastAccessHistory ? JSON.parse(lastAccessHistory) : {};
    }
    loadPortfolioStuff();
    loadSidebar();
}

async function loadSidebar() {
    const sidebarCoins = document.querySelector('.sidebar-coins');
    sidebarCoins.querySelectorAll('.sidebar-item').forEach(el => el.remove());
    if (currentCoins.length > 0) {
        if (lastAccessedCoinData && Date.now() - lastAccessedCoinData > 15 * 60 * 1000) {
            await fetchCoinData(currentCoins);
            saveCoinData();
        }
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

    const balanceElement = document.querySelector('.balance');
    balanceElement.textContent = `${balance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} PC`;
    const portfolioChangeElement = document.querySelector('.portfolio-change');

    if (transactions.length > 0) {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        let valuationOneDayAgo = null; 
        transactions.forEach((transaction, index) => {
            if (transaction.date < oneDayAgo && index === 0) {
                valuationOneDayAgo = transaction.totalValuation;
            }
        });
        if (!valuationOneDayAgo) {
            const oldestTransaction = transactions.reduce((oldest, transaction) => {
                return transaction.date < oldest.date ? transaction : oldest;
            }, transactions[0]);
            valuationOneDayAgo = oldestTransaction.totalValuation;
        }
        if (valuationOneDayAgo && portfolio.valuation) {
            const change = ((portfolio.valuation - valuationOneDayAgo) / valuationOneDayAgo) * 100;
            portfolioChangeElement.classList.remove('positive', 'negative');
            portfolioChangeElement.classList.add(change >= 0 ? 'positive' : 'negative');
            portfolioChangeElement.innerHTML = `
                <i class="fa-solid ${change >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
                <div class="change-amount">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>
                <div class="change-interval">(1d)</div>
            `;
        }
    }
    
}

const coinContent = document.querySelector('.coin-content');
const portfolioContent = document.querySelector('.portfolio-content');

const coinTitleElement = document.querySelector('.content-title');

const coinChangeHourElement = document.querySelector('.hour-title'); 
const coinChangeDayElement = document.querySelector('.day-title');
const coinChangeWeekElement = document.querySelector('.week-title');
const coinChangeMonthElement = document.querySelector('.month-title');
const coinChangeQuarterElement = document.querySelector('.quarter-title');
const coinChangeYearElement = document.querySelector('.year-title');

const coinPriceElement = document.querySelector('.coin-price');
const coinMarketCapElement = document.querySelector('.market-cap');

const coinActionInput = document.querySelector('.action-input');
const coinActionAmount = document.querySelector('.action-amount');

async function toggleSelected(element, code = null) {
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.toggle('selected');

    coinContent.classList.add('active');
    portfolioContent.classList.remove('active');
    if (code) {
        selectedCoin = code;
        if (lastAccessedCoinData && Date.now() - lastAccessedCoinData > 15 * 60 * 1000) {
            await fetchCoinData(currentCoins);
            saveCoinData();
        }
        const coin = coinData.find(c => c.code === code);
        const price = parseFloat(coin.rate).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const marketCap = parseFloat(coin.cap).toLocaleString("en-US", {});

        const changeHour = coin.delta.hour ? ((coin.delta.hour - 1) * 100).toFixed(2) : 'N/A';
        const changeDay = coin.delta.day ? ((coin.delta.day - 1) * 100).toFixed(2) : 'N/A';
        const changeWeek = coin.delta.week ? ((coin.delta.week - 1) * 100).toFixed(2) : 'N/A';
        const changeMonth = coin.delta.month ? ((coin.delta.month - 1) * 100).toFixed(2) : 'N/A';
        const changeQuarter = coin.delta.quarter ? ((coin.delta.quarter - 1) * 100).toFixed(2) : 'N/A';
        const changeYear = coin.delta.year ? ((coin.delta.year - 1) * 100).toFixed(2) : 'N/A';

        coinTitleElement.innerHTML = `<h1>${coin.name} (${coin.code.replace(/_/g, '')}) - <span class="coin-info-item day ${changeDay >= 0 ? 'up' : 'down'}">${changeDay >= 0 ? '+' : ''}${changeDay}%</span></h1>`;
        coinPriceElement.textContent = `${price} PC`;
        coinMarketCapElement.textContent = `${marketCap} PC`;
        if (changeHour === 'N/A') {
            coinChangeHourElement.classList.add('hide');
        } else {
            coinChangeHourElement.classList.remove('hide');
        }
        if (changeDay === 'N/A') {
            coinChangeDayElement.classList.add('hide');
        } else {
            coinChangeDayElement.classList.remove('hide');
        }
        if (changeWeek === 'N/A') {
            coinChangeWeekElement.classList.add('hide');
        } else {
            coinChangeWeekElement.classList.remove('hide');
        }
        if (changeMonth === 'N/A') {
            coinChangeMonthElement.classList.add('hide');
        } else {
            coinChangeMonthElement.classList.remove('hide');
        }
        if (changeQuarter === 'N/A') {
            coinChangeQuarterElement.classList.add('hide');
        } else {
            coinChangeQuarterElement.classList.remove('hide');
        }
        if (changeYear === 'N/A') {
            coinChangeYearElement.classList.add('hide');
        } else {
            coinChangeYearElement.classList.remove('hide');
        }
        coinChangeHourElement.innerHTML = `Hour: <span class="${changeHour >= 0 ? 'up' : 'down'}">${changeHour >= 0 ? '+' : ''}${changeHour}%</span>`;
        coinChangeDayElement.innerHTML = `Day: <span class="${changeDay >= 0 ? 'up' : 'down'}">${changeDay >= 0 ? '+' : ''}${changeDay}%</span>`;
        coinChangeWeekElement.innerHTML = `Week: <span class="${changeWeek >= 0 ? 'up' : 'down'}">${changeWeek >= 0 ? '+' : ''}${changeWeek}%</span>`;
        coinChangeMonthElement.innerHTML = `Month: <span class="${changeMonth >= 0 ? 'up' : 'down'}">${changeMonth >= 0 ? '+' : ''}${changeMonth}%</span>`;
        coinChangeQuarterElement.innerHTML = `Qtr: <span class="${changeQuarter >= 0 ? 'up' : 'down'}">${changeQuarter >= 0 ? '+' : ''}${changeQuarter}%</span>`;
        coinChangeYearElement.innerHTML = `Year: <span class="${changeYear >= 0 ? 'up' : 'down'}">${changeYear >= 0 ? '+' : ''}${changeYear}%</span>`;
        
        coinActionInput.value = 0;
        coinActionAmount.textContent = '0.00 PC';

        if (Object.keys(historyData).includes(code) && lastAccessedCoinHistory && lastAccessedCoinHistory[code] && (Date.now() - lastAccessedCoinHistory[code] < 15 * 60 * 1000)) {
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

coinActionInput.addEventListener('input', () => {
    const amount = parseFloat(parseFloat(coinActionInput.value).toFixed(4) * parseFloat(coinData.find(c => c.code === selectedCoin).rate).toFixed(2));
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

const buyButton = document.querySelector('.buy-coin-button');
const sellButton = document.querySelector('.sell-coin-button');

buyButton.addEventListener('click', () => {
    const amount = parseFloat(parseFloat(coinActionInput.value).toFixed(4));
    const price = parseFloat(coinData.find(c => c.code === selectedCoin).rate).toFixed(2);
    let totalCost = 0;
    if (!isNaN(amount) && amount > 0) {
        totalCost = parseFloat((amount * price).toFixed(2));
    }
    if (totalCost > 0 && totalCost <= balance) {
        balance -= totalCost;
        let transaction = {
            type: 'buy',
            code: selectedCoin,
            amount: amount,
            price: price,
            totalCost: totalCost,
            totalValuation: portfolio.valuation ? portfolio.valuation : 100000,
            date: Date.now()
        };
        transactions.push(transaction);

        if (Object.keys(portfolio).length === 0) {
            portfolio = {
                coins: {
                    [selectedCoin]: { amount: amount, cost: totalCost }
                },
                valuation: 100000
            }
        } else {
            if (Object.keys(portfolio.coins).includes(selectedCoin)) {
                let existingAmount = portfolio.coins[selectedCoin].amount;
                let existingCost = portfolio.coins[selectedCoin].cost;
                portfolio.coins[selectedCoin].amount = parseFloat((existingAmount + amount).toFixed(4));
                portfolio.coins[selectedCoin].cost = parseFloat((existingCost + totalCost).toFixed(2));
            } else {
                portfolio.coins[selectedCoin] = { amount: amount, cost: totalCost };
            }
        }
    }    
    savePortfolioStuff();
    coinActionInput.value = 0;
    coinActionAmount.textContent = '0.00 PC';
    loadSidebar();
});


sellButton.addEventListener('click', () => {
    const amount = parseFloat(parseFloat(coinActionInput.value).toFixed(4));
    const price = parseFloat(coinData.find(c => c.code === selectedCoin).rate).toFixed(2);
    let totalGain = 0;
    if (!isNaN(amount) && amount > 0) {
        totalGain = parseFloat((amount * price).toFixed(2));
    }
    if (totalGain > 0 && Object.keys(portfolio).length > 0 && Object.keys(portfolio.coins).includes(selectedCoin) && amount <= portfolio.coins[selectedCoin].amount) {
        balance += totalGain;
        let transaction = {
            type: 'sell',
            code: selectedCoin,
            amount: amount,
            price: price,
            totalGain: totalGain,
            totalValuation: portfolio.valuation ? portfolio.valuation : 100000,
            date: Date.now()
        };
        transactions.push(transaction);
        let existingAmount = portfolio.coins[selectedCoin].amount;
        let existingCost = portfolio.coins[selectedCoin].cost;
        portfolio.coins[selectedCoin].amount = parseFloat((existingAmount - amount).toFixed(4));
        if (portfolio.coins[selectedCoin].amount === 0) {
            delete portfolio.coins[selectedCoin];
        }
        let costPerCoin = existingCost / existingAmount;
        let costReduction = parseFloat((costPerCoin * amount).toFixed(2));
        portfolio.coins[selectedCoin].cost = parseFloat((existingCost - costReduction).toFixed(2));
    }
    savePortfolioStuff();
    coinActionInput.value = 0;
    coinActionAmount.textContent = '0.00 PC';
    loadSidebar();
});

setInterval(() => {
    fetchCoinData(currentCoins).then(() => {
        saveCoinData();
        loadSidebar();
    });
}, 15000);