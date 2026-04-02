"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_item = require("../../stores/item.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_line = common_vendor.resolveComponent("line");
  (_easycom_uni_icons2 + _component_path + _component_svg + _component_line)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + TabBar)();
}
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = {
  __name: "statistics",
  setup(__props) {
    const itemStore = stores_item.useItemStore();
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    const timeRanges = ["周", "月", "年"];
    const currentTimeRange = common_vendor.ref(1);
    const filteredItemsByTime = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      const items = itemStore.items;
      return items.filter((item) => {
        if (!item.buyDate)
          return false;
        const buyDate = new Date(item.buyDate);
        const diffMs = now - buyDate;
        const diffDays = diffMs / (1e3 * 60 * 60 * 24);
        if (currentTimeRange.value === 0)
          return diffDays <= 7;
        if (currentTimeRange.value === 1)
          return diffDays <= 30;
        if (currentTimeRange.value === 2)
          return diffDays <= 365;
        return true;
      });
    });
    const totalValueByTime = common_vendor.computed(() => {
      return filteredItemsByTime.value.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    });
    const averageByTime = common_vendor.computed(() => {
      if (filteredItemsByTime.value.length === 0)
        return 0;
      const total = totalValueByTime.value;
      if (currentTimeRange.value === 0)
        return total / 7;
      if (currentTimeRange.value === 1)
        return total / 30;
      return total / 12;
    });
    const trendValue = common_vendor.computed(() => {
      return currentTimeRange.value === 0 ? 5.2 : currentTimeRange.value === 1 ? 12.5 : -2.4;
    });
    const mainCategory = common_vendor.computed(() => {
      if (filteredItemsByTime.value.length === 0)
        return "无";
      const counts = {};
      filteredItemsByTime.value.forEach((item) => {
        const cat = item.tags[0] || "默认";
        counts[cat] = (counts[cat] || 0) + 1;
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    });
    const categoryData = common_vendor.computed(() => {
      if (filteredItemsByTime.value.length === 0)
        return [];
      const counts = {};
      filteredItemsByTime.value.forEach((item) => {
        const cat = item.tags[0] || "其他";
        counts[cat] = (counts[cat] || 0) + 1;
      });
      const total = filteredItemsByTime.value.length;
      const colors = ["#4b6646", "#ccebc2", "#e2e4d8", "#5f6056"];
      return Object.entries(counts).map(([name, count], index) => ({
        name,
        percent: Math.round(count / total * 100),
        color: colors[index % colors.length]
      }));
    });
    const topExpensiveItems = common_vendor.computed(() => {
      return [...filteredItemsByTime.value].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 5);
    });
    const costPerformanceItems = common_vendor.computed(() => {
      return [...filteredItemsByTime.value].sort((a, b) => parseFloat(a.cost.replace("¥", "")) - parseFloat(b.cost.replace("¥", ""))).slice(0, 5);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "shop-filled",
          size: "24",
          color: "#4b6646"
        }),
        b: common_vendor.p({
          type: "search",
          size: "24",
          color: "#4b6646"
        }),
        c: common_vendor.f(timeRanges, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.n({
              active: currentTimeRange.value === index
            }),
            d: common_vendor.o(($event) => currentTimeRange.value = index, index)
          };
        }),
        d: common_vendor.t(timeRanges[currentTimeRange.value]),
        e: common_vendor.t(totalValueByTime.value.toLocaleString()),
        f: common_vendor.p({
          type: trendValue.value >= 0 ? "trending-up" : "trending-down",
          size: "14",
          color: trendValue.value >= 0 ? "#4b6646" : "#a73b21"
        }),
        g: common_vendor.t(timeRanges[currentTimeRange.value]),
        h: common_vendor.t(trendValue.value >= 0 ? "增长" : "下降"),
        i: common_vendor.t(Math.abs(trendValue.value)),
        j: trendValue.value >= 0 ? "#4b6646" : "#a73b21",
        k: common_vendor.p({
          d: "M10,90 Q30,10 90,40",
          fill: "none",
          stroke: "#4b6646",
          ["stroke-opacity"]: "0.1",
          ["stroke-linecap"]: "round",
          ["stroke-width"]: "2"
        }),
        l: common_vendor.p({
          viewBox: "0 0 100 100"
        }),
        m: common_vendor.t((totalValueByTime.value / 1e3).toFixed(1)),
        n: common_vendor.t(timeRanges[currentTimeRange.value] === "年" ? "月" : "日"),
        o: common_vendor.t(averageByTime.value.toFixed(2)),
        p: common_vendor.p({
          d: "M0,80 Q20,75 40,85 T80,60 T120,70 T160,40 T200,50 T240,20 T300,30",
          fill: "none",
          stroke: "#4b6646",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round",
          ["stroke-width"]: "3"
        }),
        q: common_vendor.p({
          stroke: "#4b6646",
          ["stroke-opacity"]: "0.05",
          x1: "0",
          x2: "300",
          y1: "20",
          y2: "20"
        }),
        r: common_vendor.p({
          stroke: "#4b6646",
          ["stroke-opacity"]: "0.05",
          x1: "0",
          x2: "300",
          y1: "50",
          y2: "50"
        }),
        s: common_vendor.p({
          stroke: "#4b6646",
          ["stroke-opacity"]: "0.05",
          x1: "0",
          x2: "300",
          y1: "80",
          y2: "80"
        }),
        t: common_vendor.p({
          viewBox: "0 0 300 100"
        }),
        v: common_vendor.p({
          d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
          fill: "none",
          stroke: "#e2e4d8",
          ["stroke-width"]: "3"
        }),
        w: common_vendor.p({
          d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
          fill: "none",
          stroke: "#4b6646",
          ["stroke-dasharray"]: "45, 100",
          ["stroke-width"]: "3"
        }),
        x: common_vendor.p({
          d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
          fill: "none",
          stroke: "#ccebc2",
          ["stroke-dasharray"]: "25, 100",
          ["stroke-dashoffset"]: "-45",
          ["stroke-width"]: "3"
        }),
        y: common_vendor.p({
          viewBox: "0 0 36 36"
        }),
        z: common_vendor.t(mainCategory.value),
        A: common_vendor.f(categoryData.value, (item, index, i0) => {
          return {
            a: item.color,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.percent),
            d: index
          };
        }),
        B: common_vendor.p({
          type: "vip",
          size: "20",
          color: "#5f6056"
        }),
        C: topExpensiveItems.value.length > 0
      }, topExpensiveItems.value.length > 0 ? {
        D: common_vendor.f(topExpensiveItems.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.buyDate),
            d: common_vendor.t(parseFloat(item.price).toLocaleString()),
            e: item.id || index
          };
        })
      } : {}, {
        E: common_vendor.p({
          type: "help",
          size: "14",
          color: "#5f6056"
        }),
        F: costPerformanceItems.value.length > 0
      }, costPerformanceItems.value.length > 0 ? {
        G: common_vendor.f(costPerformanceItems.value, (item, index, i0) => {
          return {
            a: "fc23ec97-16-" + i0,
            b: common_vendor.p({
              type: "shop",
              size: "20",
              color: index === 0 ? "#4b6646" : "#4f6549"
            }),
            c: index === 0 ? "#ccebc2" : "#d0eac6",
            d: common_vendor.t(item.name),
            e: common_vendor.t(item.area),
            f: common_vendor.t(item.cost),
            g: item.id || index,
            h: index === 0 ? "#4b6646" : "#c2dcb9"
          };
        })
      } : {}, {
        H: common_vendor.p({
          currentTab: 3
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fc23ec97"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statistics/statistics.js.map
