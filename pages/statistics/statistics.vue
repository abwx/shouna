<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left">
				<uni-icons type="shop-filled" size="24" color="#4b6646"></uni-icons>
				<text class="nav-title">MAD收纳</text>
			</view>
			<view class="nav-right">
			</view>
		</view>

		<scroll-view scroll-y class="main-content">
			<view class="content-wrapper">
				<!-- 标题与切换 -->
				<view class="page-header">
					<text class="page-title">消费统计</text>
					<view class="time-selector">
						<view 
							v-for="(item, index) in timeRanges" 
							:key="index"
							:class="['time-item', { active: currentTimeRange === index }]"
							@tap="currentTimeRange = index"
						>
							{{ item }}
						</view>
					</view>
				</view>

				<!-- 概览卡片 (Bento Grid) -->
				<view class="overview-section">
					<view class="card-total">
						<view class="total-info">
							<text class="label">{{ timeRanges[currentTimeRange] }}总花费</text>
							<text class="amount">¥{{ (totalValueByTime).toLocaleString() }}</text>
							<view class="trend">
								<uni-icons :type="trendValue >= 0 ? 'trending-up' : 'trending-down'" size="14" :color="trendValue >= 0 ? '#4b6646' : '#a73b21'"></uni-icons>
								<text class="trend-text" :style="{ color: trendValue >= 0 ? '#4b6646' : '#a73b21' }">
									{{ Math.abs(trendValue) }}%
								</text>
							</view>
						</view>
						<!-- 手绘背景线 -->
						<svg class="bg-svg" viewBox="0 0 100 100">
							<path d="M10,90 Q30,10 90,40" fill="none" stroke="#4b6646" stroke-opacity="0.1" stroke-linecap="round" stroke-width="2"></path>
						</svg>
					</view>
					
					<view class="card-small asset-card">
						<text class="label">资产估值</text>
						<text class="value">¥{{ (totalValueByTime / 1000).toFixed(1) }}k</text>
					</view>
					
					<view class="card-small avg-card">
						<text class="label">平均{{ timeRanges[currentTimeRange] === '年' ? '月' : '日' }}支出</text>
						<text class="value">¥{{ averageByTime.toFixed(0) }}</text>
					</view>
				</view>

				<!-- 图表部分 -->
				<view class="charts-section">
					<!-- 趋势图 -->
					<view class="chart-card">
						<view class="chart-header">
							<text class="chart-title">消费趋势 (近{{ trendRangeText }})</text>
							<text class="chart-subtitle">折线图</text>
						</view>
						<view class="line-chart-box">
							<canvas canvas-id="trendCanvas" id="trendCanvas" class="trend-canvas"></canvas>
						</view>
						<view class="chart-labels">
							<text v-for="(date, dIndex) in chartDates" :key="dIndex">{{ date }}</text>
						</view>
					</view>

					<!-- 环形图 -->
					<view class="chart-card donut-card">
						<view class="donut-box">
							<svg class="donut-svg" viewBox="0 0 36 36">
								<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e4d8" stroke-width="3"></path>
								<path
									v-for="(seg, segIndex) in donutSegments"
									:key="segIndex"
									d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
									fill="none"
									:stroke="seg.color"
									:stroke-dasharray="`${seg.ratio}, 100`"
									:stroke-dashoffset="seg.dashoffset"
									stroke-width="3"
								></path>
							</svg>
							<view class="donut-center">
								<text class="center-label">主类目</text>
								<text class="center-value">{{ mainCategory }}</text>
							</view>
						</view>
						<view class="legend-box">
							<view class="legend-item" v-for="(item, index) in categoryData" :key="index">
								<view class="legend-left">
									<view class="dot" :style="{ backgroundColor: item.color }"></view>
									<text class="legend-name">{{ item.name }}</text>
								</view>
								<text class="legend-percent">{{ item.percent }}%</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 排行榜部分 -->
				<view class="rankings-section">
					<view class="ranking-group">
						<view class="section-header">
							<text class="section-title">最贵物品 TOP 5</text>
							<uni-icons type="vip" size="20" color="#5f6056"></uni-icons>
						</view>
						<view class="item-list" v-if="topExpensiveItems.length > 0">
							<view class="rank-item" v-for="(item, index) in topExpensiveItems" :key="item.id || index">
								<image :src="item.image" mode="aspectFill" class="item-img"></image>
								<view class="item-info">
									<text class="item-name">{{ item.name }}</text>
									<text class="item-date">购于 {{ item.buyDate }}</text>
								</view>
								<text class="item-price">¥{{ parseFloat(item.price).toLocaleString() }}</text>
							</view>
						</view>
						<view class="empty-list" v-else>
							<text>暂无数据</text>
						</view>
					</view>

					<view class="ranking-group">
						<view class="section-header">
							<text class="section-title">性价比排行</text>
							<view class="header-tip">
								<text>日均使用成本</text>
								<uni-icons type="help" size="14" color="#5f6056"></uni-icons>
							</view>
						</view>
						<view class="cost-performance-list" v-if="costPerformanceItems.length > 0">
							<view 
								v-for="(item, index) in costPerformanceItems" 
								:key="item.id || index"
								class="cp-item"
								:style="{ borderLeftColor: index === 0 ? '#4b6646' : '#c2dcb9' }"
							>
								<view class="cp-left">
									<view class="cp-icon-box" :style="{ backgroundColor: index === 0 ? '#ccebc2' : '#d0eac6' }">
										<uni-icons type="shop" size="20" :color="index === 0 ? '#4b6646' : '#4f6549'"></uni-icons>
									</view>
									<view class="cp-info">
										<text class="cp-name">{{ item.name }}</text>
										<text class="cp-count">区域: {{ item.area }}</text>
									</view>
								</view>
								<view class="cp-right">
									<text class="cp-value">{{ item.cost }}</text>
									<text class="cp-unit">/ 天</text>
								</view>
							</view>
						</view>
						<view class="empty-list" v-else>
							<text>暂无数据</text>
						</view>
					</view>
				</view>
				
				<!-- 底部占位 -->
				<view class="safe-area-bottom"></view>
			</view>
		</scroll-view>

		<!-- 自定义 TabBar -->
		<tab-bar :currentTab="3"></tab-bar>
	</view>
</template>

<script setup>
import { ref, computed, nextTick, getCurrentInstance, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useItemStore } from '@/stores/item';
import TabBar from '@/components/tab-bar/tab-bar.vue';

const itemStore = useItemStore();
const instance = getCurrentInstance();

const parseYMD = (str) => {
	if (!str) return null;
	const parts = String(str).split('-');
	if (parts.length !== 3) return null;
	const y = Number(parts[0]);
	const m = Number(parts[1]);
	const d = Number(parts[2]);
	if (!y || !m || !d) return null;
	return new Date(y, m - 1, d);
};

const pad2 = (n) => String(n).padStart(2, '0');

const formatMD = (date) => `${date.getMonth() + 1}月${pad2(date.getDate())}日`;

onShow(() => {
	uni.hideTabBar();
	nextTick(() => {
		setTimeout(drawTrendChart, 500);
	});
});

const timeRanges = ['周', '月', '年'];
const currentTimeRange = ref(1);

const trendConfig = computed(() => {
	if (currentTimeRange.value === 0) return { type: 'day', days: 7, points: 7, text: '7天' };
	if (currentTimeRange.value === 1) return { type: 'day', days: 30, points: 12, text: '30天' };
	return { type: 'month', days: 365, points: 12, text: '12个月' };
});

const trendRangeText = computed(() => trendConfig.value.text);

const chartDates = computed(() => {
	const now = new Date();
	if (trendConfig.value.type === 'month') {
		const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
		const mid = new Date(now.getFullYear(), now.getMonth() - 5, 1);
		return [`${start.getFullYear()}-${pad2(start.getMonth() + 1)}`, `${mid.getFullYear()}-${pad2(mid.getMonth() + 1)}`, '本月'];
	}

	const startDate = new Date(now.getTime() - (trendConfig.value.days - 1) * 24 * 60 * 60 * 1000);
	const midDate = new Date(now.getTime() - Math.floor(trendConfig.value.days / 2) * 24 * 60 * 60 * 1000);
	return [formatMD(startDate), formatMD(midDate), '今天'];
});

const filteredItemsByTime = computed(() => {
	const now = new Date();
	const items = itemStore.items;
	
	return items.filter(item => {
		if (!item.buyDate) return false;
		const buyDate = parseYMD(item.buyDate);
		if (!buyDate) return false;
		const diffMs = now - buyDate;
		const diffDays = diffMs / (1000 * 60 * 60 * 24);
		
		if (currentTimeRange.value === 0) return diffDays <= 7; // 周
		if (currentTimeRange.value === 1) return diffDays <= 30; // 月
		if (currentTimeRange.value === 2) return diffDays <= 365; // 年
		return true;
	});
});

const totalValueByTime = computed(() => {
	return filteredItemsByTime.value.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
});

const averageByTime = computed(() => {
	if (filteredItemsByTime.value.length === 0) return 0;
	const total = totalValueByTime.value;
	if (currentTimeRange.value === 0) return total / 7;
	if (currentTimeRange.value === 1) return total / 30;
	return total / 12; // 年平均月支出
});

const trendValue = computed(() => {
	const now = new Date();
	const days = currentTimeRange.value === 0 ? 7 : currentTimeRange.value === 1 ? 30 : 365;
	const currStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
	const prevStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
	const prevEnd = currStart;

	const sumBetween = (start, end) => {
		return itemStore.items.reduce((sum, item) => {
			const buyDate = parseYMD(item.buyDate);
			if (!buyDate) return sum;
			if (buyDate >= start && buyDate < end) {
				return sum + (parseFloat(item.price) || 0);
			}
			return sum;
		}, 0);
	};

	const curr = sumBetween(currStart, now);
	const prev = sumBetween(prevStart, prevEnd);
	if (prev === 0) return curr === 0 ? 0 : 100;
	const pct = ((curr - prev) / prev) * 100;
	return parseFloat(pct.toFixed(1));
});

const mainCategory = computed(() => {
	if (filteredItemsByTime.value.length === 0) return '无';
	const sums = {};
	filteredItemsByTime.value.forEach(item => {
		const cat = (item.tags && item.tags[0]) ? item.tags[0] : '其他';
		sums[cat] = (sums[cat] || 0) + (parseFloat(item.price) || 0);
	});
	return Object.entries(sums).sort((a, b) => b[1] - a[1])[0][0] || '无';
});

const categoryData = computed(() => {
	if (filteredItemsByTime.value.length === 0) return [];
	const sums = {};
	filteredItemsByTime.value.forEach(item => {
		const cat = (item.tags && item.tags[0]) ? item.tags[0] : '其他';
		sums[cat] = (sums[cat] || 0) + (parseFloat(item.price) || 0);
	});
	const total = totalValueByTime.value;
	const colors = ['#4b6646', '#ccebc2', '#e2e4d8', '#5f6056'];
	return Object.entries(sums)
		.sort((a, b) => b[1] - a[1])
		.map(([name, value], index) => {
			const ratio = total ? (value / total) * 100 : 0;
			return {
				name,
				value,
				ratio: parseFloat(ratio.toFixed(2)),
				percent: Math.round(ratio),
				color: colors[index % colors.length]
			};
		});
});

const donutSegments = computed(() => {
	const top = categoryData.value.slice(0, 3).filter(i => i.ratio > 0);
	let offset = 0;
	return top.map(seg => {
		const dashoffset = -offset;
		offset += seg.ratio;
		return { ...seg, dashoffset };
	});
});

const topExpensiveItems = computed(() => {
	return [...filteredItemsByTime.value]
		.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
		.slice(0, 5);
});

const costPerformanceItems = computed(() => {
	return [...filteredItemsByTime.value]
		.sort((a, b) => {
			const costA = parseFloat((a.cost || '¥0.00').replace('¥', '') || 0);
			const costB = parseFloat((b.cost || '¥0.00').replace('¥', '') || 0);
			return costA - costB;
		})
		.slice(0, 5);
});

const trendSeriesY = computed(() => {
	const now = new Date();
	const conf = trendConfig.value;
	const items = itemStore.items;

	const totals = [];

	if (conf.type === 'month') {
		const buckets = Array.from({ length: conf.points }, (_, idx) => {
			const d = new Date(now.getFullYear(), now.getMonth() - (conf.points - 1 - idx), 1);
			return { y: d.getFullYear(), m: d.getMonth() };
		});
		buckets.forEach(b => {
			const sum = items.reduce((acc, item) => {
				const buyDate = parseYMD(item.buyDate);
				if (!buyDate) return acc;
				if (buyDate.getFullYear() === b.y && buyDate.getMonth() === b.m) {
					return acc + (parseFloat(item.price) || 0);
				}
				return acc;
			}, 0);
			totals.push(sum);
		});
	} else {
		const days = conf.days;
		const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
		const dayTotals = [];
		for (let i = 0; i < days; i++) {
			const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
			const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
			const sum = items.reduce((acc, item) => {
				const buyDate = parseYMD(item.buyDate);
				if (!buyDate) return acc;
				const itemKey = `${buyDate.getFullYear()}-${pad2(buyDate.getMonth() + 1)}-${pad2(buyDate.getDate())}`;
				if (itemKey === key) return acc + (parseFloat(item.price) || 0);
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
	return totals.map(v => 100 - (v / safeMax) * 100);
});

const drawTrendChart = () => {
	const ctx = uni.createCanvasContext('trendCanvas', instance);
	if (!ctx) return;
	const data = trendSeriesY.value;
	if (!data || data.length < 2) return;

	const query = uni.createSelectorQuery().in(instance);
	query.select('.trend-canvas').boundingClientRect(res => {
		if (!res || !res.width || !res.height) return;

		const w = res.width;
		const h = res.height;
		const step = w / (data.length - 1);

		ctx.setStrokeStyle('rgba(75, 102, 70, 0.1)');
		ctx.setLineWidth(1);
		[20, 50, 80].forEach(yPercent => {
			const y = (yPercent / 100) * h;
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
		});
		ctx.stroke();

		ctx.beginPath();
		ctx.setStrokeStyle('#4b6646');
		ctx.setLineWidth(3);
		ctx.setLineCap('round');
		ctx.setLineJoin('round');

		data.forEach((val, i) => {
			const x = i * step;
			const y = (val / 100) * h;
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		});
		ctx.stroke();

		const lastIdx = data.length - 1;
		const lastX = lastIdx * step;
		const lastY = (data[lastIdx] / 100) * h;

		ctx.beginPath();
		ctx.setFillStyle('#4b6646');
		ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI);
		ctx.fill();

		ctx.beginPath();
		const gradient = ctx.createLinearGradient(0, 0, 0, h);
		gradient.addColorStop(0, 'rgba(75, 102, 70, 0.2)');
		gradient.addColorStop(1, 'rgba(75, 102, 70, 0)');
		ctx.setFillStyle(gradient);

		ctx.moveTo(0, h);
		data.forEach((val, i) => {
			ctx.lineTo(i * step, (val / 100) * h);
		});
		ctx.lineTo(w, h);
		ctx.closePath();
		ctx.fill();

		ctx.draw();
	}).exec();
};

watch(currentTimeRange, () => {
	nextTick(() => {
		setTimeout(drawTrendChart, 100);
	});
});

watch(
	() => itemStore.items,
	() => {
		nextTick(() => {
			setTimeout(drawTrendChart, 100);
		});
	},
	{ deep: true }
);
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: $shouna-background;
	display: flex;
	flex-direction: column;
	overflow-x: hidden;
}

.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 88rpx;
	padding: 0 220rpx 0 $shouna-page-padding; /* 增加右侧内边距，避开微信胶囊按钮 */
	padding-top: var(--status-bar-height);
	background-color: rgba($shouna-background, 0.8);
	backdrop-filter: blur(10px);
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 100;
	
	.nav-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
		
		.nav-title {
			font-size: 40rpx;
			font-weight: 800;
			color: $shouna-primary;
			letter-spacing: -1rpx;
		}
	}
}

.main-content {
	flex: 1;
	padding-top: calc(120rpx + var(--status-bar-height));
}

.content-wrapper {
	padding: 0 $shouna-page-padding;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 48rpx;

	.page-title {
		font-size: 60rpx;
		font-weight: 800;
		color: $shouna-on-surface;
	}

	.time-selector {
		background-color: $shouna-surface-container-low;
		padding: 8rpx;
		border-radius: 100rpx;
		display: flex;
		gap: 8rpx;

		.time-item {
			padding: 12rpx 32rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: $shouna-on-surface-variant;
			border-radius: 100rpx;
			transition: all 0.3s;

			&.active {
				background-color: $shouna-primary-container;
				color: $shouna-on-primary-container;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			}
		}
	}
}

.overview-section {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 24rpx;
	margin-bottom: 64rpx;

	.card-total {
		grid-row: span 2;
		background-color: rgba(204, 235, 194, 0.4);
		padding: 40rpx;
		border-radius: 48rpx;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.total-info {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;

			.label {
				font-size: 24rpx;
				font-weight: 600;
				color: rgba(62, 88, 57, 0.6);
				margin-bottom: 8rpx;
			}

			.amount {
				font-size: 64rpx;
				font-weight: 800;
				color: $shouna-on-primary-container;
				line-height: 1;
			}

			.trend {
				margin-top: 24rpx;
				display: flex;
				align-items: center;
				gap: 4rpx;
				background-color: rgba(255, 255, 255, 0.5);
				width: fit-content;
				padding: 4rpx 16rpx;
				border-radius: 100rpx;

				.trend-text {
					font-size: 20rpx;
					font-weight: 700;
				}
			}
		}

		.bg-svg {
			position: absolute;
			right: -20rpx;
			bottom: -20rpx;
			width: 180rpx;
			height: 180rpx;
			opacity: 0.5;
		}
	}

	.card-small {
		background-color: $shouna-surface-container-low;
		padding: 32rpx;
		border-radius: 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;

		&.asset-card {
			background-color: #f6f7f0;
		}
		
		&.avg-card {
			background-color: #f0f2e8;
		}

		.label {
			font-size: 20rpx;
			font-weight: 600;
			color: $shouna-tertiary;
			margin-bottom: 8rpx;
			text-transform: uppercase;
			letter-spacing: 1rpx;
		}

		.value {
			font-size: 36rpx;
			font-weight: 800;
			color: $shouna-on-surface;
		}
	}
}

.charts-section {
	display: flex;
	flex-direction: column;
	gap: 48rpx;
	margin-bottom: 64rpx;

	.chart-card {
		background-color: $shouna-surface-container-lowest;
		padding: 48rpx;
		border-radius: 32rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);

		.chart-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 48rpx;

			.chart-title {
				font-size: 36rpx;
				font-weight: 700;
				color: $shouna-on-surface;
			}

			.chart-subtitle {
				font-size: 24rpx;
				color: $shouna-tertiary;
				font-style: italic;
			}
		}

		.line-chart-box {
			height: 200rpx;
			margin-bottom: 32rpx;
			background-color: rgba(75, 102, 70, 0.03);
			border-radius: 16rpx;
			overflow: hidden;

			.trend-canvas {
				width: 100%;
				height: 100%;
			}
		}

		.chart-labels {
			display: flex;
			justify-content: space-between;
			font-size: 20rpx;
			color: $shouna-tertiary;
			font-weight: 500;
		}
	}

	.donut-card {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: 48rpx;
		align-items: center;

		.donut-box {
			position: relative;
			aspect-ratio: 1;

			.donut-svg {
				width: 100%;
				height: 100%;
				transform: rotate(-90deg);
			}

			.donut-center {
				position: absolute;
				inset: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.center-label {
					font-size: 20rpx;
					color: $shouna-tertiary;
				}

				.center-value {
					font-size: 28rpx;
					font-weight: 700;
					color: $shouna-on-surface;
				}
			}
		}

		.legend-box {
			display: flex;
			flex-direction: column;
			gap: 24rpx;

			.legend-item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.legend-left {
					display: flex;
					align-items: center;
					gap: 16rpx;

					.dot {
						width: 16rpx;
						height: 16rpx;
						border-radius: 50%;
					}

					.legend-name {
						font-size: 24rpx;
						font-weight: 500;
						color: $shouna-on-surface;
					}
				}

				.legend-percent {
					font-size: 24rpx;
					font-weight: 700;
					color: $shouna-on-surface;
				}
			}
		}
	}
}

.rankings-section {
	display: flex;
	flex-direction: column;
	gap: 64rpx;
	margin-bottom: 120rpx;

	.ranking-group {
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 32rpx;

			.section-title {
				font-size: 36rpx;
				font-weight: 700;
				color: $shouna-on-surface;
			}

			.header-tip {
				display: flex;
				align-items: center;
				gap: 8rpx;
				font-size: 24rpx;
				color: $shouna-tertiary;
			}
		}

		.item-list {
			display: flex;
			flex-direction: column;
			gap: 32rpx;

			.rank-item {
				display: flex;
				align-items: center;
				gap: 32rpx;

				.item-img {
					width: 96rpx;
					height: 96rpx;
					border-radius: 24rpx;
					background-color: $shouna-surface-container-high;
				}

				.item-info {
					flex: 1;
					display: flex;
					flex-direction: column;

					.item-name {
						font-size: 28rpx;
						font-weight: 600;
						color: $shouna-on-surface;
					}

					.item-date {
						font-size: 20rpx;
						color: $shouna-tertiary;
					}
				}

				.item-price {
					font-size: 32rpx;
					font-weight: 700;
					color: $shouna-on-surface;
				}
			}
		}

		.cost-performance-list {
			display: flex;
			flex-direction: column;
			gap: 24rpx;

			.cp-item {
				background-color: $shouna-surface-container;
				padding: 32rpx;
				border-radius: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-left: 8rpx solid transparent;

				.cp-left {
					display: flex;
					align-items: center;
					gap: 24rpx;

					.cp-icon-box {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.cp-info {
						display: flex;
						flex-direction: column;

						.cp-name {
							font-size: 28rpx;
							font-weight: 700;
							color: $shouna-on-surface;
						}

						.cp-count {
							font-size: 20rpx;
							color: $shouna-tertiary;
						}
					}
				}

				.cp-right {
					text-align: right;

					.cp-value {
						font-size: 32rpx;
						font-weight: 700;
						color: $shouna-primary;
					}

					.cp-unit {
						font-size: 20rpx;
						color: $shouna-tertiary;
						display: block;
					}
				}
			}
		}
	}
}

.empty-list {
	padding: 40rpx 0;
	text-align: center;
	color: $shouna-tertiary;
	font-size: 24rpx;
}

.safe-area-bottom {
	height: 200rpx;
}

@keyframes dash {
	to {
		stroke-dashoffset: 0;
	}
}

.hand-drawn-path {
	stroke-dasharray: 1000;
	stroke-dashoffset: 1000;
	animation: dash 3s linear forwards;
}
</style>
