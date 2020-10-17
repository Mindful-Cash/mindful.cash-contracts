<template>
  <div class="wrapper">
    <h1 class="title">New Chakra</h1>
    <md-steppers>
      <md-step id="first" md-label="Setup">
        <div class="left">
          <h2 class="title">Chakra Name</h2>
          <p>
            Choose a name for your Chakra. This will be viewable by other users.
          </p>
          <input placeholder="Enter Name" v-model="initial" />
          <Separator />
          <h2 class="title">Select Distribution</h2>
          <p>
            Select the tokens you want to add to your Chakra, and choose your distribution ratios.
          </p>
          <button class="add-asset-btn"><span>+ Add Asset</span></button>
          <Separator />
          <h2 class="title">Initial Contribution</h2>
          <button>replace me</button><button>with switch</button>
          <p>
            Deposit any asset to fund your Chakra. The assets you deposit will be used to buy the assets in your Chakra
            in accordance with your specified distribution.
          </p>
          <p><b>Slippage may occur during this process.</b></p>
          <p><b>An extra 5% ETH is sent with the TX to avoid unexpected errors - unused ETH will be returned.</b></p>
          <button>replace me</button>
        </div>

        <div class="right"></div>
      </md-step>

      <md-step id="second" md-label="DCA Strategy">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
      </md-step>

      <md-step id="third" md-label="Complete">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
import Separator from "@/components/elements/Separator";
export default {
  name: "ChakraFlow",
  components: { Separator }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

// Navigation overrides
::v-deep .md-steppers-navigation {
  box-shadow: none !important;
  border-bottom: 1px solid rgba(41, 41, 41, 0.1);
}

::v-deep .md-steppers .md-stepper-number {
  background: none !important;
  color: #ccc !important;
  border: 1px solid #ccc !important;
}

::v-deep .md-steppers .md-active .md-stepper-number {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%) !important;
  border: none !important;
  color: #fff !important;
}

::v-deep .md-steppers .md-stepper-text {
  color: #ccc !important;
}

::v-deep .md-steppers .md-active .md-stepper-text {
  color: #292929 !important;
  font-weight: 500 !important;
}

// Theme
.wrapper {
  text-align: left;
}

::v-deep .md-steppers .md-stepper-content {
  display: flex;
}

.left {
  flex: 3;
}

.right {
  flex: 2;
}

input {
  border: 1px solid #aaa;
  box-shadow: none;
  border-radius: 0.5rem;
  color: #aaa;
  background: none;
  border-radius: 8px;
  height: 2.5rem;
  box-sizing: border-box;
  width: 100%;
  padding: 0 1rem;
  font-size: 1rem;

  &:focus {
    border: 1px solid #00e0ff;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
}

h1.title {
  margin: 1.5rem 0 0 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.875rem;
}

.add-asset-btn {
  height: 2.5rem;
  border: 1px solid #aaa;
  color: #aaa;
  text-align: center;
  width: 100%;
  background: none;
  box-shadow: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;

  span {
    transition: all ease-in-out 0.5s;
    font-size: 1rem;
  }

  &:hover {
    border: 1px solid #00e0ff;

    span {
      background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>