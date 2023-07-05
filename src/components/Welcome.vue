<template>
  <div class="body-container">
    <div class="card-container">
      <div class="card">
        <h1>Dennis <br />Cyphers</h1>

        <div class="info-container">
          <p>
            I was born in Mayaguez, Puerto Rico, months before Mount St. Helens
            erupted. In the early 90's I spent my time at Seoul Academy and the
            arcades as a kid in Korea. A majority of my life has been spent in
            the Evergreen State making my way in the universe. During this time
            I have been in involved in Music, Gaming, and Technology. My passion
            for tech has spanned more than three decades, from Graphic Design,
            Technical Art, Web and Mobile App Development, and Web Design, to
            System Architecture, Information Technology, and Surveillance
            Systems. I now spend my time helping businesses grow through
            technology and artificial intelligence.
          </p>

          <!-- Links go here -->
          <span>
            <a class="social-btn" href="https://github.com/djcyphers">
              <font-awesome-icon :icon="['fab', 'github-square']" />
            </a>
            <a class="social-btn" href="https://www.linkedin.com/in/djcyphers/">
              <font-awesome-icon :icon="['fab', 'linkedin']" />
            </a>
            <a class="social-btn" href="https://www.behance.com/djcyphers">
              <font-awesome-icon :icon="['fab', 'behance-square']" />
            </a>
            <a class="social-btn" href="https://artstation.com/djcyphers">
              <font-awesome-icon :icon="['fab', 'artstation']" />
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-container {
  position: relative;
  width: 60vw;
  height: 100%;
  min-height: 100vh;
  z-index: 0;
  bottom: 10vh;
  right: 16vw;
}

.body-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 60vw;
  height: 80%;
  mix-blend-mode: overlay;
  backdrop-filter: blur(14px) saturate(70%);
  z-index: 0;
}

.card-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url("~@/assets/img/shunya-koide-O-seattlenight.png");
  background-size: 100%;
  background-position: center;
  border-radius: 20px;
  z-index: 1;
  width: 100%;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  overflow: hidden;
  margin: 50px 0px;
}

@media screen and (max-width: 2200px) {
  .body-container {
    right: 8vw;
  }
}

@media screen and (max-width: 1750px) {
  .card-container {
    width: 100%;
  }
  .body-container {
    right: 4vw;
  }

  .card p {
    font-size: 8pt !important;
  }
}

@media screen and (max-width: 1587px) {
  .card-container {
    width: 100%;
  }
  .body-container {
    left: 1vw;
  }
}

@media screen and (max-width: 1360px) {
  .card-container {
    width: 100%;
  }
  .body-container {
    left: calc(2vw + 2rem);
  }
}

@media screen and (max-width: 1200px) {
  .card-container {
    width: calc(40vw + 25rem);
    background-size: cover;
  }
  .body-container {
    left: 10vw;
  }
}

@media screen and (max-width: 1000px) {
  .card-container {
    width: calc(40vw + 25rem);
  }
  .body-container {
    left: 8vw;
  }
}

@media screen and (max-width: 700px) {
  .card-container {
    width: calc(40vw + 20rem);
  }
  .body-container {
    left: 6vw;
  }
}

@media screen and (max-width: 500px) {
  .body-container {
    left: -2vw;
    bottom: 20vh;
  }
}

@media screen and (max-width: 400px) {
  .card-container {
    width: 90%;
  }
}

.card-container::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(90deg, white, black);
  mix-blend-mode: overlay;
}

.card-container::after {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    #4053ff,
    #3c58f8dd,
    #6139f1ee,
    #6e36e8cc,
    #a635dfbb,
    #b534d599,
    #bb34ca81,
    #a23ab95b,
    #9d3fa900,
    #9a449700,
    #89488b00,
    #7d4b7700
  );
  mix-blend-mode: lighten;
}

.card {
  border: 1px solid SkyBlue;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  border-radius: 20px;
  background: url("~@/assets/img/shunya-koide-O-seattlenight.png");
  background-position: right 110%;
  background-size: 50%;
  background-repeat: repeat;
  padding: 30px 40px;
  z-index: 2;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

@media screen and (max-width: 1200px) {
  .card {
    flex-direction: column;
    background-size: 80%;
    filter: drop-shadow(0px 0px 10px Sienna);
  }
}

@media screen and (max-width: 800px) {
  .card {
    background-size: 100%;
    padding: 30px 10px;
  }
}

.card h1 {
  font-size: 50pt;
  line-height: 50pt;
  font-weight: 900;
  text-transform: uppercase;
  width: 40%;
  animation: glow 1s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #eeeeee, 0 0 20px #000000, 0 0 30px #000000,
      0 0 40px #000000, 0 0 50px #9554b3, 0 0 60px #9554b3, 0 0 70px #9554b3;
  }
  to {
    text-shadow: 0 0 20px #eeeeee, 0 0 30px #ff4da6, 0 0 40px #ff4da6,
      0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
  }
}

@media screen and (max-width: 1200px) {
  .card h1 {
    width: 90%;
    text-align: center;
  }
}

@media screen and (max-width: 800px) {
  .card h1 {
    font-size: 40pt;
    line-height: 40pt;
  }
}

@media screen and (max-width: 485px) {
  .card h1 {
    font-size: 30pt;
    line-height: 30pt;
  }
}

h1 span {
  font-size: 15pt;
  line-height: 0pt;
  margin: 0;
  padding: 0;
}

.info-container {
  width: 60%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

@media screen and (max-width: 1200px) {
  .info-container {
    align-items: center;
    justify-content: center;
    width: calc(30vw + 10rem);
  }
}

@media screen and (max-width: 900px) {
  .info-container {
    align-items: center;
    justify-content: center;
    width: 90%;
  }
}

.card p {
  font-size: 12pt;
  line-height: 23pt;
  background: #58472f00;
  color: #ffe4bf;
  padding: 30px 40px;
  border-radius: 20px 0px 20px 0px;
  font-weight: 400;
  backdrop-filter: blur(15px);
  border: 1px solid #58472f11;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
}

@media screen and (max-width: 1200px) {
  .card p {
    font-size: 8pt;
    border-radius: 20px;
    text-shadow: 1px 1px 0px black;
    overflow-x: scroll;
  }
}

.social-btn {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 2px solid Beige;
  color: beige;
  font-weight: 500;
  text-decoration: none;
  margin-top: 20px;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

@media screen and (max-width: 500px) {
  .social-btn {
    width: 80px;
  }
}

.social-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: Beige;
  color: Beige;
  z-index: -1;
  transition: all 0.5s ease-in-out;
}

.social-btn:hover {
  color: #543200;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
  transition: all 0.5s ease-in-out;
}

.social-btn:hover.social-btn::before {
  left: 0;
  transition: all 0.5s ease-in-out;
}
</style>
