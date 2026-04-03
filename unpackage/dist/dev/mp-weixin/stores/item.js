"use strict";
const common_vendor = require("../common/vendor.js");
const useItemStore = common_vendor.defineStore("item", {
  state: () => {
    const savedItems = common_vendor.index.getStorageSync("shouna_items");
    const initialItems = savedItems && savedItems.length > 0 ? savedItems : [
      {
        id: "mock_1",
        name: "iPhone 13 Pro",
        price: "5999",
        area: "客厅",
        category: "贵重",
        tags: ["数码产品", "贵重品"],
        buyDate: "2026-03-15",
        favorite: true,
        estimatedDays: 1825,
        cost: "¥3.29",
        image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400&auto=format&fit=crop",
        createTime: "2026-03-15T10:00:00.000Z",
        remark: "购于官网，希望能用5年"
      },
      {
        id: "mock_2",
        name: "特仑苏纯牛奶",
        price: "65",
        area: "厨房",
        category: "耗材",
        tags: ["日用品", "食品"],
        buyDate: "2026-03-26",
        productionDate: "2026-03-25",
        shelfLife: "15",
        favorite: false,
        estimatedDays: 15,
        cost: "¥4.33",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&auto=format&fit=crop",
        createTime: "2026-03-26T14:00:00.000Z",
        remark: "早晚各一瓶"
      },
      {
        id: "mock_3",
        name: "冬季羽绒服",
        price: "899",
        area: "卧室",
        category: "常用",
        tags: ["服装", "保暖"],
        buyDate: "2025-11-20",
        favorite: false,
        estimatedDays: 1095,
        cost: "¥0.82",
        image: "https://images.unsplash.com/photo-1544022613-e87ce7526ed1?q=80&w=400&auto=format&fit=crop",
        createTime: "2025-11-20T09:00:00.000Z",
        remark: "波司登的，很暖和"
      },
      {
        id: "mock_4",
        name: "机械键盘",
        price: "499",
        area: "书房",
        category: "常用",
        tags: ["数码产品", "外设"],
        buyDate: "2026-02-10",
        favorite: false,
        estimatedDays: 730,
        cost: "¥0.68",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400&auto=format&fit=crop",
        createTime: "2026-02-10T16:00:00.000Z",
        remark: "青轴，打字很有手感"
      },
      {
        id: "mock_5",
        name: "黑咖啡豆",
        price: "128",
        area: "厨房",
        category: "耗材",
        tags: ["日用品", "食品"],
        buyDate: "2026-03-10",
        favorite: false,
        estimatedDays: 30,
        cost: "¥4.27",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop",
        createTime: "2026-03-10T08:30:00.000Z",
        remark: "阿拉比卡豆，深度烘焙"
      }
    ];
    return {
      items: initialItems,
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
      searchFocus: false,
      filterFavorite: false,
      filterArea: ""
    };
  },
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
        if (!areaName)
          return;
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
      this.items.forEach((item) => {
        if (item.area === name) {
          item.area = "";
        }
      });
      this.saveToStorage();
    },
    saveToStorage() {
      common_vendor.index.setStorageSync("shouna_items", JSON.parse(JSON.stringify(this.items)));
      common_vendor.index.setStorageSync("shouna_tags", JSON.parse(JSON.stringify(this.tags)));
      common_vendor.index.setStorageSync("shouna_areas", JSON.parse(JSON.stringify(this.areas)));
    },
    clearAll() {
      this.items = [];
      this.saveToStorage();
    },
    resetAllData() {
      this.items = [];
      this.tags = ["数码产品", "高频使用", "易碎品", "服装", "日用品"];
      this.areas = [
        { name: "客厅", icon: "home-filled", color: "#4b6646" },
        { name: "卧室", icon: "person-filled", color: "#4b6646" },
        { name: "厨房", icon: "shop-filled", color: "#4b6646" },
        { name: "书房", icon: "paperplane-filled", color: "#4b6646" },
        { name: "卫生间", icon: "calendar-filled", color: "#4b6646" },
        { name: "阳台", icon: "map-filled", color: "#4b6646" }
      ];
      common_vendor.index.removeStorageSync("shouna_items");
      common_vendor.index.removeStorageSync("shouna_tags");
      common_vendor.index.removeStorageSync("shouna_areas");
      common_vendor.index.removeStorageSync("shouna_backup");
    },
    importData(data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed.items)
          this.items = parsed.items;
        if (parsed.tags)
          this.tags = parsed.tags;
        if (parsed.areas)
          this.areas = parsed.areas;
        this.saveToStorage();
        return true;
      } catch (e) {
        return false;
      }
    },
    setSearchFocus(value) {
      this.searchFocus = value;
    },
    setFilterFavorite(value) {
      this.filterFavorite = value;
    },
    setFilterArea(value) {
      this.filterArea = value;
    }
  }
});
exports.useItemStore = useItemStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/item.js.map
