<template>
  <div class="home">
    <div class="container">
      <div class="main">
        <MenutencaoView />
        <!-- <AsideComponent /> -->
      </div>
      <!-- <div class="2floor">
      <exchange-component></exchange-component>
    </div> -->
    </div>
  </div>
</template>

<script>
// import AsideComponent from "@/components/AsideComponent.vue";
// import ExchangeComponent from '@/components/ExchangeComponent.vue'
// @ is an alias to /src
import MenutencaoView from './MenutencaoView.vue';
export default {
  name: "HomeView",
  components: {
    MenutencaoView,
  },
};
</script>
<style lang="css">
</style>
