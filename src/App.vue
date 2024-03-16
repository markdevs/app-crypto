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
@import url("https://fonts.cdnfonts.com/css/ll-pixel");

* {
  margin: 0;
  box-sizing: border-box;
  font-family: "LLPixel", sans-serif;
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
  color: #fff;
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
