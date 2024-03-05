<template>
  <div id="app">
    <header>
      <nav>
        <p>CryptoLab</p>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600&display=swap");

* {
  margin: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
}

p,
li {
  color: #fff;
}
ul {
  padding: 0;
}
body {
  background: #000000;
}

h3 {
  font-weight: 500;
}
nav p {
  background: -webkit-linear-gradient(93deg, #ac1cd0, #888bf4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2,
h3,
label {
  color: #fff;
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
  background-color: #000000;
  height: 64px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

nav {
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 36px;
}
</style>
