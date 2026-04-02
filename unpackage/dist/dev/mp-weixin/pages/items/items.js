"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_item = require("../../stores/item.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + TabBar)();
}
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = {
  __name: "items",
  setup(__props) {
    const itemStore = stores_item.useItemStore();
    const activeCategory = common_vendor.ref(0);
    const searchKeyword = common_vendor.ref("");
    const filterArea = common_vendor.ref("");
    const getExpiryStatus = (item) => {
      if (!item.productionDate || !item.shelfLife)
        return null;
      const now = (/* @__PURE__ */ new Date()).getTime();
      const prodDate = new Date(item.productionDate).getTime();
      const expiryDate = prodDate + parseInt(item.shelfLife) * 24 * 60 * 60 * 1e3;
      const daysLeft = Math.floor((expiryDate - now) / (1e3 * 60 * 60 * 24));
      if (daysLeft < 0)
        return { label: "已过期", color: "#a73b21", bg: "rgba(167, 59, 33, 0.1)" };
      if (daysLeft <= 30)
        return { label: `剩 ${daysLeft} 天`, color: "#e6a23c", bg: "rgba(230, 162, 60, 0.1)" };
      return null;
    };
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
      if (itemStore.searchFocus) {
        itemStore.setSearchFocus(false);
      }
    });
    common_vendor.onLoad((options) => {
      if (options.area) {
        filterArea.value = options.area;
        activeCategory.value = 0;
      }
      if (options.tag) {
        searchKeyword.value = options.tag;
      }
    });
    const filteredItems = common_vendor.computed(() => {
      let list = itemStore.items;
      if (filterArea.value) {
        list = list.filter((item) => item.area === filterArea.value);
      }
      const category = itemStore.categories[activeCategory.value];
      if (category !== "全部") {
        list = list.filter((item) => item.tags.includes(category) || category === "常用" && item.favorite);
      }
      if (searchKeyword.value) {
        const kw = searchKeyword.value.toLowerCase();
        list = list.filter(
          (item) => item.name.toLowerCase().includes(kw) || item.area && item.area.toLowerCase().includes(kw) || item.tags && item.tags.some((t) => t.toLowerCase().includes(kw))
        );
      }
      return list;
    });
    const clearFilter = () => {
      filterArea.value = "";
      searchKeyword.value = "";
      activeCategory.value = 0;
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
        c: common_vendor.p({
          type: "tune",
          size: "28",
          color: "#5d6057"
        }),
        d: common_vendor.p({
          type: "search",
          size: "20",
          color: "#797c72"
        }),
        e: searchKeyword.value,
        f: common_vendor.o(($event) => searchKeyword.value = $event.detail.value, "a7"),
        g: searchKeyword.value
      }, searchKeyword.value ? {
        h: common_vendor.o(($event) => searchKeyword.value = "", "29"),
        i: common_vendor.p({
          type: "close-filled",
          size: "20",
          color: "#797c72"
        })
      } : {}, {
        j: filterArea.value
      }, filterArea.value ? {
        k: common_vendor.t(filterArea.value),
        l: common_vendor.o(($event) => filterArea.value = "", "7e"),
        m: common_vendor.p({
          type: "close",
          size: "14",
          color: "#4b6646"
        }),
        n: common_vendor.o(clearFilter, "10")
      } : {}, {
        o: common_vendor.f(common_vendor.unref(itemStore).categories, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab),
            b: index,
            c: activeCategory.value === index ? 1 : "",
            d: common_vendor.o(($event) => activeCategory.value = index, index)
          };
        }),
        p: filteredItems.value.length > 0
      }, filteredItems.value.length > 0 ? {
        q: common_vendor.f(filteredItems.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.image,
            b: item.favorite
          }, item.favorite ? {
            c: "231e6571-6-" + i0,
            d: common_vendor.p({
              type: "heart-filled",
              size: "10",
              color: "#fff"
            }),
            e: common_vendor.o(($event) => common_vendor.unref(itemStore).toggleFavorite(item.id), item.id || index)
          } : {}, {
            f: common_vendor.t(item.name),
            g: common_vendor.t(item.cost),
            h: "231e6571-7-" + i0,
            i: common_vendor.t(item.location || item.area),
            j: common_vendor.f(item.tags, (tag, tIndex, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tIndex,
                c: tIndex > 0 ? 1 : ""
              };
            }),
            k: getExpiryStatus(item)
          }, getExpiryStatus(item) ? {
            l: common_vendor.t(getExpiryStatus(item).label),
            m: getExpiryStatus(item).bg,
            n: getExpiryStatus(item).color
          } : {}, {
            o: "231e6571-8-" + i0,
            p: item.id || index,
            q: common_vendor.o(($event) => goToDetail(item), item.id || index)
          });
        }),
        r: common_vendor.p({
          type: "location",
          size: "12",
          color: "#797c72"
        }),
        s: common_vendor.p({
          type: "right",
          size: "14",
          color: "#b1b3a8"
        })
      } : {
        t: common_vendor.p({
          type: "info",
          size: "64",
          color: "#eeefe5"
        })
      }, {
        v: filteredItems.value.length > 0
      }, filteredItems.value.length > 0 ? {
        w: common_vendor.p({
          type: "compose",
          size: "40",
          color: "#5f6056"
        })
      } : {}, {
        x: common_vendor.p({
          type: "plus",
          size: "32",
          color: "#fff"
        }),
        y: common_vendor.o(goToAdd, "c3"),
        z: common_vendor.p({
          currentTab: 1
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/items/items.js.map
