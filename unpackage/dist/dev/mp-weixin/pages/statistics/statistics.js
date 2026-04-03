"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_item = require("../../stores/item.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_easycom_uni_icons2 + _component_path + _component_svg)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + TabBar)();
}
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = {
  __name: "statistics",
  setup(__props) {
    const itemStore = stores_item.useItemStore();
    const instance = common_vendor.getCurrentInstance();
    const parseYMD = (str) => {
      if (!str)
        return null;
      const parts = String(str).split("-");
      if (parts.length !== 3)
        return null;
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      const d = Number(parts[2]);
      if (!y || !m || !d)
        return null;
      return new Date(y, m - 1, d);
    };
    const pad2 = (n) => String(n).padStart(2, "0");
    const formatMD = (date) => `${date.getMonth() + 1}月${pad2(date.getDate())}日`;
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
      common_vendor.nextTick$1(() => {
        setTimeout(drawTrendChart, 500);
      });
    });
    const timeRanges = ["周", "月", "年"];
    const currentTimeRange = common_vendor.ref(1);
    const trendConfig = common_vendor.computed(() => {
      if (currentTimeRange.value === 0)
        return { type: "day", days: 7, points: 7, text: "7天" };
      if (currentTimeRange.value === 1)
        return { type: "day", days: 30, points: 12, text: "30天" };
      return { type: "month", days: 365, points: 12, text: "12个月" };
    });
    const trendRangeText = common_vendor.computed(() => trendConfig.value.text);
    const chartDates = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      if (trendConfig.value.type === "month") {
        const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const mid = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        return [`${start.getFullYear()}-${pad2(start.getMonth() + 1)}`, `${mid.getFullYear()}-${pad2(mid.getMonth() + 1)}`, "本月"];
      }
      const startDate = new Date(now.getTime() - (trendConfig.value.days - 1) * 24 * 60 * 60 * 1e3);
      const midDate = new Date(now.getTime() - Math.floor(trendConfig.value.days / 2) * 24 * 60 * 60 * 1e3);
      return [formatMD(startDate), formatMD(midDate), "今天"];
    });
    const filteredItemsByTime = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      const items = itemStore.items;
      return items.filter((item) => {
        if (!item.buyDate)
          return false;
        const buyDate = parseYMD(item.buyDate);
        if (!buyDate)
          return false;
        const diffMs = now - buyDate;
        const diffDays = diffMs / (1e3 * 60 * 60 * 24);
        if (currentTimeRange.value === 0)
          return diffDays <= 7;
        if (currentTimeRange.value === 1)
          return diffDays <= 30;
        if (currentTimeRange.value === 2)
          return diffDays <= 365;
        return true;
      });
    });
    const totalValueByTime = common_vendor.computed(() => {
      return filteredItemsByTime.value.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    });
    const averageByTime = common_vendor.computed(() => {
      if (filteredItemsByTime.value.length === 0)
        return 0;
      const total = totalValueByTime.value;
      if (currentTimeRange.value === 0)
        return total / 7;
      if (currentTimeRange.value === 1)
        return total / 30;
      return total / 12;
    });
    const trendValue = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      const days = currentTimeRange.value === 0 ? 7 : currentTimeRange.value === 1 ? 30 : 365;
      const currStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1e3);
      const prevStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1e3);
      const prevEnd = currStart;
      const sumBetween = (start, end) => {
        return itemStore.items.reduce((sum, item) => {
          const buyDate = parseYMD(item.buyDate);
          if (!buyDate)
            return sum;
          if (buyDate >= start && buyDate < end) {
            return sum + (parseFloat(item.price) || 0);
          }
          return sum;
        }, 0);
      };
      const curr = sumBetween(currStart, now);
      const prev = sumBetween(prevStart, prevEnd);
      if (prev === 0)
        return curr === 0 ? 0 : 100;
      const pct = (curr - prev) / prev * 100;
      return parseFloat(pct.toFixed(1));
    });
    const mainCategory = common_vendor.computed(() => {
      if (filteredItemsByTime.value.length === 0)
        return "无";
      const sums = {};
      filteredItemsByTime.value.forEach((item) => {
        const cat = item.tags && item.tags[0] ? item.tags[0] : "其他";
        sums[cat] = (sums[cat] || 0) + (parseFloat(item.price) || 0);
      });
      return Object.entries(sums).sort((a, b) => b[1] - a[1])[0][0] || "无";
    });
    const categoryData = common_vendor.computed(() => {
      if (filteredItemsByTime.value.length === 0)
        return [];
      const sums = {};
      filteredItemsByTime.value.forEach((item) => {
        const cat = item.tags && item.tags[0] ? item.tags[0] : "其他";
        sums[cat] = (sums[cat] || 0) + (parseFloat(item.price) || 0);
      });
      const total = totalValueByTime.value;
      const colors = ["#4b6646", "#ccebc2", "#e2e4d8", "#5f6056"];
      return Object.entries(sums).sort((a, b) => b[1] - a[1]).map(([name, value], index) => {
        const ratio = total ? value / total * 100 : 0;
        return {
          name,
          value,
          ratio: parseFloat(ratio.toFixed(2)),
          percent: Math.round(ratio),
          color: colors[index % colors.length]
        };
      });
    });
    const donutSegments = common_vendor.computed(() => {
      const top = categoryData.value.slice(0, 3).filter((i) => i.ratio > 0);
      let offset = 0;
      return top.map((seg) => {
        const dashoffset = -offset;
        offset += seg.ratio;
        return { ...seg, dashoffset };
      });
    });
    const topExpensiveItems = common_vendor.computed(() => {
      return [...filteredItemsByTime.value].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 5);
    });
    const costPerformanceItems = common_vendor.computed(() => {
      return [...filteredItemsByTime.value].sort((a, b) => {
        const costA = parseFloat((a.cost || "¥0.00").replace("¥", "") || 0);
        const costB = parseFloat((b.cost || "¥0.00").replace("¥", "") || 0);
        return costA - costB;
      }).slice(0, 5);
    });
    const trendSeriesY = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      const conf = trendConfig.value;
      const items = itemStore.items;
      const totals = [];
      if (conf.type === "month") {
        const buckets = Array.from({ length: conf.points }, (_, idx) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (conf.points - 1 - idx), 1);
          return { y: d.getFullYear(), m: d.getMonth() };
        });
        buckets.forEach((b) => {
          const sum = items.reduce((acc, item) => {
            const buyDate = parseYMD(item.buyDate);
            if (!buyDate)
              return acc;
            if (buyDate.getFullYear() === b.y && buyDate.getMonth() === b.m) {
              return acc + (parseFloat(item.price) || 0);
            }
            return acc;
          }, 0);
          totals.push(sum);
        });
      } else {
        const days = conf.days;
        const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1e3);
        const dayTotals = [];
        for (let i = 0; i < days; i++) {
          const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
          const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
          const sum = items.reduce((acc, item) => {
            const buyDate = parseYMD(item.buyDate);
            if (!buyDate)
              return acc;
            const itemKey = `${buyDate.getFullYear()}-${pad2(buyDate.getMonth() + 1)}-${pad2(buyDate.getDate())}`;
            if (itemKey === key)
              return acc + (parseFloat(item.price) || 0);
            return acc;
          }, 0);
          dayTotals.push(sum);
        }
        if (conf.points >= dayTotals.length) {
          totals.push(...dayTotals);
        } else {
          const groupSize = Math.ceil(dayTotals.length / conf.points);
          for (let i = 0; i < dayTotals.length; i += groupSize) {
            totals.push(dayTotals.slice(i, i + groupSize).reduce((a, b) => a + b, 0));
          }
        }
      }
      const max = Math.max(...totals, 0);
      const safeMax = max > 0 ? max : 1;
      return totals.map((v) => 100 - v / safeMax * 100);
    });
    const drawTrendChart = () => {
      const ctx = common_vendor.index.createCanvasContext("trendCanvas", instance);
      if (!ctx)
        return;
      const data = trendSeriesY.value;
      if (!data || data.length < 2)
        return;
      const query = common_vendor.index.createSelectorQuery().in(instance);
      query.select(".trend-canvas").boundingClientRect((res) => {
        if (!res || !res.width || !res.height)
          return;
        const w = res.width;
        const h = res.height;
        const step = w / (data.length - 1);
        ctx.setStrokeStyle("rgba(75, 102, 70, 0.1)");
        ctx.setLineWidth(1);
        [20, 50, 80].forEach((yPercent) => {
          const y = yPercent / 100 * h;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        });
        ctx.stroke();
        ctx.beginPath();
        ctx.setStrokeStyle("#4b6646");
        ctx.setLineWidth(3);
        ctx.setLineCap("round");
        ctx.setLineJoin("round");
        data.forEach((val, i) => {
          const x = i * step;
          const y = val / 100 * h;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
        const lastIdx = data.length - 1;
        const lastX = lastIdx * step;
        const lastY = data[lastIdx] / 100 * h;
        ctx.beginPath();
        ctx.setFillStyle("#4b6646");
        ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, "rgba(75, 102, 70, 0.2)");
        gradient.addColorStop(1, "rgba(75, 102, 70, 0)");
        ctx.setFillStyle(gradient);
        ctx.moveTo(0, h);
        data.forEach((val, i) => {
          ctx.lineTo(i * step, val / 100 * h);
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
        ctx.draw();
      }).exec();
    };
    common_vendor.watch(currentTimeRange, () => {
      common_vendor.nextTick$1(() => {
        setTimeout(drawTrendChart, 100);
      });
    });
    common_vendor.watch(
      () => itemStore.items,
      () => {
        common_vendor.nextTick$1(() => {
          setTimeout(drawTrendChart, 100);
        });
      },
      { deep: true }
    );
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "shop-filled",
          size: "24",
          color: "#4b6646"
        }),
        b: common_vendor.f(timeRanges, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.n({
              active: currentTimeRange.value === index
            }),
            d: common_vendor.o(($event) => currentTimeRange.value = index, index)
          };
        }),
        c: common_vendor.t(timeRanges[currentTimeRange.value]),
        d: common_vendor.t(totalValueByTime.value.toLocaleString()),
        e: common_vendor.p({
          type: trendValue.value >= 0 ? "trending-up" : "trending-down",
          size: "14",
          color: trendValue.value >= 0 ? "#4b6646" : "#a73b21"
        }),
        f: common_vendor.t(Math.abs(trendValue.value)),
        g: trendValue.value >= 0 ? "#4b6646" : "#a73b21",
        h: common_vendor.p({
          d: "M10,90 Q30,10 90,40",
          fill: "none",
          stroke: "#4b6646",
          ["stroke-opacity"]: "0.1",
          ["stroke-linecap"]: "round",
          ["stroke-width"]: "2"
        }),
        i: common_vendor.p({
          viewBox: "0 0 100 100"
        }),
        j: common_vendor.t((totalValueByTime.value / 1e3).toFixed(1)),
        k: common_vendor.t(timeRanges[currentTimeRange.value] === "年" ? "月" : "日"),
        l: common_vendor.t(averageByTime.value.toFixed(0)),
        m: common_vendor.t(trendRangeText.value),
        n: common_vendor.f(chartDates.value, (date, dIndex, i0) => {
          return {
            a: common_vendor.t(date),
            b: dIndex
          };
        }),
        o: common_vendor.p({
          d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
          fill: "none",
          stroke: "#e2e4d8",
          ["stroke-width"]: "3"
        }),
        p: common_vendor.f(donutSegments.value, (seg, segIndex, i0) => {
          return {
            a: segIndex,
            b: "fc23ec97-6-" + i0 + ",fc23ec97-4",
            c: common_vendor.p({
              d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831",
              fill: "none",
              stroke: seg.color,
              ["stroke-dasharray"]: `${seg.ratio}, 100`,
              ["stroke-dashoffset"]: seg.dashoffset,
              ["stroke-width"]: "3"
            })
          };
        }),
        q: common_vendor.p({
          viewBox: "0 0 36 36"
        }),
        r: common_vendor.t(mainCategory.value),
        s: common_vendor.f(categoryData.value, (item, index, i0) => {
          return {
            a: item.color,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.percent),
            d: index
          };
        }),
        t: common_vendor.p({
          type: "vip",
          size: "20",
          color: "#5f6056"
        }),
        v: topExpensiveItems.value.length > 0
      }, topExpensiveItems.value.length > 0 ? {
        w: common_vendor.f(topExpensiveItems.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.buyDate),
            d: common_vendor.t(parseFloat(item.price).toLocaleString()),
            e: item.id || index
          };
        })
      } : {}, {
        x: common_vendor.p({
          type: "help",
          size: "14",
          color: "#5f6056"
        }),
        y: costPerformanceItems.value.length > 0
      }, costPerformanceItems.value.length > 0 ? {
        z: common_vendor.f(costPerformanceItems.value, (item, index, i0) => {
          return {
            a: "fc23ec97-9-" + i0,
            b: common_vendor.p({
              type: "shop",
              size: "20",
              color: index === 0 ? "#4b6646" : "#4f6549"
            }),
            c: index === 0 ? "#ccebc2" : "#d0eac6",
            d: common_vendor.t(item.name),
            e: common_vendor.t(item.area),
            f: common_vendor.t(item.cost),
            g: item.id || index,
            h: index === 0 ? "#4b6646" : "#c2dcb9"
          };
        })
      } : {}, {
        A: common_vendor.p({
          currentTab: 3
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fc23ec97"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statistics/statistics.js.map
