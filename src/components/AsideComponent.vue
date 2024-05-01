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
    <div class="container-result" v-if="!loading && cryptoData">
      <!-- Gráfico de Candlestick -->
      <div class="result3">
        <ul>
          <li
            class="aside_li"
            v-for="(value, key) in Object.entries(webSocketData)"
            :key="key"
          >
            <p class="name" id="font-size">{{ selectedCrypto }}</p>
            <p class="cot">${{ value[1] | formatarMoeda }}</p>
            <p class="date">{{ data }}</p>
            <p class="hora">{{ hora }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="container-result" v-if="loading">
      <!-- Indicador de carregamento -->
      <p class="loading-text">Carregando...</p>
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
      data: "",
      hora: "",
      loading: false, // Indicador de carregamento
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
    this.obterDataEHoraAtual();
  },

  methods: {
    obterDataEHoraAtual() {
      const dataHoraAtual = new Date();
      this.data = dataHoraAtual.toLocaleDateString();
      this.hora = dataHoraAtual.toLocaleTimeString();
    },
    atualizarHora() {
      this.obterDataEHoraAtual();
    },
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
        this.loading = false;
      } catch (error) {
        console.error("Erro ao analisar os dados como JSON:", error);
      }
    },

    fetchAvailableCryptos() {
      const apiUrl = "https://api.coincap.io/v2/assets/";

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Ordenar os ativos pelo market cap em ordem decrescente
          const sortedCryptos = data.data.sort(
            (a, b) => b.marketCapUsd - a.marketCapUsd
          );

          // Pegar os 50 melhores ativos
          const top50Cryptos = sortedCryptos.slice(0, 50);

          // Extrair os IDs e nomes dos 50 melhores ativos
          this.availableCryptos = top50Cryptos.map((crypto) => ({
            id: crypto.id,
            name: crypto.name,
          }));
        })
        .catch((error) => {
          console.error("Erro ao buscar lista de criptomoedas:", error);
        });
    },

    async fetchCryptoData() {
      // URL da API CoinCap para obter informações sobre ativos cripto
      const apiUrl = `https://api.coincap.io/v2/assets/${this.selectedCrypto}`;

      await fetch(apiUrl)
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
      const additionalApiUrl = `https://api.coincap.io/v2/assets/${this.selectedCrypto}`;

      fetch(additionalApiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Manipular os dados adicionais conforme necessário
          return data;
        })
        .catch((error) => {
          console.error("Erro ao buscar dados adicionais:", error);
        });
    },

    handleCryptoSelectionChange() {
      // Ativar indicador de carregamento
      this.loading = true;
      // Chama o método para atualizar a conexão WebSocket
      this.realTimeCryptos();

      // Chama o método para buscar dados da criptomoeda
      this.fetchCryptoData();

      // Chama o novo método para buscar dados adicionais
      this.fetchAdditionalData();

      this.atualizarHora();
    },
  },
};
</script>
  
  <style>
#format_aside {
  height: auto;
  padding: 10px;
  border-radius: 10px;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container-result {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 50px;
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
  font-size: 128px !important;
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

.cot,
.date,
.hora {
  font-size: 108px;
  font-weight: lighter;
}

@media (max-width: 790px) {
  #format_aside select#cryptoSelector {
    width: 100%;
  }

  .container-result {
    padding-bottom: 190px;
  }

  .cot,
  .date,
  .hora {
    font-size: 3rem !important;
  }

  .aside_li p {
    font-size: 3.5rem !important;
  }

  #font-size {
    font-size: 2.3em !important;
  }

  .busca {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.loading-text {
  font-size: 24px;
  font-weight: bold;
  color: #fff; /* Torna o texto transparente */
  background: linear-gradient(
    to right,
    #4cd964,
    #4cd964 50%,
    transparent 50%,
    transparent
  ); /* Cria um gradiente de cor verde */
  background-size: 200% 100%; /* Define o tamanho do gradiente */
  background-position: 100%; /* Define a posição inicial do gradiente */
  animation: slide 3s linear infinite; /* Adiciona a animação */
}

@keyframes slide {
  0% {
    background-position: 100%; /* Começa do final */
  }
  100% {
    background-position: 0%; /* Termina no início */
  }
}
</style>
  