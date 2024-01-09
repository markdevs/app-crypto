<template>
  <div id="app">
    <header>
      <div class="logo">
        <p>Crypto App</p>
      </div>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600&display=swap');

*{
  margin: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}


.container {
  width: 90%;
  display: block;
  margin: 0 auto;
}
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fcfcfc;
  height: 64px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}
</style>
