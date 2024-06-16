const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertButton = document.getElementById('convertButton');
const resultDiv = document.getElementById('result');

function getCurrencyFullName(currencyCode) {
    switch(currencyCode) {
        case 'USD': return 'Dólar Americano';
        case 'EUR': return 'Euro';
        case 'GBP': return 'Libra Esterlina';
        case 'JPY': return 'Iene Japonês';
        case 'CAD': return 'Dólar Canadense';
        case 'AUD': return 'Dólar Australiano';
        case 'CHF': return 'Franco Suíço';
        case 'CNY': return 'Yuan Chinês';
        default: return currencyCode;
    }
}

fetch('https://api.exchangerate-api.com/v4/latest/USD')
    .then(response => response.json())
    .then(data => {
        const currencies = Object.keys(data.rates);
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = getCurrencyFullName(currency);
            const option2 = option1.cloneNode(true);
            fromCurrencySelect.appendChild(option1);
            toCurrencySelect.appendChild(option2);
        });
    });

convertButton.addEventListener('click', () => {
    const amount = amountInput.value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (amount === '' || isNaN(amount)) {
        resultDiv.textContent = 'Por favor, insira um valor numérico.';
        return;
    }

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[toCurrency];
            if (rate) {
                const convertedAmount = amount * rate;
                resultDiv.textContent = `${amount} ${getCurrencyFullName(fromCurrency)} = ${convertedAmount.toFixed(2)} ${getCurrencyFullName(toCurrency)}`;
            } else {
                resultDiv.textContent = 'Erro ao obter taxa de conversão.';
            }
        })
        .catch(error => {
            console.error('Erro ao converter moeda:', error);
            resultDiv.textContent = 'Erro ao converter moeda. Verifique sua conexão.';
        });
});
