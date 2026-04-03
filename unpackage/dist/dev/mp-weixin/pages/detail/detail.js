"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_item = require("../../stores/item.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const itemStore = stores_item.useItemStore();
    const itemId = common_vendor.ref("");
    const item = common_vendor.computed(() => itemStore.items.find((i) => i.id === itemId.value));
    common_vendor.onLoad((options) => {
      if (options.id) {
        itemId.value = options.id;
      }
    });
    const usedDays = common_vendor.computed(() => {
      if (!item.value || !item.value.buyDate)
        return 0;
      const buyDate = new Date(item.value.buyDate);
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - buyDate.getTime();
      return Math.max(0, Math.floor(diff / (1e3 * 60 * 60 * 24)));
    });
    const progress = common_vendor.computed(() => {
      if (!item.value)
        return 0;
      const total = parseInt(item.value.estimatedDays) || 1;
      const p = Math.min(100, Math.floor(usedDays.value / total * 100));
      return p;
    });
    const expiryInfo = common_vendor.computed(() => {
      if (!item.value || !item.value.productionDate || !item.value.shelfLife)
        return null;
      const now = (/* @__PURE__ */ new Date()).getTime();
      const prodDate = new Date(item.value.productionDate).getTime();
      const expiryDate = prodDate + parseInt(item.value.shelfLife) * 24 * 60 * 60 * 1e3;
      const daysLeft = Math.floor((expiryDate - now) / (1e3 * 60 * 60 * 24));
      if (daysLeft < 0)
        return { label: "已过期", color: "#a73b21", daysLeft };
      if (daysLeft <= 30)
        return { label: "即将过期", color: "#e6a23c", daysLeft };
      return { label: "保质期内", color: "#4b6646", daysLeft };
    });
    const expiryDateStr = common_vendor.computed(() => {
      if (!item.value || !item.value.productionDate || !item.value.shelfLife)
        return "";
      const prodDate = new Date(item.value.productionDate).getTime();
      const expiryDate = new Date(prodDate + parseInt(item.value.shelfLife) * 24 * 60 * 60 * 1e3);
      return `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, "0")}-${String(expiryDate.getDate()).padStart(2, "0")}`;
    });
    const expiryProgress = common_vendor.computed(() => {
      if (!item.value || !item.value.productionDate || !item.value.shelfLife)
        return 0;
      const now = (/* @__PURE__ */ new Date()).getTime();
      const prodDate = new Date(item.value.productionDate).getTime();
      const expiryDate = prodDate + parseInt(item.value.shelfLife) * 24 * 60 * 60 * 1e3;
      const total = expiryDate - prodDate;
      const elapsed = now - prodDate;
      return Math.min(100, Math.max(0, Math.floor(elapsed / total * 100)));
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const handleDelete = () => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个物品吗？",
        success: (res) => {
          if (res.confirm) {
            itemStore.deleteItem(itemId.value);
            common_vendor.index.showToast({ title: "已删除" });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1e3);
          }
        }
      });
    };
    const handleToggleFavorite = () => {
      itemStore.toggleFavorite(itemId.value);
    };
    const handleEdit = () => {
      common_vendor.index.navigateTo({
        url: `/pages/add/add?id=${itemId.value}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: item.value
      }, item.value ? common_vendor.e({
        b: common_vendor.p({
          type: "arrow-left",
          size: "24",
          color: "#4b6646"
        }),
        c: common_vendor.o(goBack, "f7"),
        d: common_vendor.o(handleToggleFavorite, "70"),
        e: common_vendor.p({
          type: item.value.favorite ? "heart-filled" : "heart",
          size: "26",
          color: item.value.favorite ? "#a73b21" : "#4b6646"
        }),
        f: common_vendor.p({
          type: "share",
          size: "24",
          color: "#4b6646"
        }),
        g: common_vendor.p({
          type: "more-filled",
          size: "24",
          color: "#4b6646"
        }),
        h: item.value.image,
        i: item.value.favorite
      }, item.value.favorite ? {
        j: common_vendor.p({
          type: "heart-filled",
          size: "14",
          color: "#4b6646"
        })
      } : {}, {
        k: common_vendor.t(item.value.tags[0] || "默认分类"),
        l: common_vendor.t(item.value.name),
        m: common_vendor.t(item.value.price || "0.00"),
        n: common_vendor.p({
          type: "calendar",
          size: "20",
          color: "#4b6646"
        }),
        o: common_vendor.t(item.value.buyDate || "未知"),
        p: common_vendor.p({
          type: "location-filled",
          size: "20",
          color: "#4b6646"
        }),
        q: common_vendor.t(item.value.area),
        r: item.value.tags && item.value.tags.length > 0
      }, item.value.tags && item.value.tags.length > 0 ? {
        s: common_vendor.f(item.value.tags, (tag, index, i0) => {
          return {
            a: "815d6bdc-7-" + i0,
            b: common_vendor.t(tag),
            c: index
          };
        }),
        t: common_vendor.p({
          type: "paperplane",
          size: "12",
          color: "#5d6057"
        })
      } : {}, {
        v: item.value.productionDate && item.value.shelfLife
      }, item.value.productionDate && item.value.shelfLife ? common_vendor.e({
        w: common_vendor.t(expiryInfo.value.label),
        x: expiryInfo.value.color,
        y: common_vendor.t(item.value.productionDate),
        z: common_vendor.t(expiryDateStr.value),
        A: expiryProgress.value + "%",
        B: expiryInfo.value.color,
        C: expiryInfo.value.daysLeft >= 0
      }, expiryInfo.value.daysLeft >= 0 ? {
        D: common_vendor.t(expiryInfo.value.daysLeft)
      } : {
        E: common_vendor.t(Math.abs(expiryInfo.value.daysLeft))
      }) : {}, {
        F: common_vendor.p({
          type: "info",
          size: "20",
          color: "rgba(75, 102, 70, 0.4)"
        }),
        G: common_vendor.t((item.value.cost || "¥0.00").replace("¥", "")),
        H: common_vendor.t(item.value.estimatedDays),
        I: common_vendor.t(usedDays.value),
        J: progress.value + "%",
        K: common_vendor.t(Math.max(0, item.value.estimatedDays - usedDays.value)),
        L: common_vendor.t(progress.value),
        M: item.value.remark
      }, item.value.remark ? {
        N: common_vendor.t(item.value.remark)
      } : {}, {
        O: common_vendor.p({
          type: "trash",
          size: "20",
          color: "#a73b21"
        }),
        P: common_vendor.o(handleDelete, "a2"),
        Q: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#ffffff"
        }),
        R: common_vendor.o(handleEdit, "69")
      }) : {
        S: common_vendor.p({
          type: "info",
          size: "64",
          color: "#eeefe5"
        }),
        T: common_vendor.o(goBack, "92")
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
