<template>
  <div class="md-layout" style="text-align: left">
    <div class="md-layout-item">
      <md-table v-model="Assets" md-sort="valueInChakra" md-sort-order="asc">
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Asset" md-sort-by="symbol">
            <img :width="30" :height="30" :src="item.logoURI" />
            <span style="padding-left:10px">{{ item.symbol }} </span>
          </md-table-cell>
          <md-table-cell md-label="contribution" md-sort-by="contribution"
            ><span class="table-text">{{ item.contribution }}%</span></md-table-cell
          >
          <md-table-cell md-label="Current Price" md-sort-by="price"
            ><span class="table-text">${{ formatDataString(item.price) }}</span></md-table-cell
          >
          <md-table-cell md-label="Holdings" md-sort-by="amountInCharkaRounded"
            ><span class="table-text">{{ formatDataString(item.amountInCharkaRounded) }}</span></md-table-cell
          >
          <md-table-cell md-label="Value" md-sort-by="valueInChakra"
            ><span class="table-text">${{ formatDataString(item.valueInChakra) }}</span></md-table-cell
          >
          <md-table-cell md-label="Change (7d)" md-sort-by="sevenDayChange"
            ><span
              class="table-text"
              :class="item.sevenDayChange > 0 ? 'positive-value-change' : 'negative-value-change'"
              >{{ item.sevenDayChange }}</span
            ></md-table-cell
          >
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssetBreakdown",
  components: {},
  props: {
    Assets: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDataString(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  computed: {},
  data: () => ({
    users: [
      {
        id: 1,
        name: "Shawna Dubbin",
        email: "sdubbin0@geocities.com",
        gender: "Male",
        title: "Assistant Media Planner"
      },
      {
        id: 2,
        name: "Odette Demageard",
        email: "odemageard1@spotify.com",
        gender: "Female",
        title: "Account Coordinator"
      },
      {
        id: 3,
        name: "Lonnie Izkovitz",
        email: "lizkovitz3@youtu.be",
        gender: "Female",
        title: "Operator"
      },
      {
        id: 4,
        name: "Thatcher Stave",
        email: "tstave4@reference.com",
        gender: "Male",
        title: "Software Test Engineer III"
      },
      {
        id: 5,
        name: "Clarinda Marieton",
        email: "cmarietonh@theatlantic.com",
        gender: "Female",
        title: "Paralegal"
      }
    ]
  }),

  computed: {}
};
</script>

<style lang="scss" scoped>
.table-text {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  /* identical to box height */

  display: flex;
  align-items: center;

  /* Primary/Grey */

  color: #292929;
}

.positive-value-change {
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #52bb2e;
}

.negative-value-change {
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  text-align: right;
  color: #e42028;
}
</style>
