<template>
  <div class="form">
    <!-- Seletor de Ativos Cripto -->
    <label for="cryptoSelector">Selecione o Ativo Cripto:</label><br /><br />
    <select
      id="cryptoSelector"
      v-model="selectedCrypto"
      @change="handleCryptoSelectionChange"
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
          <!-- ... (outros campos) ... -->
        </ul>
      </div>
      <!-- Gráfico de Candlestick -->
      <div>
        {{ selectedCrypto }}
        <ul>
          <li v-for="(value, key) in Object.entries(webSocketData)" :key="key">
            {{ key }}: {{ value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RealTime",
  data() {
    return {
      availableCryptos: [], // Lista de criptomoedas disponíveis
      selectedCrypto: "bitcoin", // Ativo Cripto padrão selecionado
      cryptoData: null, // Dados do Ativo Cripto
      pricesWs: null,
      webSocketData: {},
    };
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
        // Fechar a conexão WebSocket existente, se houver
        this.closeWebSocket();

        // Iniciar uma nova conexão WebSocket
        this.pricesWs = new WebSocket(
          `wss://ws.coincap.io/prices?assets=${this.selectedCrypto}`
        );

        // Adicionar um ouvinte para a mensagem WebSocket
        this.pricesWs.onmessage = (msg) => {
          this.handleWebSocketMessage(msg);
        };
      }
    },

    handleWebSocketMessage(msg) {
      try {
        const jsonData = JSON.parse(msg.data);
        this.webSocketData = jsonData;
      } catch (error) {
        console.error("Erro ao analisar os dados como JSON:", error);
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

          // Reiniciar WebSocket ao receber novos dados
          this.realTimeCryptos();
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da API CoinCap:", error);
        });
    },

    closeWebSocket() {
      if (this.pricesWs) {
        this.pricesWs.close();
      }
    },

    fetchAdditionalData() {
      // Novo fetch com base na seleção do usuário
      const additionalApiUrl = `https://api.coincap.io/v2/alguma-rota-adicional/${this.selectedCrypto}`;

      fetch(additionalApiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Manipular os dados adicionais conforme necessário
          console.log("Dados adicionais:", data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados adicionais:", error);
        });
    },

    handleCryptoSelectionChange() {
      // Chama o método para atualizar a conexão WebSocket
      this.realTimeCryptos();

      // Chama o método para buscar dados da criptomoeda
      this.fetchCryptoData();

      // Chama o novo método para buscar dados adicionais
      this.fetchAdditionalData();
    },
  },
};
</script>

<style>
/* ... (seu estilo) ... */
</style>
