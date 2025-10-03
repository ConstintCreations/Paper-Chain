async function fetchCoinData(codes = ['BTC', 'ETH', 'XRP']) {
    /*try {
        const response = await fetch('/api/coin?symbol=' + codes.join(','));
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }*/

    return [
  {
    "name": "Bitcoin",
    "symbol": "₿",
    "rank": 1,
    "age": 6117,
    "color": "#fa9e32",
    "png32": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/btc.png",
    "png64": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/btc.png",
    "webp32": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/btc.webp",
    "webp64": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/btc.webp",
    "exchanges": 164,
    "markets": 1534,
    "pairs": 468,
    "categories": [],
    "allTimeHighUSD": 124169.3844452126,
    "circulatingSupply": 19928203,
    "totalSupply": 19928203,
    "maxSupply": 21000000,
    "links": {
      "website": "https://bitcoin.org",
      "whitepaper": "https://bitcoin.org/bitcoin.pdf",
      "twitter": null,
      "reddit": "https://reddit.com/r/bitcoin",
      "telegram": null,
      "discord": null,
      "medium": null,
      "instagram": null,
      "tiktok": null,
      "youtube": null,
      "linkedin": null,
      "twitch": null,
      "spotify": null,
      "naver": null,
      "wechat": null,
      "soundcloud": null
    },
    "code": "BTC",
    "rate": 120361.96212658589,
    "volume": 61836701177,
    "cap": 2398597614736,
    "delta": {
      "hour": 0.9979,
      "day": 1.0115,
      "week": 1.1004,
      "month": 1.0787,
      "quarter": 1.1122,
      "year": 1.9806
    }
  },
  {
    "name": "Ethereum",
    "symbol": "Ξ",
    "rank": 2,
    "age": 3709,
    "color": "#2f2f2f",
    "png32": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/eth.png",
    "png64": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/eth.png",
    "webp32": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/eth.webp",
    "webp64": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/eth.webp",
    "exchanges": 348,
    "markets": 6380,
    "pairs": 3633,
    "allTimeHighUSD": 4942.492362954442,
    "circulatingSupply": 117762924,
    "totalSupply": 117762924,
    "maxSupply": null,
    "links": {
      "website": "https://ethereum.org/en/",
      "whitepaper": "https://ethereum.org/en/whitepaper",
      "twitter": "https://x.com/ethereum",
      "reddit": "https://reddit.com/r/ethereum",
      "telegram": null,
      "discord": "https://discord.com/invite/ethereum-org",
      "medium": null,
      "instagram": null,
      "tiktok": null,
      "youtube": null,
      "linkedin": null,
      "twitch": null,
      "spotify": null,
      "naver": null,
      "wechat": null,
      "soundcloud": null
    },
    "code": "ETH",
    "rate": 4475.328398782301,
    "volume": 43634973445,
    "cap": 527027758100,
    "delta": {
      "hour": 0.9999,
      "day": 1.0273,
      "week": 1.1476,
      "month": 1.0363,
      "quarter": 1.7775,
      "year": 1.8966
    }
  },
  {
    "name": "XRP",
    "rank": 3,
    "age": 4442,
    "color": "#242c2c",
    "png32": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/xrp.png",
    "png64": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/xrp.png",
    "webp32": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/xrp.webp",
    "webp64": "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/xrp.webp",
    "exchanges": 119,
    "markets": 358,
    "pairs": 157,
    "categories": [
      "smart_contract_platforms"
    ],
    "allTimeHighUSD": 3.91546307780967,
    "circulatingSupply": 59871700035,
    "totalSupply": 99985791876,
    "maxSupply": 100000000000,
    "links": {
      "website": "https://ripple.com/",
      "whitepaper": "https://ripple.com/files/ripple_consensus_whitepaper.pdf",
      "twitter": "https://x.com/Ripple",
      "reddit": "https://reddit.com/r/ripple",
      "telegram": "https://t.me/Ripple",
      "discord": null,
      "medium": null,
      "instagram": null,
      "tiktok": null,
      "youtube": "https://www.youtube.com/@ripple",
      "linkedin": "https://www.linkedin.com/company/rippleofficial/",
      "twitch": null,
      "spotify": null,
      "naver": null,
      "wechat": null,
      "soundcloud": null
    },
    "code": "XRP",
    "rate": 3.030153689463152,
    "volume": 5249321666,
    "cap": 181420452755,
    "delta": {
      "hour": 0.9986,
      "day": 1.0252,
      "week": 1.0975,
      "month": 1.0622,
      "quarter": 1.3646,
      "year": 5.7503
    }
  }
]
}

/*fetchCoinData('BTC').then(data => {
    if (data) {
        console.log('Coin Data:', data);
    }
});*/

const coinCodes = loadCoinCodes();
saveCoinCodes(coinCodes);

function saveCoinCodes(codes) {
    localStorage.setItem('coinCodes', JSON.stringify(codes));
    loadSidebar();
}

function loadCoinCodes() {
    const codes = localStorage.getItem('coinCodes');
    return codes ? JSON.parse(codes) : ['BTC', 'ETH', 'XRP'];
}

function saveCoinData(data) {

}

function loadCoinData(codes) {

}

function loadSidebar() {
    const sidebarCoins = document.querySelector('.sidebar-coins');
    sidebarCoins.querySelectorAll('.sidebar-item').forEach(el => el.remove());
    if (coinCodes.length > 0) {
        fetchCoinData(coinCodes).then(data => {
            if (data) {
                data.forEach(coin => {
                    const coinElement = document.createElement('div');
                    coinElement.classList.add('sidebar-item');
                    coinElement.dataset.code = coin.code;
                    coinElement.innerHTML = `
                        <div class="item-main-info">
                            <img src="${coin.png32}" alt="${coin.symbol ? coin.symbol : ""}" class="item-logo">
                            <h2 class="item-name">${coin.name} (${coin.code.replace(/_/g, '')})</h2>
                        </div>
                        <div class="item-price-info">
                            <p class="item-price">PC$${coin.rate.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}</p>
                            <div class="item-change ${coin.delta.day >= 1 ? 'positive' : 'negative'}">
                                <i class="fa-solid ${coin.delta.day >= 1 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
                                <div class="change-amount">${coin.delta.day >= 1 ? '+' : ''}${((coin.delta.day-1)*100).toFixed(2)}%</div>
                                <div class="change-interval">(1d)</div>
                            </div>
                        </div>
                    `;

                    sidebarCoins.appendChild(coinElement);

                    coinElement.addEventListener('click', () => {
                        toggleSelected(coinElement);
                    });
                })
            }
        });
    }
}

function toggleSelected(element) {
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.toggle('selected');
}

const portfolioButton = document.querySelector('.sidebar-portfolio');

portfolioButton.addEventListener('click', () => {
    toggleSelected(portfolioButton);
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
        if (coinCodes.includes(coin.code)) {
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

    if (JSON.stringify(selectedCoins) !== JSON.stringify(coinCodes)) {
        saveCoinCodes(selectedCoins); 
    }
});