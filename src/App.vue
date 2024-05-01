<template>
  <div id="app">
    <header>
      <nav>
        <div><p>CryptoLab</p></div>
        <!-- <ul>
          <li><router-link to="/">Tempo real</router-link></li>
        </ul> -->
      </nav>
    </header>
    <router-view />
  </div>
</template>

<style>
@import url("https://fonts.cdnfonts.com/css/square-pixel7");
* {
  margin: 0;
  box-sizing: border-box;
  font-family: "Square Pixel7", sans-serif;
  letter-spacing: 6.5px;
}

input::placeholder,
select,
option {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif !important;
  letter-spacing: normal;
}

body {
  background: url("./assets/bg_crypt.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
}

p,
li {
  color: #fff;
}
ul {
  padding: 0;
}
header {
  height: 100px;
  display: flex;
  justify-content: center;
  padding: 30px 0;
}
h3 {
  font-weight: 500;
}
nav p {
  color: #fff;
}
nav {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  height: auto;
  height: 50px;
}
nav ul {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 30px 0;
}

nav ul li {
  margin-right: 20px;
}

nav ul li a {
  font-size: 1.4rem;
  text-decoration: none;
  color: #fff;
  border: 1px solid #fff;
  padding: 8px 15px;
  box-shadow: -10px 7px 0px #fff;
}
nav ul li a:hover {
  box-shadow: -10px 7px 0px #38b000;
  color: #38b000;
}
.router-link-exact-active {
  color: #38b000;
  box-shadow: -10px 7px 0px #38b000;
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
  background-color: transparent;
  height: 64px;
  width: 100%;
}

nav {
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 36px;
}

#cryptoSelector {
  margin: 30px 0;
}

@media (max-width: 890px) {
  .container-result {
    height: auto !important;
  }
}
</style>
