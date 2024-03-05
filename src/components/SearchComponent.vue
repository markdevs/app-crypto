<template>
  <section class="home">
    <div class="form" id="home_form">
      <!-- Seletor de Ativos Cripto -->
      <div>
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
      </div>
    </div>
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
            <p>{{ cryptoData.priceUsd | formatarMoeda }}</p>
          </li>
          <li>
            <h3>
              <strong>Variação<br /> </strong>
            </h3>
            <p>{{ Math.round(cryptoData.changePercent24Hr) }}%</p>
          </li>
          <!-- Adicione outros campos conforme necessário -->
        </ul>
      </div>
      <AsideComponent />
      <!-- Gráfico de Candlestick -->
    </div>
  </section>
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
      const valorFormatado = valorArredondado.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
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
.home {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
}
.form {
  padding: 30px 0;
}
.form label {
  font-size: 1.3rem;
}
.form div {
  display: flex;
  justify-content: center;
}

.form div select {
  height: 32px;
}

select#cryptoSelector {
  width: 350px;
  height: 42px;
  border: 1px solid #818181;
  border-radius: 20px;
}

.result {
  margin-top: 20px;
  border-radius: 13px;
}

.result h2 {
  font-size: 2.5rem;
  margin: 0 0 40px 0;
  text-transform: capitalize;
  color: #fff;
}

.result h2::after {
  content: "";
  display: block;
  width: 120px;
  height: 3px;
  background: -webkit-linear-gradient(#ac1cd0, #888bf4);
  margin: 10px 0;
}

.result ul {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.result ul li {
  margin-top: 10px;
  list-style: none;
  width: 33%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  background: -webkit-linear-gradient(76deg, #ac1cd0, #888bf4);
  border-radius: 20px;
}

.result ul li h3 {
  font-size: 1rem;
}

.result ul li p {
  color: #fff;
  margin-top: 20px;
  font-size: 1.1rem;
  font-weight: 400;
}

@media (max-width: 1200px) {
  #format_aside {
    margin: 50px 0;
    height: 200px;
    width: 100%;
  }

  .result ul li {
    width: 100%;
  }
}
</style>
    