<template>
	<view class="page-home">
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
				<!-- 问候语 -->
				<view class="greeting-section">
					<text class="sub-greeting">{{ greeting }}</text>
					<text class="main-greeting">今天也要整洁如新。</text>
				</view>

				<!-- 统计卡片网格 -->
				<view class="stats-grid">
					<view class="stats-card" v-for="(item, index) in stats" :key="index">
						<view class="card-header">
							<uni-icons :type="item.icon" size="32" :color="item.color"></uni-icons>
						</view>
						<view class="card-body">
							<view class="num-wrapper">
								<text class="card-num">{{ item.value }}</text>
								<text class="card-unit" v-if="item.unit">{{ item.unit }}</text>
							</view>
							<text class="card-label">{{ item.label }}</text>
						</view>
						<!-- 装饰性 SVG (从设计稿提取) -->
						<view class="card-deco" v-if="index === 0">
							<svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="#5f6056" stroke-width="2" style="opacity: 0.2;">
								<path d="M20,40 Q50,35 80,40 M20,40 L20,80 Q50,85 80,80 L80,40" />
							</svg>
						</view>
					</view>
				</view>

				<!-- 快捷操作 -->
				<view class="action-section">
					<view class="section-header">
						<text class="section-title">快捷操作</text>
						<view class="title-dot"></view>
					</view>
					<view class="action-grid">
						<view class="action-btn primary" @click="goToAdd">
							<uni-icons type="plus-filled" size="28" color="#fff"></uni-icons>
							<text class="action-text">添加物品</text>
						</view>
						<view class="action-btn secondary" @click="handleAction('area')">
							<uni-icons type="location-filled" size="28" color="#30332c"></uni-icons>
							<text class="action-text">区域查看</text>
						</view>
						<view class="action-btn secondary" @click="handleAction('tag')">
							<uni-icons type="paperplane-filled" size="28" color="#30332c"></uni-icons>
							<text class="action-text">标签筛选</text>
						</view>
						<view class="action-btn secondary" @click="handleAction('stats')">
							<uni-icons type="tune-filled" size="28" color="#30332c"></uni-icons>
							<text class="action-text">统计分析</text>
						</view>
					</view>
				</view>

				<!-- 最近收纳 -->
				<view class="recent-section">
					<view class="section-header space-between">
						<text class="section-title">最近收纳</text>
						<text class="view-all" @click="viewAll">查看全部</text>
					</view>
					<scroll-view scroll-x class="recent-scroll" v-if="itemStore.recentItems.length > 0">
						<view class="recent-list">
							<view class="recent-card" v-for="(item, index) in itemStore.recentItems" :key="item.id || index" @click="goToDetail(item)">
								<image class="item-img" :src="item.image" mode="aspectFill"></image>
								<text class="item-name">{{ item.name }}</text>
								<text class="item-cost">日均成本: {{ item.cost }}</text>
							</view>
						</view>
					</scroll-view>
					<view class="empty-recent" v-else>
						<text>还没有收纳记录哦</text>
					</view>
				</view>
				
				<!-- 底部留空，防止被 TabBar 遮挡 -->
				<view class="footer-spacer"></view>
			</view>
		</scroll-view>

		<!-- 底部导航栏 -->
		<tab-bar :currentTab="0"></tab-bar>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useItemStore } from '@/stores/item';
import TabBar from '@/components/tab-bar/tab-bar.vue';

const itemStore = useItemStore();

onShow(() => {
	uni.hideTabBar();
});

const greeting = computed(() => {
	const hour = new Date().getHours();
	if (hour < 6) return '凌晨好, 夜猫子';
	if (hour < 9) return '早安, 收纳大师';
	if (hour < 12) return '上午好, 收纳大师';
	if (hour < 14) return '午安, 收纳大师';
	if (hour < 18) return '下午好, 收纳大师';
	if (hour < 22) return '晚上好, 收纳大师';
	return '夜深了, 晚安';
});

const stats = computed(() => [
	{ label: '总物品数', value: itemStore.totalCount.toLocaleString(), icon: 'list', color: '#4b6646' },
	{ label: '总价值', value: `¥${(itemStore.totalValue / 1000).toFixed(1)}k`, icon: 'wallet-filled', color: '#4f6549' },
	{ label: '日均消耗', value: '¥' + (itemStore.items.reduce((sum, item) => sum + parseFloat(item.cost.replace('¥', '') || 0), 0)).toFixed(1), unit: '/日', icon: 'calendar-filled', color: '#3f5a3a' },
	{ label: '心仪物品', value: itemStore.favoriteItems.length.toString(), icon: 'heart-filled', color: '#5f6056' }
]);

const goToAdd = () => {
	uni.navigateTo({
		url: '/pages/add/add'
	});
};

const goToDetail = (item) => {
	uni.navigateTo({
		url: `/pages/detail/detail?id=${item.id}`
	});
};

const viewAll = () => {
	uni.navigateTo({
		url: '/pages/items/items'
	});
};

const handleAction = (type) => {
	if (type === 'stats') {
		uni.switchTab({ url: '/pages/statistics/statistics' });
	} else if (type === 'area') {
		uni.switchTab({ url: '/pages/area/area' });
	} else if (type === 'tag') {
		itemStore.setSearchFocus(true);
		uni.switchTab({ url: '/pages/items/items' });
	} else {
		console.log('Action:', type);
	}
};
</script>

<style lang="scss">
	.page-home {
		background-color: $shouna-background;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
	}

	/* 顶部导航 */
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

	/* 问候语 */
	.greeting-section {
		margin-bottom: 60rpx;
		
		.sub-greeting {
			font-size: 28rpx;
			color: $shouna-tertiary;
			margin-bottom: 8rpx;
			display: block;
		}
		
		.main-greeting {
			font-size: 48rpx;
			font-weight: bold;
			color: $shouna-on-surface;
			display: block;
			letter-spacing: -1rpx;
		}
	}

	/* 统计卡片 */
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32rpx;
		margin-bottom: 80rpx;
		
		.stats-card {
			background-color: $shouna-surface-container-low;
			padding: 32rpx;
			border-radius: 48rpx;
			min-height: 240rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: relative;
			overflow: hidden;
			
			.num-wrapper {
				display: flex;
				align-items: baseline;
				gap: 4rpx;
				
				.card-num {
					font-size: 52rpx;
					font-weight: bold;
					color: $shouna-on-surface;
				}
				
				.card-unit {
					font-size: 20rpx;
					color: $shouna-tertiary;
				}
			}
			
			.card-label {
				font-size: 20rpx;
				font-weight: 500;
				color: $shouna-tertiary;
			}
			
			.card-deco {
				position: absolute;
				bottom: 10rpx;
				right: 10rpx;
				transform: scale(0.7);
			}
		}
	}

	/* 公用章节标题 */
	.section-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 30rpx;
		
		&.space-between {
			justify-content: space-between;
			align-items: flex-end;
		}
		
		.section-title {
			font-size: 34rpx;
			font-weight: bold;
			color: $shouna-on-surface;
		}
		
		.title-dot {
			width: 10rpx;
			height: 10rpx;
			background-color: $shouna-primary-container;
			border-radius: 50%;
		}
		
		.view-all {
			font-size: 22rpx;
			font-weight: 600;
			color: $shouna-primary;
		}
	}

	/* 快捷操作 */
	.action-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20rpx;
		margin-bottom: 80rpx;
		
		.action-btn {
			padding: 28rpx 32rpx;
			border-radius: 40rpx;
			display: flex;
			flex-direction: column;
			gap: 12rpx;
			transition: transform 0.2s;
			
			&:active {
				transform: scale(0.95);
			}
			
			.action-text {
				font-size: 26rpx;
				font-weight: 600;
			}
			
			&.primary {
				background-color: $shouna-primary;
				color: #fff;
				box-shadow: 0 4rpx 12rpx rgba($shouna-primary, 0.1);
			}
			
			&.secondary {
				background-color: $shouna-surface-container-low;
				color: $shouna-on-surface;
			}
		}
	}

	/* 最近收纳 */
	.recent-scroll {
		width: 100%;
		white-space: nowrap;
		margin: 0 (-$shouna-page-padding);
		padding: 0 $shouna-page-padding;
		box-sizing: border-box;
		
		.recent-list {
			display: inline-flex;
			gap: 24rpx;
			padding-bottom: 40rpx;
		}
		
		.recent-card {
			width: 260rpx;
			background-color: #fff;
			border-radius: 32rpx;
			padding: 20rpx;
			box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.03);
			border: 1rpx solid rgba($shouna-tertiary, 0.05);
			
			.item-img {
				width: 100%;
				height: 200rpx;
				border-radius: 20rpx;
				margin-bottom: 20rpx;
			}
			
			.item-name {
				font-size: 26rpx;
				font-weight: bold;
				color: $shouna-on-surface;
				display: block;
				margin-bottom: 4rpx;
			}
			
			.item-cost {
				font-size: 18rpx;
				color: $shouna-tertiary;
			}
		}
	}
	
	.empty-recent {
		padding: 40rpx 0;
		text-align: center;
		color: $shouna-tertiary;
		font-size: 24rpx;
	}

	.footer-spacer {
		height: 200rpx;
	}
</style>
