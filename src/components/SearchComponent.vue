<template>
  <section class="home">
    <div class="container">
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
          <p>{{ data }} | {{ hora }}</p>
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
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
    
<script>
export default {
  components: {},

  data() {
    return {
      availableCryptos: [], // Lista de criptomoedas disponíveis
      selectedCrypto: "bitcoin", // Ativo Cripto padrão selecionado
      cryptoData: null, // Dados do Ativo Cripto
      pricesWs: null,
      webSocketData: {},
      data: "",
      hora: "",
      opcaoSelecionada: "",
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
      this.atualizarHora();
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
  margin-top: 70px;
}

.home_form {
  padding: 70px 0;
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
  text-align: center;
}

.result p {
  color: #fff;
  font-size: 3rem;
  display: inline-block;
  padding: 30px 0;
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
  background: #fff;
  margin: 10px auto;
}

.result ul {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.result ul li {
  margin: 50px;
  list-style: none;
  width: 40%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  border-radius: 20px;
}

.result ul li h3 {
  font-size: 4rem;
  text-shadow: 0 0 10px #38b000, 0 0 20px #38b000, 0 0 30px #38b000,
    0 0 40px #38b000, 0 0 70px #38b000, 0 0 80px #38b000, 0 0 100px #38b000; /* Sombra do texto */
  color: #38b000;
  color: #fff;
}

.result ul li h3:before {
  display: inline-block;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: blur(2px); /* Desfoque para o brilho */
  opacity: 0.5; /* Opacidade do brilho */
}

.result ul li p {
  color: #fff;
  margin-top: 20px;
  font-size: 2.5rem;
  font-weight: 400;
}

@media (max-width: 1200px) {
  #format_aside {
    height: 200px;
    width: 100%;
  }

  .result ul li {
    width: 100%;
  }
}
</style>
    