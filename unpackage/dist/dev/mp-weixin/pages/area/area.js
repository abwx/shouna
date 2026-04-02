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
  __name: "area",
  setup(__props) {
    const itemStore = stores_item.useItemStore();
    const showAddPopup = common_vendor.ref(false);
    const isEditMode = common_vendor.ref(false);
    const originalName = common_vendor.ref("");
    const presetColors = ["#10b981", "#f43f5e", "#3b82f6", "#f59e0b", "#a855f7", "#94a3b8", "#f97316"];
    const presetIcons = ["home-filled", "person-filled", "shop-filled", "paperplane-filled", "calendar-filled", "map-filled", "wallet-filled", "box"];
    const newAreaForm = common_vendor.reactive({
      name: "",
      color: "#10b981",
      icon: "home-filled"
    });
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    const areaStats = common_vendor.computed(() => {
      const stats = itemStore.statsByArea;
      return itemStore.areas.map((area) => ({
        ...area,
        count: stats[area.name] || 0
      }));
    });
    const handleEditArea = (area) => {
      isEditMode.value = true;
      originalName.value = area.name;
      newAreaForm.name = area.name;
      newAreaForm.color = area.color || presetColors[0];
      newAreaForm.icon = area.icon || presetIcons[0];
      showAddPopup.value = true;
    };
    const closePopup = () => {
      showAddPopup.value = false;
      setTimeout(() => {
        isEditMode.value = false;
        originalName.value = "";
        newAreaForm.name = "";
        newAreaForm.color = presetColors[0];
        newAreaForm.icon = presetIcons[0];
      }, 200);
    };
    const confirmSaveArea = () => {
      if (!newAreaForm.name.trim()) {
        common_vendor.index.showToast({ title: "请输入区域名称", icon: "none" });
        return;
      }
      const areaData = {
        name: newAreaForm.name.trim(),
        color: newAreaForm.color,
        icon: newAreaForm.icon
      };
      if (isEditMode.value) {
        itemStore.updateArea(originalName.value, areaData);
        common_vendor.index.showToast({ title: "更新成功", icon: "success" });
      } else {
        itemStore.addArea(areaData);
        common_vendor.index.showToast({ title: "添加成功", icon: "success" });
      }
      closePopup();
    };
    const handleDeleteArea = () => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定要删除“${originalName.value}”区域吗？该区域下的物品将不再关联区域。`,
        confirmColor: "#a73b21",
        success: (res) => {
          if (res.confirm) {
            itemStore.deleteArea(originalName.value);
            common_vendor.index.showToast({ title: "已删除", icon: "success" });
            closePopup();
          }
        }
      });
    };
    const filterByArea = (areaName) => {
      common_vendor.index.navigateTo({
        url: `/pages/items/items?area=${areaName}`
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
          type: "plus",
          size: "20",
          color: "#fff"
        }),
        d: common_vendor.o(($event) => showAddPopup.value = true, "ad"),
        e: common_vendor.t(common_vendor.unref(itemStore).areas.length),
        f: common_vendor.f(areaStats.value, (area, index, i0) => {
          return {
            a: "29e38c8f-3-" + i0,
            b: common_vendor.p({
              type: area.icon,
              size: "24",
              color: area.count > 0 ? area.color : "#5d6057"
            }),
            c: area.count > 0 ? "#ccebc2" : "#eeefe5",
            d: "29e38c8f-4-" + i0,
            e: common_vendor.o(($event) => handleEditArea(area), index),
            f: common_vendor.t(area.name),
            g: common_vendor.t(area.count),
            h: index,
            i: common_vendor.o(($event) => filterByArea(area.name), index)
          };
        }),
        g: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#b1b3a8"
        }),
        h: common_vendor.p({
          type: "compose",
          size: "40",
          color: "#5f6056"
        }),
        i: showAddPopup.value
      }, showAddPopup.value ? common_vendor.e({
        j: common_vendor.t(isEditMode.value ? "编辑区域" : "新建区域"),
        k: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#5f6056"
        }),
        l: common_vendor.o(closePopup, "1d"),
        m: newAreaForm.name,
        n: common_vendor.o(($event) => newAreaForm.name = $event.detail.value, "18"),
        o: common_vendor.f(presetColors, (color, k0, i0) => {
          return common_vendor.e({
            a: newAreaForm.color === color
          }, newAreaForm.color === color ? {} : {}, {
            b: color,
            c: color,
            d: newAreaForm.color === color ? 1 : "",
            e: common_vendor.o(($event) => newAreaForm.color = color, color)
          });
        }),
        p: common_vendor.f(presetIcons, (icon, k0, i0) => {
          return {
            a: "29e38c8f-7-" + i0,
            b: common_vendor.p({
              type: icon,
              size: "24",
              color: newAreaForm.icon === icon ? "#4b6646" : "#797c72"
            }),
            c: icon,
            d: newAreaForm.icon === icon ? 1 : "",
            e: common_vendor.o(($event) => newAreaForm.icon = icon, icon)
          };
        }),
        q: isEditMode.value
      }, isEditMode.value ? {
        r: common_vendor.p({
          type: "trash-filled",
          size: "18",
          color: "#a73b21"
        }),
        s: common_vendor.o(handleDeleteArea, "ef")
      } : {}, {
        t: common_vendor.t(isEditMode.value ? "保存修改" : "保存新区域"),
        v: common_vendor.p({
          type: "checkmarkempty",
          size: "18",
          color: "#fff"
        }),
        w: isEditMode.value ? 1 : "",
        x: common_vendor.o(confirmSaveArea, "00"),
        y: common_vendor.o(() => {
        }, "f5"),
        z: common_vendor.o(closePopup, "1b")
      }) : {}, {
        A: common_vendor.p({
          currentTab: 2
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/area/area.js.map
