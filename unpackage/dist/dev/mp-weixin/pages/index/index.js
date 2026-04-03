"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_item = require("../../stores/item.js");
const stores_theme = require("../../stores/theme.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_easycom_uni_icons2 + _component_path + _component_svg)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + TabBar)();
}
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const itemStore = stores_item.useItemStore();
    const themeStore = stores_theme.useThemeStore();
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    const greeting = common_vendor.computed(() => {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      if (hour < 6)
        return "凌晨好, 夜猫子";
      if (hour < 9)
        return "早安, 收纳大师";
      if (hour < 12)
        return "上午好, 收纳大师";
      if (hour < 14)
        return "午安, 收纳大师";
      if (hour < 18)
        return "下午好, 收纳大师";
      if (hour < 22)
        return "晚上好, 收纳大师";
      return "夜深了, 晚安";
    });
    const stats = common_vendor.computed(() => [
      { label: "总物品数", value: itemStore.totalCount.toLocaleString(), icon: "list", color: "var(--shouna-primary)", type: "all" },
      { label: "总价值", value: `¥${(itemStore.totalValue / 1e3).toFixed(1)}k`, icon: "wallet-filled", color: "var(--shouna-secondary)", type: "stats" },
      { label: "日均消耗", value: "¥" + itemStore.items.reduce((sum, item) => {
        const costStr = item.cost || "¥0.00";
        return sum + parseFloat(costStr.replace("¥", "") || 0);
      }, 0).toFixed(1), unit: "/日", icon: "calendar-filled", color: "var(--shouna-primary-dim)", type: "stats" },
      { label: "心仪物品", value: itemStore.favoriteItems.length.toString(), icon: "heart-filled", color: "var(--shouna-tertiary)", type: "favorite" }
    ]);
    const handleStatsClick = (type) => {
      if (type === "all") {
        common_vendor.index.switchTab({ url: "/pages/items/items" });
      } else if (type === "favorite") {
        itemStore.setFilterFavorite(true);
        common_vendor.index.switchTab({ url: "/pages/items/items" });
      } else if (type === "stats") {
        common_vendor.index.switchTab({ url: "/pages/statistics/statistics" });
      }
    };
    const goToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/add/add"
      });
    };
    const goToDetail = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`
      });
    };
    const viewAll = () => {
      common_vendor.index.switchTab({
        url: "/pages/items/items"
      });
    };
    const handleAction = (type) => {
      if (type === "stats") {
        common_vendor.index.switchTab({ url: "/pages/statistics/statistics" });
      } else if (type === "area") {
        common_vendor.index.switchTab({ url: "/pages/area/area" });
      } else if (type === "tag") {
        itemStore.setSearchFocus(true);
        common_vendor.index.switchTab({ url: "/pages/items/items" });
      } else {
        common_vendor.index.__f__("log", "at pages/index/index.vue:172", "Action:", type);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "shop-filled",
          size: "24",
          color: "var(--shouna-primary)"
        }),
        b: common_vendor.t(greeting.value),
        c: common_vendor.f(stats.value, (item, index, i0) => {
          return common_vendor.e({
            a: "60d0f950-1-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "32",
              color: item.color
            }),
            c: common_vendor.t(item.value),
            d: item.unit
          }, item.unit ? {
            e: common_vendor.t(item.unit)
          } : {}, {
            f: common_vendor.t(item.label),
            g: index === 0
          }, index === 0 ? {
            h: "60d0f950-3-" + i0 + "," + ("60d0f950-2-" + i0),
            i: common_vendor.p({
              d: "M20,40 Q50,35 80,40 M20,40 L20,80 Q50,85 80,80 L80,40"
            }),
            j: "60d0f950-2-" + i0,
            k: common_vendor.p({
              width: "40",
              height: "40",
              viewBox: "0 0 100 100",
              fill: "none",
              stroke: "#5f6056",
              ["stroke-width"]: "2"
            })
          } : {}, {
            l: index,
            m: common_vendor.o(($event) => handleStatsClick(item.type), index)
          });
        }),
        d: common_vendor.p({
          type: "plus-filled",
          size: "28",
          color: "#fff"
        }),
        e: common_vendor.o(goToAdd, "60"),
        f: common_vendor.p({
          type: "location-filled",
          size: "28",
          color: "#30332c"
        }),
        g: common_vendor.o(($event) => handleAction("area"), "56"),
        h: common_vendor.p({
          type: "paperplane-filled",
          size: "28",
          color: "#30332c"
        }),
        i: common_vendor.o(($event) => handleAction("tag"), "65"),
        j: common_vendor.p({
          type: "tune-filled",
          size: "28",
          color: "#30332c"
        }),
        k: common_vendor.o(($event) => handleAction("stats"), "81"),
        l: common_vendor.o(viewAll, "9a"),
        m: common_vendor.unref(itemStore).recentItems.length > 0
      }, common_vendor.unref(itemStore).recentItems.length > 0 ? {
        n: common_vendor.f(common_vendor.unref(itemStore).recentItems, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.cost),
            d: item.id || index,
            e: common_vendor.o(($event) => goToDetail(item), item.id || index)
          };
        })
      } : {}, {
        o: common_vendor.p({
          currentTab: 0
        }),
        p: common_vendor.s(common_vendor.unref(themeStore).cssVars)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
