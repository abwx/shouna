"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_item = require("../../stores/item.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_path = common_vendor.resolveComponent("path");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_easycom_uni_icons2 + _component_path + _component_circle + _component_svg)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const itemStore = stores_item.useItemStore();
    const tempFilePath = common_vendor.ref("");
    const dailyCost = common_vendor.ref("0.00");
    const formData = common_vendor.reactive({
      name: "",
      price: "",
      buyDate: "",
      productionDate: "",
      shelfLife: "",
      estimatedDays: 365,
      area: "客厅",
      tags: ["数码产品"],
      remark: ""
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          tempFilePath.value = res.tempFilePaths[0];
        }
      });
    };
    const onDateChange = (e) => {
      formData.buyDate = e.detail.value;
    };
    const onProdDateChange = (e) => {
      formData.productionDate = e.detail.value;
    };
    const calculateCost = () => {
      const price = parseFloat(formData.price) || 0;
      const days = parseInt(formData.estimatedDays) || 1;
      dailyCost.value = (price / days).toFixed(2);
    };
    const toggleTag = (tag) => {
      const index = formData.tags.indexOf(tag);
      if (index > -1) {
        formData.tags.splice(index, 1);
      } else {
        formData.tags.push(tag);
      }
    };
    const handleAddTag = () => {
      common_vendor.index.showModal({
        title: "添加新标签",
        editable: true,
        placeholderText: "请输入标签名称",
        success: (res) => {
          if (res.confirm && res.content) {
            const newTag = res.content.trim();
            if (newTag) {
              itemStore.addTag(newTag);
              if (!formData.tags.includes(newTag)) {
                formData.tags.push(newTag);
              }
            }
          }
        }
      });
    };
    const handleAddArea = () => {
      common_vendor.index.showModal({
        title: "添加新区域",
        editable: true,
        placeholderText: "请输入区域名称",
        success: (res) => {
          if (res.confirm && res.content) {
            const newArea = res.content.trim();
            if (newArea) {
              itemStore.addArea(newArea);
              formData.area = newArea;
            }
          }
        }
      });
    };
    const handleSave = () => {
      if (!formData.name) {
        common_vendor.index.showToast({ title: "请输入物品名称", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "保存中..." });
      const itemToSave = {
        ...formData,
        image: tempFilePath.value || "https://via.placeholder.com/150",
        // 默认占位图
        cost: `¥${dailyCost.value}`
      };
      setTimeout(() => {
        itemStore.addItem(itemToSave);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "保存成功" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 800);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "arrow-left",
          size: "24",
          color: "#4b6646"
        }),
        b: common_vendor.o(goBack, "d2"),
        c: common_vendor.o(handleSave, "4e"),
        d: !tempFilePath.value
      }, !tempFilePath.value ? {
        e: common_vendor.p({
          type: "camera-filled",
          size: "32",
          color: "#4b6646"
        })
      } : {
        f: tempFilePath.value
      }, {
        g: common_vendor.o(chooseImage, "4b"),
        h: formData.name,
        i: common_vendor.o(($event) => formData.name = $event.detail.value, "c6"),
        j: common_vendor.o([($event) => formData.price = $event.detail.value, calculateCost], "e9"),
        k: formData.price,
        l: common_vendor.t(formData.buyDate || "yyyy/mm/dd"),
        m: !formData.buyDate ? 1 : "",
        n: common_vendor.p({
          type: "calendar",
          size: "18",
          color: "#797c72"
        }),
        o: formData.buyDate,
        p: common_vendor.o(onDateChange, "89"),
        q: common_vendor.t(formData.productionDate || "yyyy/mm/dd"),
        r: !formData.productionDate ? 1 : "",
        s: common_vendor.p({
          type: "calendar",
          size: "18",
          color: "#797c72"
        }),
        t: formData.productionDate,
        v: common_vendor.o(onProdDateChange, "fa"),
        w: formData.shelfLife,
        x: common_vendor.o(($event) => formData.shelfLife = $event.detail.value, "79"),
        y: common_vendor.p({
          type: "paperplane-filled",
          size: "64",
          color: "#4b6646"
        }),
        z: common_vendor.p({
          type: "tune-filled",
          size: "20",
          color: "#4b6646"
        }),
        A: common_vendor.o([($event) => formData.estimatedDays = $event.detail.value, calculateCost], "5e"),
        B: formData.estimatedDays,
        C: common_vendor.t(dailyCost.value),
        D: common_vendor.p({
          type: "right",
          size: "14",
          color: "#797c72"
        }),
        E: common_vendor.f(common_vendor.unref(itemStore).areaNames, (areaName, index, i0) => {
          return {
            a: common_vendor.t(areaName),
            b: index,
            c: formData.area === areaName ? 1 : "",
            d: common_vendor.o(($event) => formData.area = areaName, index)
          };
        }),
        F: common_vendor.p({
          type: "plus",
          size: "18",
          color: "#797c72"
        }),
        G: common_vendor.o(handleAddArea, "e3"),
        H: common_vendor.f(common_vendor.unref(itemStore).tags, (tag, index, i0) => {
          return common_vendor.e({
            a: formData.tags.includes(tag)
          }, formData.tags.includes(tag) ? {} : {}, {
            b: common_vendor.t(tag),
            c: index,
            d: formData.tags.includes(tag) ? 1 : "",
            e: common_vendor.o(($event) => toggleTag(tag), index)
          });
        }),
        I: common_vendor.p({
          type: "plus",
          size: "12",
          color: "#797c72"
        }),
        J: common_vendor.o(handleAddTag, "d7"),
        K: formData.remark,
        L: common_vendor.o(($event) => formData.remark = $event.detail.value, "e1"),
        M: common_vendor.o(handleSave, "94"),
        N: common_vendor.p({
          d: "M10 50C10 50 30 10 50 10C70 10 90 50 90 50C90 50 70 90 50 90C30 90 10 50 10 50Z",
          stroke: "#5f6056",
          ["stroke-opacity"]: "0.2",
          ["stroke-width"]: "2"
        }),
        O: common_vendor.p({
          cx: "50",
          cy: "50",
          r: "15",
          stroke: "#5f6056",
          ["stroke-opacity"]: "0.2",
          ["stroke-width"]: "2"
        }),
        P: common_vendor.p({
          width: "60",
          height: "60",
          viewBox: "0 0 100 100",
          fill: "none"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/add/add.js.map
