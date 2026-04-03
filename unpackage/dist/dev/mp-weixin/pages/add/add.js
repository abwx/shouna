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
    const isEditMode = common_vendor.ref(false);
    const editingId = common_vendor.ref("");
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
    const applyItemToForm = (item) => {
      tempFilePath.value = item.image || "";
      formData.name = item.name || "";
      formData.price = item.price || "";
      formData.buyDate = item.buyDate || "";
      formData.productionDate = item.productionDate || "";
      formData.shelfLife = item.shelfLife || "";
      formData.estimatedDays = item.estimatedDays || 365;
      formData.area = item.area || formData.area;
      formData.remark = item.remark || "";
      const nextTags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
      formData.tags.splice(0, formData.tags.length, ...nextTags);
      if (formData.tags.length === 0) {
        formData.tags.push("数码产品");
      }
      const costNum = parseFloat(String(item.cost || "").replace("¥", ""));
      if (Number.isFinite(costNum)) {
        dailyCost.value = costNum.toFixed(2);
      } else {
        calculateCost();
      }
    };
    common_vendor.onLoad((options) => {
      const id = options == null ? void 0 : options.id;
      if (!id)
        return;
      const item = itemStore.items.find((i) => i.id === id);
      if (!item) {
        common_vendor.index.showToast({ title: "找不到该物品", icon: "none" });
        return;
      }
      isEditMode.value = true;
      editingId.value = id;
      applyItemToForm(item);
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
        if (isEditMode.value) {
          itemStore.updateItem(editingId.value, itemToSave);
        } else {
          itemStore.addItem(itemToSave);
        }
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: isEditMode.value ? "更新成功" : "保存成功" });
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
        b: common_vendor.t(isEditMode.value ? "编辑物品" : "添加物品"),
        c: common_vendor.o(goBack, "8e"),
        d: common_vendor.o(handleSave, "67"),
        e: !tempFilePath.value
      }, !tempFilePath.value ? {
        f: common_vendor.p({
          type: "camera-filled",
          size: "32",
          color: "#4b6646"
        })
      } : {
        g: tempFilePath.value
      }, {
        h: common_vendor.o(chooseImage, "80"),
        i: formData.name,
        j: common_vendor.o(($event) => formData.name = $event.detail.value, "4e"),
        k: common_vendor.o([($event) => formData.price = $event.detail.value, calculateCost], "e9"),
        l: formData.price,
        m: common_vendor.t(formData.buyDate || "yyyy/mm/dd"),
        n: !formData.buyDate ? 1 : "",
        o: common_vendor.p({
          type: "calendar",
          size: "18",
          color: "#797c72"
        }),
        p: formData.buyDate,
        q: common_vendor.o(onDateChange, "1b"),
        r: common_vendor.t(formData.productionDate || "yyyy/mm/dd"),
        s: !formData.productionDate ? 1 : "",
        t: common_vendor.p({
          type: "calendar",
          size: "18",
          color: "#797c72"
        }),
        v: formData.productionDate,
        w: common_vendor.o(onProdDateChange, "0a"),
        x: formData.shelfLife,
        y: common_vendor.o(($event) => formData.shelfLife = $event.detail.value, "d2"),
        z: common_vendor.p({
          type: "paperplane-filled",
          size: "64",
          color: "#4b6646"
        }),
        A: common_vendor.p({
          type: "tune-filled",
          size: "20",
          color: "#4b6646"
        }),
        B: common_vendor.o([($event) => formData.estimatedDays = $event.detail.value, calculateCost], "5e"),
        C: formData.estimatedDays,
        D: common_vendor.t(dailyCost.value),
        E: common_vendor.p({
          type: "right",
          size: "14",
          color: "#797c72"
        }),
        F: common_vendor.f(common_vendor.unref(itemStore).areaNames, (areaName, index, i0) => {
          return {
            a: common_vendor.t(areaName),
            b: index,
            c: formData.area === areaName ? 1 : "",
            d: common_vendor.o(($event) => formData.area = areaName, index)
          };
        }),
        G: common_vendor.p({
          type: "plus",
          size: "18",
          color: "#797c72"
        }),
        H: common_vendor.o(handleAddArea, "2c"),
        I: common_vendor.f(common_vendor.unref(itemStore).tags, (tag, index, i0) => {
          return common_vendor.e({
            a: formData.tags.includes(tag)
          }, formData.tags.includes(tag) ? {} : {}, {
            b: common_vendor.t(tag),
            c: index,
            d: formData.tags.includes(tag) ? 1 : "",
            e: common_vendor.o(($event) => toggleTag(tag), index)
          });
        }),
        J: common_vendor.p({
          type: "plus",
          size: "12",
          color: "#797c72"
        }),
        K: common_vendor.o(handleAddTag, "fe"),
        L: formData.remark,
        M: common_vendor.o(($event) => formData.remark = $event.detail.value, "d4"),
        N: common_vendor.t(isEditMode.value ? "保存修改" : "确认保存"),
        O: common_vendor.o(handleSave, "00"),
        P: common_vendor.p({
          d: "M10 50C10 50 30 10 50 10C70 10 90 50 90 50C90 50 70 90 50 90C30 90 10 50 10 50Z",
          stroke: "#5f6056",
          ["stroke-opacity"]: "0.2",
          ["stroke-width"]: "2"
        }),
        Q: common_vendor.p({
          cx: "50",
          cy: "50",
          r: "15",
          stroke: "#5f6056",
          ["stroke-opacity"]: "0.2",
          ["stroke-width"]: "2"
        }),
        R: common_vendor.p({
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
