<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left">
				<uni-icons type="shop-filled" size="24" color="#4b6646"></uni-icons>
				<text class="nav-title">MAD收纳</text>
			</view>
			<view class="nav-right">
				<uni-icons type="search" size="24" color="#4b6646"></uni-icons>
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

				<!-- 概览卡片 -->
				<view class="overview-section">
					<view class="card-total">
						<view class="total-info">
							<text class="label">{{ timeRanges[currentTimeRange] }}总花费</text>
							<text class="amount">¥{{ (totalValueByTime).toLocaleString() }}</text>
							<view class="trend">
								<uni-icons :type="trendValue >= 0 ? 'trending-up' : 'trending-down'" size="14" :color="trendValue >= 0 ? '#4b6646' : '#a73b21'"></uni-icons>
								<text class="trend-text" :style="{ color: trendValue >= 0 ? '#4b6646' : '#a73b21' }">
									较上{{ timeRanges[currentTimeRange] }}{{ trendValue >= 0 ? '增长' : '下降' }} {{ Math.abs(trendValue) }}%
								</text>
							</view>
						</view>
						<!-- 手绘背景线 -->
						<svg class="bg-svg" viewBox="0 0 100 100">
							<path d="M10,90 Q30,10 90,40" fill="none" stroke="#4b6646" stroke-opacity="0.1" stroke-linecap="round" stroke-width="2"></path>
						</svg>
					</view>
					<view class="overview-grid">
						<view class="card-small">
							<text class="label">资产估值</text>
							<text class="value">¥{{ (totalValueByTime / 1000).toFixed(1) }}k</text>
						</view>
						<view class="card-small">
							<text class="label">平均{{ timeRanges[currentTimeRange] === '年' ? '月' : '日' }}支出</text>
							<text class="value">¥{{ averageByTime.toFixed(2) }}</text>
						</view>
					</view>
				</view>

				<!-- 图表部分 -->
				<view class="charts-section">
					<!-- 趋势图 -->
					<view class="chart-card">
						<view class="chart-header">
							<text class="chart-title">消费趋势 (近30天)</text>
							<text class="chart-subtitle">手绘视图</text>
						</view>
						<view class="line-chart-box">
							<svg class="line-chart-svg" viewBox="0 0 300 100">
								<path class="hand-drawn-path" d="M0,80 Q20,75 40,85 T80,60 T120,70 T160,40 T200,50 T240,20 T300,30" fill="none" stroke="#4b6646" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path>
								<line stroke="#4b6646" stroke-opacity="0.05" x1="0" x2="300" y1="20" y2="20"></line>
								<line stroke="#4b6646" stroke-opacity="0.05" x1="0" x2="300" y1="50" y2="50"></line>
								<line stroke="#4b6646" stroke-opacity="0.05" x1="0" x2="300" y1="80" y2="80"></line>
							</svg>
						</view>
						<view class="chart-labels">
							<text>10月01日</text>
							<text>10月15日</text>
							<text>今天</text>
						</view>
					</view>

					<!-- 环形图 -->
					<view class="chart-card donut-card">
						<view class="donut-box">
							<svg class="donut-svg" viewBox="0 0 36 36">
								<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e4d8" stroke-width="3"></path>
								<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4b6646" stroke-dasharray="45, 100" stroke-width="3"></path>
								<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ccebc2" stroke-dasharray="25, 100" stroke-dashoffset="-45" stroke-width="3"></path>
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
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useItemStore } from '@/stores/item';
import TabBar from '@/components/tab-bar/tab-bar.vue';

const itemStore = useItemStore();

onShow(() => {
	uni.hideTabBar();
});

const timeRanges = ['周', '月', '年'];
const currentTimeRange = ref(1);

const filteredItemsByTime = computed(() => {
	const now = new Date();
	const items = itemStore.items;
	
	return items.filter(item => {
		if (!item.buyDate) return false;
		const buyDate = new Date(item.buyDate);
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
	// 模拟趋势数据，实际应用中需要对比上一个周期
	return currentTimeRange.value === 0 ? 5.2 : currentTimeRange.value === 1 ? 12.5 : -2.4;
});

const mainCategory = computed(() => {
	if (filteredItemsByTime.value.length === 0) return '无';
	const counts = {};
	filteredItemsByTime.value.forEach(item => {
		const cat = item.tags[0] || '默认';
		counts[cat] = (counts[cat] || 0) + 1;
	});
	return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
});

const categoryData = computed(() => {
	if (filteredItemsByTime.value.length === 0) return [];
	const counts = {};
	filteredItemsByTime.value.forEach(item => {
		const cat = item.tags[0] || '其他';
		counts[cat] = (counts[cat] || 0) + 1;
	});
	const total = filteredItemsByTime.value.length;
	const colors = ['#4b6646', '#ccebc2', '#e2e4d8', '#5f6056'];
	return Object.entries(counts).map(([name, count], index) => ({
		name,
		percent: Math.round((count / total) * 100),
		color: colors[index % colors.length]
	}));
});

const topExpensiveItems = computed(() => {
	return [...filteredItemsByTime.value]
		.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
		.slice(0, 5);
});

const costPerformanceItems = computed(() => {
	return [...filteredItemsByTime.value]
		.sort((a, b) => parseFloat(a.cost.replace('¥', '')) - parseFloat(b.cost.replace('¥', '')))
		.slice(0, 5);
});
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
	padding: 0 $shouna-page-padding;
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
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	margin-bottom: 64rpx;

	.card-total {
		background-color: rgba(204, 235, 194, 0.4);
		padding: 48rpx;
		border-radius: 32rpx;
		position: relative;
		overflow: hidden;

		.total-info {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;

			.label {
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(62, 88, 57, 0.8);
				margin-bottom: 8rpx;
			}

			.amount {
				font-size: 72rpx;
				font-weight: 800;
				color: $shouna-on-primary-container;
			}

			.trend {
				margin-top: 32rpx;
				display: flex;
				align-items: center;
				gap: 8rpx;

				.trend-text {
					font-size: 24rpx;
					font-weight: 600;
					color: $shouna-primary;
				}
			}
		}

		.bg-svg {
			position: absolute;
			right: -32rpx;
			bottom: -32rpx;
			width: 256rpx;
			height: 256rpx;
		}
	}

	.overview-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32rpx;

		.card-small {
			background-color: $shouna-surface-container-low;
			padding: 40rpx;
			border-radius: 32rpx;
			display: flex;
			flex-direction: column;

			.label {
				font-size: 24rpx;
				font-weight: 500;
				color: $shouna-tertiary;
				margin-bottom: 8rpx;
			}

			.value {
				font-size: 40rpx;
				font-weight: 700;
				color: $shouna-on-surface;
			}
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

			.line-chart-svg {
				width: 100%;
				height: 100%;
				overflow: visible;
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
