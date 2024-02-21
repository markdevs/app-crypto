<template>
  <div class="form" id="home_form">
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
    <div class="page_format" v-if="cryptoData">
      <div class="result">
        <h2>{{ cryptoData.id }}</h2>
        <ul>
          <li>
            <h3>
              <strong>Rank <br /> </strong>
            </h3>
            <p>{{ cryptoData.rank }}</p>
          </li>
          <li>
            <h3>
              <strong>Símbolo <br /> </strong>
            </h3>
            <p>{{ cryptoData.symbol }}</p>
          </li>
          <li>
            <h3>
              <strong>Preço USD <br /></strong>
            </h3>
            <p>R$ {{ cryptoData.priceUsd | formatarMoeda }}</p>
          </li>
          <li>
            <h3>
              <strong>Variação nas últimas 24 horas <br /> </strong>
            </h3>
            <p>{{ cryptoData.changePercent24Hr }}%</p>
          </li>
          <!-- Adicione outros campos conforme necessário -->
        </ul>
      </div>
      <AsideComponent />
      <!-- Gráfico de Candlestick -->
    </div>
  </div>
</template>
    
<script>
import AsideComponent from "./AsideComponent.vue";

export default {
  components: {
    AsideComponent,
  },

  data() {
    return {
      availableCryptos: [], // Lista de criptomoedas disponíveis
      selectedCrypto: "bitcoin", // Ativo Cripto padrão selecionado
      cryptoData: null, // Dados do Ativo Cripto
      pricesWs: null,
      webSocketData: {},
    };
  },
  filters: {
    formatarMoeda(valor) {
      // Arredonda o valor para duas casas decimais
      const valorArredondado = Math.round(valor * 100) / 100;

      // Formata o valor como moeda em BRL
      const valorFormatado = valorArredondado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return valorFormatado;
    },
  },
  created() {
    this.realTimeCryptos();
  },
  mounted() {
    this.fetchAvailableCryptos();
    this.fetchCryptoData(); // Carrega a lista de criptomoedas disponíveis
    // Inicializar a conexão WebSocket quando o componente é montado
    this.realTimeCryptos();
  },
  methods: {
    realTimeCryptos() {
      if (this.selectedCrypto) {
        this.pricesWs = new WebSocket(
          `wss://ws.coincap.io/prices?assets=${this.selectedCrypto}`
        );

        // Adicionar um ouvinte para a mensagem WebSocket
        this.pricesWs.onmessage = (msg) => {
          this.handleWebSocketMessage(msg);
        };
      } else {
        // Se selectedCrypto for vazio, feche a conexão WebSocket se existir
        this.closeWebSocket();
      }
    },
    handleWebSocketMessage(msg) {
      try {
        const jsonData = JSON.parse(msg.data);
        this.webSocketData = jsonData; // Corrigir o nome da propriedade aqui
      } catch (error) {
        console.error("Erro ao analisar os dados como JSON:", error);
      }
    },
    beforeDestroy() {
      if (this.pricesWs) {
        this.pricesWs.close();
      }
    },

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

.page_format {
  display: flex;
  align-items: center;
  justify-content: center;
}

select#cryptoSelector {
  width: 250px;
  height: 30px;
}

.result {
  padding: 20px;
  margin-top: 90px;
  border-radius: 13px;
}

.result h2 {
  font-size: 3rem;
  margin: 0 0 40px 0;
  text-transform: capitalize;
  font-size: 3em;
  font-size: 72px;
  background: -webkit-linear-gradient(45deg, #ffd100, #ffee32);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.result h2::after {
  content: "";
  display: block;
  width: 120px;
  height: 3px;
  background: -webkit-linear-gradient(#ffd100, #ffee32);
  margin: 10px 0;
}

.result ul {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.result ul li {
  margin-top: 10px;
  list-style: none;
  width: 45%;
  height: 300px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #ffee32;
  text-align: center;
}

.result ul li h3 {
  font-size: 2rem;
  color: #ffd100;
}

.result ul li p {
  color: #ffd100;
  margin-top: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
    