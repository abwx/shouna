"use strict";
const common_vendor = require("../../common/vendor.js");
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
  __name: "setting",
  setup(__props) {
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    const dataSettings = [
      { label: "数据备份", icon: "cloud-upload-filled", danger: false },
      { label: "导出记录", icon: "redo-filled", danger: false },
      { label: "恢复数据", icon: "refresh-filled", danger: false },
      { label: "清空所有内容", icon: "trash-filled", danger: true }
    ];
    const handleItemClick = (item) => {
      if (item.danger) {
        common_vendor.index.showModal({
          title: "确认清空",
          content: "此操作将永久删除所有收纳数据，无法恢复。",
          confirmColor: "#a73b21"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
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
          type: "right",
          size: "20",
          color: "#b1b3a8"
        }),
        d: common_vendor.f(dataSettings, (item, index, i0) => {
          return {
            a: "018cdf56-3-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "20",
              color: item.danger ? "#a73b21" : "#4b6646"
            }),
            c: item.danger ? 1 : "",
            d: common_vendor.t(item.label),
            e: item.danger ? 1 : "",
            f: "018cdf56-4-" + i0,
            g: common_vendor.p({
              type: "right",
              size: "14",
              color: item.danger ? "rgba(167, 59, 33, 0.4)" : "#b1b3a8"
            }),
            h: index,
            i: common_vendor.o(($event) => handleItemClick(item), index)
          };
        }),
        e: common_vendor.p({
          type: "color-filled",
          size: "32",
          color: "#4b6646"
        }),
        f: common_vendor.p({
          type: "list",
          size: "32",
          color: "#4b6646"
        }),
        g: common_vendor.p({
          type: "wallet-filled",
          size: "24",
          color: "#4b6646"
        }),
        h: common_vendor.p({
          type: "paperplane",
          size: "18",
          color: "#b1b3a8"
        }),
        i: common_vendor.p({
          type: "chat-filled",
          size: "18",
          color: "#b1b3a8"
        }),
        j: common_vendor.p({
          type: "leaf-filled",
          size: "36",
          color: "rgba(95, 96, 86, 0.3)"
        }),
        k: common_vendor.p({
          currentTab: 4
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-018cdf56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/setting/setting.js.map
