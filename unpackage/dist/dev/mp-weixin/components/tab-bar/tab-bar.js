"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "tab-bar",
  props: {
    currentTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tabs: [
        { text: "首页", icon: "home-filled", url: "/pages/index/index" },
        { text: "物品", icon: "list", url: "/pages/items/items" },
        { text: "区域", icon: "location-filled", url: "/pages/area/area" },
        { text: "统计", icon: "bars", url: "/pages/statistics/statistics" },
        { text: "设置", icon: "gear-filled", url: "/pages/setting/setting" }
      ]
    };
  },
  methods: {
    switchTab(index) {
      const url = this.tabs[index].url;
      if (url && index !== this.currentTab) {
        common_vendor.index.switchTab({
          url
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: "7f654a60-0-" + i0,
        b: common_vendor.p({
          type: tab.icon,
          size: "24",
          color: $props.currentTab === index ? "var(--shouna-primary)" : "var(--shouna-tertiary)"
        }),
        c: common_vendor.t(tab.text),
        d: index,
        e: $props.currentTab === index ? 1 : "",
        f: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tab-bar/tab-bar.js.map
