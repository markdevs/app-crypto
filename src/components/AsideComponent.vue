<template>
  <div class="container-cryptow">
    <div class="form" id="format_aside">
      <!-- Seletor de Ativos Cripto -->
      <div class="busca">
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
      </div>
      <!-- Dados do Ativo Cripto -->
    </div>
    <div class="container-result" v-if="cryptoData">
      <!-- Gráfico de Candlestick -->
      <div class="result3">
        <ul>
          <li
            class="aside_li"
            v-for="(value, key) in Object.entries(webSocketData)"
            :key="key"
          >
            <p class="name">{{ selectedCrypto }}</p>
            <p class="cot">${{ value[1] | formatarMoeda }}</p>
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
  filters: {
    formatarMoeda(valor) {
      // Opções para a formatação de moeda em BRL
      const opcoes = {
        style: "currency",
        currency: "USD",
      };

      // Retorna o valor formatado como moeda
      return valor.toLocaleString("en-US", opcoes);
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
        console.log(jsonData);
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
#format_aside {
  height: auto;
  padding: 10px;
  border-radius: 10px;
  margin-top: 40px;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.busca {
  width: 70%;
  display: flex;
  justify-content: center;
}
.aside_li {
  list-style: none;
  font-size: 2rem;
  margin: 0;
}

.aside_li p {
  color: #ffffff;
  margin-top: 30px;
  font-weight: bold;
  text-align: center;
}

#format_aside {
  color: #ffd100;
}

#format_aside label {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 15px 0;
  display: inline-block;
}

#format_aside select#cryptoSelector {
  width: 50%;
  height: 45px;
}

.name {
  font-size: 108px !important;
  text-shadow: 0 0 10px #38b000, 0 0 20px #38b000, 0 0 30px #38b000,
    0 0 40px #38b000, 0 0 70px #38b000, 0 0 80px #38b000, 0 0 100px #38b000; /* Sombra do texto */
  color: #38b000;
}

.name-text:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #38b000; /* Cor do brilho */
  z-index: -1;
  filter: blur(2px); /* Desfoque para o brilho */
  opacity: 0.5; /* Opacidade do brilho */
}

.cot {
  font-size: 70px;
  font-weight: lighter;
}

.container-result {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
  