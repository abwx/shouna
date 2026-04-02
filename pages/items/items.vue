<template>
	<view class="page-items">
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
				<!-- 页面标题 & 筛选 -->
				<view class="header-section">
					<view class="title-box">
						<text class="sub-title">Your Inventory</text>
						<text class="main-title">全部物品</text>
					</view>
					<view class="filter-btn">
						<uni-icons type="tune" size="28" color="#5d6057"></uni-icons>
					</view>
				</view>

				<!-- 搜索框 -->
			<view class="search-section">
				<view class="search-input-wrapper">
					<uni-icons type="search" size="20" color="#797c72"></uni-icons>
					<input 
						class="search-input" 
						type="text" 
						placeholder="搜索我的物品..." 
						placeholder-style="color:#797c7299" 
						v-model="searchKeyword"
					/>
					<uni-icons v-if="searchKeyword" type="close-filled" size="20" color="#797c72" @click="searchKeyword = ''"></uni-icons>
				</view>
			</view>

			<!-- 活动筛选展示 -->
			<view class="active-filters" v-if="filterArea">
				<view class="filter-tag">
					<text>区域: {{ filterArea }}</text>
					<uni-icons type="close" size="14" color="#4b6646" @click="filterArea = ''"></uni-icons>
				</view>
				<text class="clear-all" @click="clearFilter">清除全部</text>
			</view>

				<!-- 分类选项卡 -->
				<scroll-view scroll-x class="category-tabs" :show-scrollbar="false">
					<view class="tabs-list">
						<view 
							v-for="(tab, index) in itemStore.categories" 
							:key="index" 
							class="tab-item" 
							:class="{ active: activeCategory === index }"
							@click="activeCategory = index"
						>
							<text>{{ tab }}</text>
						</view>
					</view>
				</scroll-view>

				<!-- 物品列表 (列表形式) -->
				<view class="items-list" v-if="filteredItems.length > 0">
					<view class="item-row" v-for="(item, index) in filteredItems" :key="item.id || index" @click="goToDetail(item)">
						<view class="img-box">
							<image class="item-img" :src="item.image" mode="aspectFill"></image>
							<view class="fav-badge" v-if="item.favorite" @click.stop="itemStore.toggleFavorite(item.id)">
								<uni-icons type="heart-filled" size="10" color="#fff"></uni-icons>
							</view>
						</view>
						<view class="info-content">
							<view class="top-row">
								<text class="item-name">{{ item.name }}</text>
								<text class="item-price">{{ item.cost }}</text>
							</view>
							<view class="location-info">
								<uni-icons type="location" size="12" color="#797c72"></uni-icons>
								<text class="location-text">{{ item.location || item.area }}</text>
							</view>
							<view class="tag-row">
							<view v-for="(tag, tIndex) in item.tags" :key="tIndex" class="item-tag" :class="{ secondary: tIndex > 0 }">
								{{ tag }}
							</view>
							<!-- 过期/临期标记 -->
							<view v-if="getExpiryStatus(item)" class="expiry-badge" :style="{ backgroundColor: getExpiryStatus(item).bg, color: getExpiryStatus(item).color }">
								{{ getExpiryStatus(item).label }}
							</view>
						</view>
					</view>
						<view class="arrow-box">
							<uni-icons type="right" size="14" color="#b1b3a8"></uni-icons>
						</view>
					</view>
				</view>
				
				<!-- 空状态 -->
				<view class="empty-state" v-else>
					<uni-icons type="info" size="64" color="#eeefe5"></uni-icons>
					<text class="empty-text">还没有物品哦，快去添加吧</text>
				</view>

				<!-- 装饰性元素 -->
				<view class="deco-box" v-if="filteredItems.length > 0">
					<uni-icons type="compose" size="40" color="#5f6056" style="opacity: 0.2;"></uni-icons>
				</view>

				<!-- 底部留空 -->
				<view class="footer-spacer"></view>
			</view>
		</scroll-view>

		<!-- 悬浮按钮 (FAB) -->
		<view class="fab-btn" @click="goToAdd">
			<uni-icons type="plus" size="32" color="#fff"></uni-icons>
		</view>

		<!-- 底部导航栏 -->
		<tab-bar :currentTab="1"></tab-bar>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useItemStore } from '@/stores/item';
import TabBar from '@/components/tab-bar/tab-bar.vue';

const itemStore = useItemStore();
const activeCategory = ref(0);
const searchKeyword = ref('');
const filterArea = ref('');

// 判断物品是否过期或临期
const getExpiryStatus = (item) => {
	if (!item.productionDate || !item.shelfLife) return null;
	const now = new Date().getTime();
	const prodDate = new Date(item.productionDate).getTime();
	const expiryDate = prodDate + (parseInt(item.shelfLife) * 24 * 60 * 60 * 1000);
	const daysLeft = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
	
	if (daysLeft < 0) return { label: '已过期', color: '#a73b21', bg: 'rgba(167, 59, 33, 0.1)' };
	if (daysLeft <= 30) return { label: `剩 ${daysLeft} 天`, color: '#e6a23c', bg: 'rgba(230, 162, 60, 0.1)' };
	return null;
};

onShow(() => {
	uni.hideTabBar();
	
	// 处理从首页“标签筛选”跳转过来的逻辑
	if (itemStore.searchFocus) {
		// 可以在这里执行一些逻辑，比如自动打开搜索键盘（如果平台支持）
		// 或者简单的提示用户
		itemStore.setSearchFocus(false);
	}
});

onLoad((options) => {
	if (options.area) {
		filterArea.value = options.area;
		// 如果是从区域页跳过来的，可以自动切换到“全部”分类并应用过滤
		activeCategory.value = 0;
	}
	if (options.tag) {
		searchKeyword.value = options.tag;
	}
});

const filteredItems = computed(() => {
	let list = itemStore.items;
	
	// 区域筛选 (来自外部跳转)
	if (filterArea.value) {
		list = list.filter(item => item.area === filterArea.value);
	}
	
	// 分类筛选
	const category = itemStore.categories[activeCategory.value];
	if (category !== '全部') {
		// 这里简单逻辑：如果标签包含该分类，或者业务逻辑定义的其他过滤
		list = list.filter(item => item.tags.includes(category) || (category === '常用' && item.favorite));
	}
	
	// 搜索筛选
	if (searchKeyword.value) {
		const kw = searchKeyword.value.toLowerCase();
		list = list.filter(item => 
			item.name.toLowerCase().includes(kw) || 
			(item.area && item.area.toLowerCase().includes(kw)) ||
			(item.tags && item.tags.some(t => t.toLowerCase().includes(kw)))
		);
	}
	
	return list;
});

const clearFilter = () => {
	filterArea.value = '';
	searchKeyword.value = '';
	activeCategory.value = 0;
};

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
</script>

<style lang="scss">
	.page-items {
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

	/* 页面标题 & 筛选 */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 40rpx;
		
		.sub-title {
			font-size: 24rpx;
			color: $shouna-tertiary;
			font-weight: 500;
			display: block;
			margin-bottom: 8rpx;
		}
		
		.main-title {
			font-size: 48rpx;
			font-weight: bold;
			color: $shouna-on-surface;
			display: block;
		}
		
		.filter-btn {
			width: 96rpx;
			height: 96rpx;
			background-color: $shouna-surface-container;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	/* 搜索框 */
	.search-section {
		margin-bottom: 24rpx;
		
		.search-input-wrapper {
			background-color: $shouna-surface-container-high;
			height: 100rpx;
			border-radius: 24rpx;
			display: flex;
			align-items: center;
			padding: 0 32rpx;
			gap: 16rpx;
			
			.search-input {
				flex: 1;
				font-size: 28rpx;
				color: $shouna-on-surface;
			}
		}
	}

	/* 活动筛选 */
	.active-filters {
		display: flex;
		align-items: center;
		gap: 24rpx;
		margin-bottom: 40rpx;
		
		.filter-tag {
			background-color: $shouna-primary-container;
			padding: 8rpx 24rpx;
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			gap: 12rpx;
			
			text {
				font-size: 24rpx;
				color: $shouna-primary;
				font-weight: 600;
			}
		}
		
		.clear-all {
			font-size: 24rpx;
			color: $shouna-tertiary;
			text-decoration: underline;
		}
	}

	/* 分类选项卡 */
	.category-tabs {
		margin: 0 -48rpx;
		margin-bottom: 40rpx;
		width: 100vw;
		
		.tabs-list {
			display: inline-flex;
			padding: 0 48rpx;
			gap: 20rpx;
		}
		
		.tab-item {
			padding: 16rpx 48rpx;
			background-color: $shouna-surface-container;
			border-radius: 100rpx;
			white-space: nowrap;
			transition: all 0.3s;
			
			text {
				font-size: 28rpx;
				font-weight: 500;
				color: $shouna-tertiary;
			}
			
			&.active {
				background-color: $shouna-primary;
				
				text {
					color: #fff;
				}
			}
		}
	}

	/* 物品列表 */
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		margin-bottom: 60rpx;
		
		.item-row {
			background-color: $shouna-surface-container-lowest;
			border-radius: 32rpx;
			padding: 24rpx;
			display: flex;
			align-items: center;
			gap: 24rpx;
			box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.98);
				background-color: $shouna-surface-container-low;
			}
			
			.img-box {
				position: relative;
				width: 140rpx;
				height: 140rpx;
				border-radius: 24rpx;
				overflow: hidden;
				flex-shrink: 0;
				background-color: $shouna-surface-container;
				
				.item-img {
					width: 100%;
					height: 100%;
				}
				
				.fav-badge {
					position: absolute;
					top: 8rpx;
					right: 8rpx;
					background-color: $shouna-primary;
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 2rpx solid #fff;
				}
			}
			
			.info-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 8rpx;
				
				.top-row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.item-name {
						font-size: 32rpx;
						font-weight: 700;
						color: $shouna-on-surface;
					}
					
					.item-price {
						font-size: 28rpx;
						font-weight: 700;
						color: $shouna-primary;
					}
				}
				
				.location-info {
					display: flex;
					align-items: center;
					gap: 8rpx;
					
					.location-text {
						font-size: 24rpx;
						color: $shouna-tertiary;
					}
				}
				
				.tag-row {
					display: flex;
					gap: 12rpx;
					
					.item-tag {
						font-size: 20rpx;
						padding: 4rpx 16rpx;
						background-color: rgba($shouna-primary, 0.1);
						color: $shouna-primary;
						border-radius: 8rpx;
						font-weight: 600;
						
						&.secondary {
							background-color: $shouna-surface-container-high;
							color: $shouna-tertiary;
						}
					}

					.expiry-badge {
						font-size: 20rpx;
						padding: 4rpx 16rpx;
						border-radius: 8rpx;
						font-weight: 700;
					}
				}
			}
			
			.arrow-box {
				padding-left: 8rpx;
			}
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
		gap: 24rpx;
		
		.empty-text {
			font-size: 28rpx;
			color: $shouna-tertiary;
		}
	}

	.deco-box {
		display: flex;
		justify-content: center;
		padding: 40rpx 0;
		transform: rotate(15deg);
	}

	.footer-spacer {
		height: 240rpx;
	}

	/* FAB */
	.fab-btn {
		position: fixed;
		right: 48rpx;
		bottom: 240rpx;
		width: 128rpx;
		height: 128rpx;
		background-color: $shouna-primary;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 32rpx rgba($shouna-primary, 0.3);
		z-index: 90;
		transition: transform 0.2s;
		
		&:active {
			transform: scale(0.9);
		}
	}
</style>
