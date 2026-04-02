"use strict";
const common_vendor = require("../common/vendor.js");
const useItemStore = common_vendor.defineStore("item", {
  state: () => ({
    items: common_vendor.index.getStorageSync("shouna_items") || [],
    categories: ["全部", "常用", "闲置", "耗材", "贵重"],
    areas: common_vendor.index.getStorageSync("shouna_areas") || [
      { name: "客厅", icon: "home-filled", color: "#4b6646" },
      { name: "卧室", icon: "person-filled", color: "#4b6646" },
      { name: "厨房", icon: "shop-filled", color: "#4b6646" },
      { name: "书房", icon: "paperplane-filled", color: "#4b6646" },
      { name: "卫生间", icon: "calendar-filled", color: "#4b6646" },
      { name: "阳台", icon: "map-filled", color: "#4b6646" }
    ],
    tags: common_vendor.index.getStorageSync("shouna_tags") || ["数码产品", "高频使用", "易碎品", "服装", "日用品"],
    searchFocus: false
  }),
  getters: {
    totalCount: (state) => state.items.length,
    totalValue: (state) => state.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0),
    favoriteItems: (state) => state.items.filter((item) => item.favorite),
    recentItems: (state) => state.items.slice(-5).reverse(),
    // 获取区域名称列表（保持向后兼容）
    areaNames: (state) => state.areas.map((a) => a.name || a),
    // 获取过期或临期物品
    expiredItems: (state) => {
      const now = (/* @__PURE__ */ new Date()).getTime();
      return state.items.filter((item) => {
        if (!item.productionDate || !item.shelfLife)
          return false;
        const prodDate = new Date(item.productionDate).getTime();
        const expiryDate = prodDate + parseInt(item.shelfLife) * 24 * 60 * 60 * 1e3;
        return expiryDate < now;
      });
    },
    statsByArea: (state) => {
      const stats = {};
      state.items.forEach((item) => {
        const areaName = item.area;
        stats[areaName] = (stats[areaName] || 0) + 1;
      });
      return stats;
    }
  },
  actions: {
    addItem(item) {
      const newItem = {
        id: Date.now().toString(),
        favorite: false,
        ...item,
        createTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.items.push(newItem);
      this.saveToStorage();
    },
    updateItem(id, updates) {
      const index = this.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...updates };
        this.saveToStorage();
      }
    },
    deleteItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      this.saveToStorage();
    },
    toggleFavorite(id) {
      const item = this.items.find((item2) => item2.id === id);
      if (item) {
        item.favorite = !item.favorite;
        this.saveToStorage();
      }
    },
    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
        this.saveToStorage();
      }
    },
    addArea(area) {
      const areaObj = typeof area === "string" ? { name: area, icon: "location-filled", color: "#4b6646" } : area;
      if (!this.areas.some((a) => (a.name || a) === areaObj.name)) {
        this.areas.push(areaObj);
        this.saveToStorage();
      }
    },
    updateArea(oldName, newAreaData) {
      const index = this.areas.findIndex((a) => (a.name || a) === oldName);
      if (index !== -1) {
        this.areas[index] = { ...newAreaData };
        this.items.forEach((item) => {
          if (item.area === oldName) {
            item.area = newAreaData.name;
          }
        });
        this.saveToStorage();
      }
    },
    deleteArea(name) {
      this.areas = this.areas.filter((a) => (a.name || a) !== name);
      this.saveToStorage();
    },
    saveToStorage() {
      common_vendor.index.setStorageSync("shouna_items", this.items);
      common_vendor.index.setStorageSync("shouna_tags", this.tags);
      common_vendor.index.setStorageSync("shouna_areas", this.areas);
    },
    clearAll() {
      this.items = [];
      this.saveToStorage();
    },
    setSearchFocus(value) {
      this.searchFocus = value;
    }
  }
});
exports.useItemStore = useItemStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/item.js.map
