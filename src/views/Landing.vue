<template>
  <div class="landing">
    <div class="md-layout" style="padding:20px;text-align:left">
      <div class="md-layout-item md-size-10"></div>

      <div class="md-layout-item">
        <img src="@/assets/svg/logo.svg" alt="logo" />
      </div>
      <div class="md-layout-item" id="nav" style="text-align: right">
        <button id="logo">
          <span class="highlight" style="cursor: pointer;font-size: 16px;" @click="goToApp">Go to app</span>
        </button>
      </div>
      <div class="md-layout-item md-size-10"></div>
    </div>
    <div id="header" class="md-layout">
      <div class="md-layout-item md-size-10"></div>
      <div class="md-layout-item md-size-50">
        <h1 class="heading">
          Portfolio Alignment <br />
          for Degens
        </h1>
        <p style="secondary-text">
          Create auto-rebalancing portfolios and implement mindful DCA strategies while automatically taking profits on
          the way up.
        </p>
        <p class="highlight">Let your mindful self plan for your degen self's future.</p>
        <div style="display: flex; align-items: left">
          <button class="highlight-btn" style="cursor: pointer;font-size: 16px;" @click="goToApp">
            <span>Align Your Chakras</span>
          </button>
        </div>
        <div class="separator-container" style="margin-top: 10rem">
          <div class="separator" />
        </div>
      </div>
      <div class="md-layout-item md-size-40">
        <div id="lotus" />
      </div>
    </div>

    <div id="rebalance" class="section">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-10"></div>
        <div class="md-layout-item md-size-70">
          <h2 class="heading">
            Create<br />
            Auto-Rebalancing<br />
            Portfolios
          </h2>
        </div>
        <div class="md-layout-item md-size-30" />
      </div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-10"></div>
        <div class="md-layout-item md-size-70">
          <p class="secondary-text">
            Create bespoke portfolios - <span class="highlight">”Chakras”</span> - when you’re feeling mindful. Your
            degen self will thank you later.
          </p>
        </div>
      </div>
      <div class="md-layout">
        <div class="md-layout-item md-size-10"></div>
        <div class="md-layout-item md-size-80" id="defi-energy" />
        <div class="md-layout-item md-size-10"></div>
      </div>
      <div class="md-layout-item md-size-100 separator-container center">
        <div class="separator" />
      </div>
    </div>

    <div id="dca" class="section">
      <div class="md-layout md-alignment-top-center">
        <h2 class="heading">Implement Mindful DCA Strategies</h2>
        <p class="md-layout-item md-size-100 secondary-text">
          Allocate funds to a DCA pool, automate your strategy, and
          <span class="highlight">never miss a bull run again.</span>
        </p>
        <div class="md-layout-item" id="chakra" />
        <div class="md-layout-item md-size-100 separator-container center">
          <div class="separator" />
        </div>
      </div>
    </div>

    <div class="section" id="chart">
      <div class="md-layout md-alignment-top-left">
        <div class="md-layout-item md-size-10"></div>
        <div class="md-layout-item md-size-80 md-xsmall-size-100" style="text-align:left">
          <h2 class="heading">
            Automatically Take Profits<br />
            on the Way Up
          </h2>
          <br />
          <p class="secondary-text" style="text-align:left">
            Set automated parameters for taking profits to hedge<br />
            against the whims of your
            <span class="highlight">degenerate future self.</span>
          </p>
        </div>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-10"></div>
    </div>

    <div class="separator-container" style="margin-top: 6rem">
      <div class="separator" />
    </div>

    <div id="guru" class="md-layout-item ">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-10"></div>
        <div class="md-layout-item md-size-40 md-xsmall-size-100">
          <h2 class="heading">Find Your Guru</h2>
          <p class="secondary-text">
            Browse and copy the <span class="highlight">most profitable strategies</span>, developed by the most mindful
            traders.
          </p>
          <div style="display: flex; align-items: left">
            <button class="highlight-btn" style="cursor: pointer;font-size: 16px;" @click="goToApp">
              <span class="highlight">Find A Guru</span>
            </button>
          </div>
        </div>
        <div class="md-layout-item md-size-50">
          <div class="md-xsmall-hide" id="guru-large" />
        </div>
      </div>
    </div>

    <div class="md-layout-item md-size-100 separator-container center">
      <div class="separator" />
    </div>

    <div class="section">
      <div class="md-layout md-alignment-top-center">
        <h2 class="heading">Silence Your Inner Degenerate</h2>
        <p class="md-layout-item md-size-100 secondary-text">
          Start aligning your Chakras today. Don’t throw away your next opportunity to build
          <span class="highlight">generation wealth.</span>
        </p>
        <button class="highlight-btn" style="cursor: pointer;font-size: 16px;" @click="goToApp">
          <span>Align Your Chakras</span>
        </button>
      </div>
    </div>

    <div class="md-layout-item" style="margin-bottom:200px" id="om" />
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "landing",
  methods: {
    goToApp() {
      router.push({ path: "/app" });
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "@/styles/reset.scss";
@import "@/styles/variables.scss";

p {
  font-size: 1.25rem;
}

.landing {
  width: 100%;
  height: 100%;
}

// Images
#guru-large {
  background: url("~@/assets/svg/guru-large.svg") no-repeat;
  background-position-y: 25% !important;
  background-position-x: 100%;
  background-size: contain;
  height: 150%;
}

#lotus {
  background: url("~@/assets/svg/lotus.svg") no-repeat;
  background-position-y: -50%;
  background-size: cover;
  height: 120%;
}

#chart {
  background: url("~@/assets/svg/stonks-up.svg") no-repeat;
  background-position-y: 100%;
  background-size: 100%;
  height: 38rem;
}

#defi-energy {
  background: url("~@/assets/defi-energy.png") no-repeat;
  background-size: contain;
  width: 100%;
  padding-top: 64%;
  background-position-x: 50%;
  margin-top: 3rem;
}

#om {
  background: url("~@/assets/svg/om.svg") no-repeat;
  background-size: contain;
  padding: 8rem;
  background-position-x: 50%;
  margin: 6rem 0;
}

#chakra {
  background: url("~@/assets/chakra.png") no-repeat;
  background-size: contain;
  padding: 12rem;
  background-position-x: 50%;
  margin-top: 4rem;
}

// Sections
.section {
  padding: 4rem 0 0 0;
}

#dca p {
  text-align: center;
}

#guru {
  // display: flex;
  // flex-direction: column;
  height: 40rem;

  p,
  h2 {
    text-align: left;
  }

  .heading {
    margin-top: 4rem;
  }
}

#nav {
  // margin-top: 2rem;
  // max-width: 1024px;

  button {
    background: none;
    outline: none;
    border-radius: 1.875rem;
    padding: 0.5rem 3rem;
    border: 1px solid #00e0ff;
    box-sizing: border-box;
  }
}

#header {
  // display: flex;
  // flex-direction: column;
  // align-items: flex-start;
  // margin-top: 6rem;

  p,
  h1 {
    text-align: left;
  }

  .heading {
    margin-top: 4rem;
  }
}

#rebalance {
  h2,
  p {
    text-align: left;
  }
}

// Defaults
.heading {
  font-size: 3.75rem;
  font-weight: 600;
  line-height: 4.5rem;
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  background-clip: text;
  color: transparent;
  margin: 0 0 3rem 0;
}

.highlight {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  background-clip: text;
  color: transparent;
  font-weight: 600;
}

.separator {
  background: url("~@/assets/svg/three-dots.svg") no-repeat;
  background-size: contain;
  width: 5rem;
}

.highlight-btn {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  margin: 2rem 0;

  span {
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
  }
}

.separator-container {
  display: flex;
  height: 18px;
  width: 100%;
  margin: 3.25rem 0;
}

.center {
  justify-content: center;
}

.secondary-text {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  color: #292929;
}
</style>
