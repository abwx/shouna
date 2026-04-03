"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_item = require("../../stores/item.js");
const stores_theme = require("../../stores/theme.js");
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
    const itemStore = stores_item.useItemStore();
    const themeStore = stores_theme.useThemeStore();
    const popup = common_vendor.reactive({
      show: false,
      title: "",
      content: "",
      type: "danger",
      // 'danger' | 'success'
      showCancel: true,
      cancelText: "取消",
      confirmText: "确定",
      confirmCallback: null
    });
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    const openThemePicker = () => {
      const itemList = themeStore.themes.map((t) => `${t.name} (${t.desc})`);
      common_vendor.index.showActionSheet({
        itemList,
        success: (res) => {
          const selected = themeStore.themes[res.tapIndex];
          if (selected)
            themeStore.setTheme(selected.key);
        }
      });
    };
    const dataSettings = [
      { id: "backup", label: "数据备份", icon: "cloud-upload-filled", danger: false },
      { id: "export", label: "导出记录", icon: "redo-filled", danger: false },
      { id: "restore", label: "恢复数据", icon: "refresh-filled", danger: false },
      { id: "clear", label: "清空所有内容", icon: "trash-filled", danger: true }
    ];
    const handleItemClick = (item) => {
      switch (item.id) {
        case "backup":
          handleBackup();
          break;
        case "export":
          handleExport();
          break;
        case "restore":
          handleRestore();
          break;
        case "clear":
          showCustomPopup({
            title: "确认清空",
            content: "此操作将永久删除所有收纳数据及自定义标签/区域，且无法恢复！",
            type: "danger",
            confirmText: "确认清空",
            cancelText: "我再想想",
            confirmCallback: confirmClear
          });
          break;
      }
    };
    const showCustomPopup = (config) => {
      popup.title = config.title || "提示";
      popup.content = config.content || "";
      popup.type = config.type || "success";
      popup.showCancel = config.showCancel !== false;
      popup.cancelText = config.cancelText || "取消";
      popup.confirmText = config.confirmText || "确定";
      popup.confirmCallback = config.confirmCallback || null;
      popup.show = true;
    };
    const closePopup = () => {
      popup.show = false;
    };
    const handlePopupConfirm = () => {
      if (popup.confirmCallback) {
        popup.confirmCallback();
      }
      closePopup();
    };
    const handleBackup = () => {
      const data = {
        items: itemStore.items,
        tags: itemStore.tags,
        areas: itemStore.areas,
        backupTime: (/* @__PURE__ */ new Date()).toLocaleString()
      };
      common_vendor.index.setStorageSync("shouna_backup", data);
      common_vendor.index.showToast({
        title: "备份成功",
        icon: "success"
      });
    };
    const handleExport = () => {
      const data = {
        items: itemStore.items,
        tags: itemStore.tags,
        areas: itemStore.areas,
        exportTime: (/* @__PURE__ */ new Date()).toLocaleString(),
        version: "2.4.0"
      };
      const jsonStr = JSON.stringify(data);
      common_vendor.index.setClipboardData({
        data: jsonStr,
        success: () => {
          showCustomPopup({
            title: "导出成功",
            content: "收纳数据已转换为 JSON 字符串并复制到剪贴板，请妥善保存。",
            type: "success",
            showCancel: false,
            confirmText: "好哒"
          });
        }
      });
    };
    const handleRestore = () => {
      common_vendor.index.showActionSheet({
        itemList: ["从本地备份恢复", "从剪贴板导入"],
        success: (res) => {
          if (res.tapIndex === 0) {
            const backup = common_vendor.index.getStorageSync("shouna_backup");
            if (backup) {
              showCustomPopup({
                title: "确认恢复",
                content: `发现备份于 ${backup.backupTime} 的数据，确认恢复吗？当前数据将被覆盖。`,
                type: "danger",
                confirmText: "确认恢复",
                confirmCallback: () => {
                  if (itemStore.importData(backup)) {
                    common_vendor.index.showToast({ title: "恢复成功", icon: "success" });
                  }
                }
              });
            } else {
              common_vendor.index.showToast({ title: "未发现备份", icon: "none" });
            }
          } else {
            common_vendor.index.getClipboardData({
              success: (clipboardRes) => {
                const data = clipboardRes.data;
                if (data && data.includes("items")) {
                  showCustomPopup({
                    title: "确认导入",
                    content: "识别到合法的收纳数据，确认导入吗？当前数据将被覆盖。",
                    type: "danger",
                    confirmText: "确认导入",
                    confirmCallback: () => {
                      if (itemStore.importData(data)) {
                        common_vendor.index.showToast({ title: "导入成功", icon: "success" });
                      } else {
                        common_vendor.index.showToast({ title: "解析失败", icon: "none" });
                      }
                    }
                  });
                } else {
                  common_vendor.index.showToast({ title: "剪贴板无有效数据", icon: "none" });
                }
              }
            });
          }
        }
      });
    };
    const confirmClear = () => {
      itemStore.resetAllData();
      common_vendor.index.showToast({
        title: "已全部清空",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.reLaunch({ url: "/pages/index/index" });
      }, 1500);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "shop-filled",
          size: "24",
          color: "var(--shouna-primary)"
        }),
        b: common_vendor.p({
          type: "right",
          size: "20",
          color: "#b1b3a8"
        }),
        c: common_vendor.f(dataSettings, (item, index, i0) => {
          return {
            a: "018cdf56-2-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "20",
              color: item.danger ? "#a73b21" : "var(--shouna-primary)"
            }),
            c: item.danger ? 1 : "",
            d: common_vendor.t(item.label),
            e: item.danger ? 1 : "",
            f: "018cdf56-3-" + i0,
            g: common_vendor.p({
              type: "right",
              size: "14",
              color: item.danger ? "rgba(167, 59, 33, 0.4)" : "#b1b3a8"
            }),
            h: index,
            i: common_vendor.o(($event) => handleItemClick(item), index)
          };
        }),
        d: common_vendor.p({
          type: "color-filled",
          size: "32",
          color: "var(--shouna-primary)"
        }),
        e: common_vendor.t(common_vendor.unref(themeStore).currentTheme.name),
        f: common_vendor.t(common_vendor.unref(themeStore).currentTheme.desc),
        g: common_vendor.o(openThemePicker, "1a"),
        h: common_vendor.p({
          type: "list",
          size: "32",
          color: "var(--shouna-primary)"
        }),
        i: common_vendor.p({
          type: "wallet-filled",
          size: "24",
          color: "var(--shouna-primary)"
        }),
        j: common_vendor.p({
          type: "paperplane",
          size: "18",
          color: "#b1b3a8"
        }),
        k: common_vendor.p({
          type: "chat-filled",
          size: "18",
          color: "#b1b3a8"
        }),
        l: common_vendor.p({
          type: "leaf-filled",
          size: "36",
          color: "rgba(95, 96, 86, 0.3)"
        }),
        m: popup.show
      }, popup.show ? common_vendor.e({
        n: common_vendor.t(popup.title),
        o: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#5f6056"
        }),
        p: common_vendor.o(closePopup, "ed"),
        q: common_vendor.p({
          type: popup.type === "danger" ? "info-filled" : "checkbox-filled",
          size: "64",
          color: popup.type === "danger" ? "#a73b21" : "#4b6646"
        }),
        r: common_vendor.t(popup.content),
        s: popup.type === "success" ? 1 : "",
        t: popup.type === "danger" ? 1 : "",
        v: popup.type === "success" ? 1 : "",
        w: popup.type === "danger" ? 1 : "",
        x: popup.showCancel
      }, popup.showCancel ? {
        y: common_vendor.t(popup.cancelText || "取消"),
        z: common_vendor.o(closePopup, "91")
      } : {}, {
        A: common_vendor.t(popup.confirmText || "确定"),
        B: popup.type === "danger"
      }, popup.type === "danger" ? {
        C: common_vendor.p({
          type: "trash-filled",
          size: "18",
          color: "#fff"
        })
      } : {
        D: common_vendor.p({
          type: "checkmarkempty",
          size: "18",
          color: "#fff"
        })
      }, {
        E: common_vendor.n(popup.type === "danger" ? "delete-popup-btn" : "save-popup-btn"),
        F: common_vendor.o(handlePopupConfirm, "9a"),
        G: common_vendor.o(() => {
        }, "dc"),
        H: common_vendor.o(closePopup, "eb")
      }) : {}, {
        I: common_vendor.p({
          currentTab: 4
        }),
        J: common_vendor.s(common_vendor.unref(themeStore).cssVars)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-018cdf56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/setting/setting.js.map
