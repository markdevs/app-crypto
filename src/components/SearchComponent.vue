<template>
  <div class="form">
    <!-- Seletor de Ativos Cripto -->
    <label for="cryptoSelector">Selecione o Ativo Cripto:</label><br /><br />
    <select
      id="cryptoSelector"
      v-model="selectedCrypto"
      @change="fetchCryptoData"
    >
      <option
        v-for="crypto in availableCryptos"
        :key="crypto.id"
        :value="crypto.id"
      >
        {{ crypto.name }}
      </option>
    </select>

    <!-- Dados do Ativo Cripto -->
    <div v-if="cryptoData">
      <div class="result">
        <h2>{{ cryptoData.id }}</h2>
        <ul>
          <li><strong>Rank:</strong> {{ cryptoData.rank }}</li>
          <li><strong>Símbolo:</strong> {{ cryptoData.symbol }}</li>
          <li><strong>Preço USD:</strong> {{ cryptoData.priceUsd }}</li>
          <li><strong>MarketCapUsd:</strong> {{ cryptoData.marketCapUsd }}</li>
          <li><strong>Supply:</strong> {{ cryptoData.supply }}</li>
          <li v-if="cryptoData.maxSupply"><strong>MaxSupply:</strong> {{ cryptoData.maxSupply }}</li>
          <li>
            <strong>Variação nas últimas 24 horas:</strong>
            {{ cryptoData.changePercent24Hr }}%
          </li>
          <!-- Adicione outros campos conforme necessário -->
        </ul>
      </div>
       <!-- Gráfico de Candlestick -->
      <div>
        {{ candlestickData }}
        <canvas ref="candlestickChart"></canvas>
      </div>
    </div>
  </div>
</template>
    
<script>

import Chart from "chart.js";

export default {
  data() {
    return {
      availableCryptos: [], // Lista de criptomoedas disponíveis
      selectedCrypto: "bitcoin", // Ativo Cripto padrão selecionado
      cryptoData: null, // Dados do Ativo Cripto
      candlestickData: null,
      candlestickChart: null,
    };
  },
  mounted() {
    this.fetchAvailableCryptos();
    this.fetchCryptoData(); // Carrega a lista de criptomoedas disponíveis
    this.fetchCandleStick()
},
  methods: {
    fetchAvailableCryptos() {
      const apiUrl = "https://api.coincap.io/v2/assets/";

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Extrai a lista de criptomoedas disponíveis
          this.availableCryptos = data.data.map((crypto) => ({
            id: crypto.id,
            name: crypto.name,
          }));
        })
        .catch((error) => {
          console.error("Erro ao buscar lista de criptomoedas:", error);
        });
    },
    fetchCryptoData() {
      // URL da API CoinCap para obter informações sobre ativos cripto
      const apiUrl = `https://api.coincap.io/v2/assets/${this.selectedCrypto}`;
      

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Armazena os dados do ativo cripto
          this.cryptoData = data.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da API CoinCap:", error);
        });
        
    },
    fetchCandleStick() {

        const apiUrlCandlestick = `https://api.coincap.io/v2/candles?exchange=poloniex&interval=h8&baseId=bitcoin&quoteId=${this.selectedCrypto}%0A`;
        
        fetch(apiUrlCandlestick)
        .then(response => response.json())
        .then(data => {
          this.candlestickData = data.data;
          this.renderCandlestickChart();
        })
        .catch(error => {
          console.error('Erro ao buscar dados da API CoinCap para Candlestick:', error);
        });
    },
    renderCandlestickChart() {
      const ctx = this.$refs.candlestickChart.getContext('2d');

      if (this.candlestickChart) {
        this.candlestickChart.destroy();
      }

      this.candlestickChart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: 'Candlestick Chart',
            data: this.candlestickData, // Assumindo que os dados são adequados para o Chart.js
          }],
        },
      });
    },

  },
};
</script>
    
    <style>
.form {
  padding: 30px 0;
}
.form label {
  font-size: 1.3rem;
}

select#cryptoSelector {
  width: 250px;
  height: 30px;
}

.result {
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin-top: 90px;
  border-radius: 13px;
  background: #fff;
}

.result h2 {
  font-size: 3rem;
  margin: 0 0 40px 0;
  text-transform: capitalize;
}

.result h2::after {
  content: "";
  display: block;
  width: 120px;
  height: 3px;
  background: #f21b3f;
  margin: 10px 0;
}

.result ul {
  padding: 0;
}

.result ul li {
  margin-top: 10px;
  list-style: none;
}
</style>
    