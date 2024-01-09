<template>
  <div class="home">
    <div class="container">
    <div class="main">
    <search-component></search-component>
    </div>
    <!-- <div class="2floor">
      <exchange-component></exchange-component>
    </div> -->
  </div>
  </div>
</template>

<script>
import SearchComponent from '@/components/SearchComponent.vue'
// import ExchangeComponent from '@/components/ExchangeComponent.vue'
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
    SearchComponent, 
  }
}
</script>
<style lang="css">
    
</style>
