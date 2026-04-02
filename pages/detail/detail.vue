<template>
	<view class="page-detail" v-if="item">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<uni-icons type="arrow-left" size="24" color="#4b6646"></uni-icons>
				<text class="nav-title">物品详情</text>
			</view>
			<view class="nav-right">
				<uni-icons type="share" size="24" color="#4b6646" class="nav-icon"></uni-icons>
				<uni-icons type="more-filled" size="24" color="#4b6646"></uni-icons>
			</view>
		</view>

		<scroll-view scroll-y class="main-content">
			<!-- 物品图片展示 -->
			<view class="hero-section">
				<view class="image-wrapper">
					<image class="main-img" :src="item.image" mode="aspectFill"></image>
					<view class="photo-count" v-if="item.favorite">
						<uni-icons type="heart-filled" size="14" color="#4b6646"></uni-icons>
						<text>心仪</text>
					</view>
				</view>
			</view>

			<!-- 核心信息卡片 -->
			<view class="info-card-section">
				<view class="info-card">
					<view class="card-header">
						<view class="title-box">
							<text class="category-tag">{{ item.tags[0] || '默认分类' }}</text>
							<text class="item-name">{{ item.name }}</text>
						</view>
						<view class="price-box">
							<text class="price-label">购入价格</text>
							<text class="price-value">¥{{ item.price || '0.00' }}</text>
						</view>
					</view>
					
					<view class="info-grid">
						<view class="info-item">
							<view class="icon-circle">
								<uni-icons type="calendar" size="20" color="#4b6646"></uni-icons>
							</view>
							<view class="item-content">
								<text class="item-label">购入日期</text>
								<text class="item-value">{{ item.buyDate || '未知' }}</text>
							</view>
						</view>
						<view class="info-item">
							<view class="icon-circle">
								<uni-icons type="location-filled" size="20" color="#4b6646"></uni-icons>
							</view>
							<view class="item-content">
								<text class="item-label">存放区域</text>
								<text class="item-value">{{ item.area }}</text>
							</view>
						</view>
					</view>

					<!-- 保质期特别展示 -->
					<view class="expiry-detail-card" v-if="item.productionDate && item.shelfLife">
						<view class="expiry-main">
							<view class="expiry-info">
								<text class="label">保质期状态</text>
								<text class="status-text" :style="{ color: expiryInfo.color }">{{ expiryInfo.label }}</text>
							</view>
							<view class="expiry-dates">
								<view class="date-row">
									<text>生产日期:</text>
									<text>{{ item.productionDate }}</text>
								</view>
								<view class="date-row">
									<text>过期日期:</text>
									<text>{{ expiryDateStr }}</text>
								</view>
							</view>
						</view>
						<view class="expiry-progress">
							<view class="progress-bar">
								<view class="progress-inner" :style="{ width: expiryProgress + '%', backgroundColor: expiryInfo.color }"></view>
							</view>
							<text class="progress-text" v-if="expiryInfo.daysLeft >= 0">剩余 {{ expiryInfo.daysLeft }} 天</text>
							<text class="progress-text" v-else>已过期 {{ Math.abs(expiryInfo.daysLeft) }} 天</text>
						</view>
					</view>

					<view class="tag-list">
						<view class="tag-item" v-for="(tag, index) in item.tags" :key="index">
							<uni-icons type="paperplane" size="12" color="#5d6057"></uni-icons>
							<text>{{ tag }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 日均成本模块 (Bento 风格) -->
			<view class="stats-section">
				<view class="cost-main-card">
					<view class="card-header">
						<text class="label">日均成本</text>
						<uni-icons type="info" size="20" color="rgba(75, 102, 70, 0.4)"></uni-icons>
					</view>
					<view class="card-body">
						<view class="price-display">
							<text class="symbol">¥</text>
							<text class="value">{{ item.cost.replace('¥', '') }}</text>
						</view>
						<text class="desc">基于预计 {{ item.estimatedDays }} 天使用寿命计算</text>
					</view>
				</view>
				
				<view class="stats-grid">
					<view class="small-card">
						<text class="label">已使用</text>
						<view class="value-row">
							<text class="num">{{ usedDays }}</text>
							<text class="unit">天</text>
						</view>
						<view class="progress-bar">
							<view class="progress-inner" :style="{ width: progress + '%' }"></view>
						</view>
					</view>
					<view class="small-card">
						<text class="label">预计剩余</text>
						<view class="value-row">
							<text class="num">{{ Math.max(0, item.estimatedDays - usedDays) }}</text>
							<text class="unit">天</text>
						</view>
						<text class="sub-desc">生命周期 {{ progress }}%</text>
					</view>
				</view>
			</view>

			<!-- 备注 -->
			<view class="records-section" v-if="item.remark">
				<view class="section-header">
					<view class="title-box">
						<text class="title">物品备注</text>
					</view>
				</view>
				<view class="remark-content">
					<text>{{ item.remark }}</text>
				</view>
			</view>

			<view class="footer-spacer"></view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="footer-actions">
			<view class="action-btn delete" @click="handleDelete">
				<uni-icons type="trash" size="20" color="#a73b21"></uni-icons>
				<text>删除</text>
			</view>
			<view class="action-btn edit" @click="handleEdit">
				<uni-icons type="compose" size="20" color="#ffffff"></uni-icons>
				<text>编辑</text>
			</view>
		</view>
	</view>
	<view class="page-empty" v-else>
		<uni-icons type="info" size="64" color="#eeefe5"></uni-icons>
		<text>找不到该物品</text>
		<button @click="goBack">返回</button>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useItemStore } from '@/stores/item';

const itemStore = useItemStore();
const itemId = ref('');
const item = computed(() => itemStore.items.find(i => i.id === itemId.value));

onLoad((options) => {
	if (options.id) {
		itemId.value = options.id;
	}
});

const usedDays = computed(() => {
	if (!item.value || !item.value.buyDate) return 0;
	const buyDate = new Date(item.value.buyDate);
	const now = new Date();
	const diff = now.getTime() - buyDate.getTime();
	return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
});

const progress = computed(() => {
	if (!item.value) return 0;
	const total = parseInt(item.value.estimatedDays) || 1;
	const p = Math.min(100, Math.floor((usedDays.value / total) * 100));
	return p;
});

const expiryInfo = computed(() => {
	if (!item.value || !item.value.productionDate || !item.value.shelfLife) return null;
	const now = new Date().getTime();
	const prodDate = new Date(item.value.productionDate).getTime();
	const expiryDate = prodDate + (parseInt(item.value.shelfLife) * 24 * 60 * 60 * 1000);
	const daysLeft = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
	
	if (daysLeft < 0) return { label: '已过期', color: '#a73b21', daysLeft };
	if (daysLeft <= 30) return { label: '即将过期', color: '#e6a23c', daysLeft };
	return { label: '保质期内', color: '#4b6646', daysLeft };
});

const expiryDateStr = computed(() => {
	if (!item.value || !item.value.productionDate || !item.value.shelfLife) return '';
	const prodDate = new Date(item.value.productionDate).getTime();
	const expiryDate = new Date(prodDate + (parseInt(item.value.shelfLife) * 24 * 60 * 60 * 1000));
	return `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, '0')}-${String(expiryDate.getDate()).padStart(2, '0')}`;
});

const expiryProgress = computed(() => {
	if (!item.value || !item.value.productionDate || !item.value.shelfLife) return 0;
	const now = new Date().getTime();
	const prodDate = new Date(item.value.productionDate).getTime();
	const expiryDate = prodDate + (parseInt(item.value.shelfLife) * 24 * 60 * 60 * 1000);
	const total = expiryDate - prodDate;
	const elapsed = now - prodDate;
	return Math.min(100, Math.max(0, Math.floor((elapsed / total) * 100)));
});

const goBack = () => {
	uni.navigateBack();
};

const handleDelete = () => {
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这个物品吗？',
		success: (res) => {
			if (res.confirm) {
				itemStore.deleteItem(itemId.value);
				uni.showToast({ title: '已删除' });
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			}
		}
	});
};

const handleEdit = () => {
	uni.showToast({ title: '编辑功能开发中', icon: 'none' });
};
</script>

<style lang="scss">
	.page-detail {
		background-color: $shouna-background;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 顶部导航 */
	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 88rpx;
		padding: 0 48rpx;
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
				font-size: 32rpx;
				font-weight: bold;
				color: $shouna-primary;
			}
		}
		
		.nav-right {
			display: flex;
			align-items: center;
			gap: 32rpx;
		}
	}

	.main-content {
		flex: 1;
		padding-top: calc(88rpx + var(--status-bar-height));
	}

	/* 图片展示 */
	.hero-section {
		padding: 30rpx 32rpx;
		
		.image-wrapper {
			position: relative;
			width: 100%;
			aspect-ratio: 4/5;
			border-radius: 48rpx;
			overflow: hidden;
			
			.main-img {
				width: 100%;
				height: 100%;
			}
			
			.photo-count {
				position: absolute;
				top: 32rpx;
				right: 32rpx;
				background-color: rgba(255, 255, 255, 0.8);
				backdrop-filter: blur(10px);
				padding: 8rpx 24rpx;
				border-radius: 100rpx;
				display: flex;
				align-items: center;
				gap: 8rpx;
				
				text {
					font-size: 24rpx;
					font-weight: bold;
					color: $shouna-primary;
				}
			}
		}
	}

	/* 核心信息卡片 */
	.info-card-section {
		padding: 0 32rpx;
		margin-bottom: 48rpx;
		
		.info-card {
			background-color: $shouna-surface-container-low;
			padding: 48rpx;
			border-radius: 48rpx;
			position: relative;
			overflow: hidden;
			
			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: 48rpx;
				
				.category-tag {
					font-size: 24rpx;
					font-weight: 600;
					color: $shouna-tertiary;
					background-color: $shouna-primary-container;
					padding: 4rpx 16rpx;
					border-radius: 8rpx;
					display: inline-block;
					margin-bottom: 16rpx;
				}
				
				.item-name {
					font-size: 48rpx;
					font-weight: bold;
					color: $shouna-on-surface;
					display: block;
				}
				
				.price-box {
					text-align: right;
					
					.price-label {
						font-size: 24rpx;
						color: $shouna-tertiary;
						font-weight: 500;
						display: block;
						margin-bottom: 4rpx;
					}
					
					.price-value {
						font-size: 40rpx;
						font-weight: 800;
						color: $shouna-primary;
					}
				}
			}
			
			.info-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 32rpx;
				margin-bottom: 48rpx;
				
				.info-item {
					display: flex;
					align-items: center;
					gap: 24rpx;
					
					.icon-circle {
						width: 80rpx;
						height: 80rpx;
						background-color: $shouna-surface-container-high;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					
					.item-label {
						font-size: 20rpx;
						color: $shouna-tertiary;
						text-transform: uppercase;
						display: block;
						margin-bottom: 4rpx;
					}
					
					.item-value {
						font-size: 28rpx;
						font-weight: 600;
						color: $shouna-on-surface;
					}
				}
			}
			
			.tag-list {
				display: flex;
				flex-wrap: wrap;
				gap: 16rpx;
				
				.tag-item {
					background-color: $shouna-surface-variant;
					padding: 8rpx 24rpx;
					border-radius: 100rpx;
					display: flex;
					align-items: center;
					gap: 8rpx;
					
					text {
						font-size: 22rpx;
						font-weight: 500;
						color: $shouna-on-surface;
					}
				}
			}

			.expiry-detail-card {
				margin-top: 40rpx;
				background-color: $shouna-surface-container-high;
				padding: 32rpx;
				border-radius: 32rpx;
				
				.expiry-main {
					display: flex;
					justify-content: space-between;
					margin-bottom: 24rpx;
					
					.expiry-info {
						display: flex;
						flex-direction: column;
						
						.label {
							font-size: 20rpx;
							color: $shouna-tertiary;
							margin-bottom: 4rpx;
						}
						
						.status-text {
							font-size: 32rpx;
							font-weight: 800;
						}
					}
					
					.expiry-dates {
						text-align: right;
						
						.date-row {
							display: flex;
							justify-content: flex-end;
							gap: 12rpx;
							font-size: 22rpx;
							color: $shouna-tertiary;
							margin-bottom: 4rpx;
						}
					}
				}
				
				.expiry-progress {
					.progress-bar {
						width: 100%;
						height: 12rpx;
						background-color: rgba($shouna-tertiary, 0.1);
						border-radius: 100rpx;
						margin-bottom: 12rpx;
						overflow: hidden;
						
						.progress-inner {
							height: 100%;
							border-radius: 100rpx;
							transition: width 0.3s ease;
						}
					}
					
					.progress-text {
						font-size: 22rpx;
						color: $shouna-tertiary;
						font-weight: 600;
					}
				}
			}
		}
	}

	/* 统计模块 */
	.stats-section {
		padding: 0 32rpx;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32rpx;
		margin-bottom: 80rpx;
		
		.cost-main-card {
			grid-column: span 2;
			background-color: $shouna-primary-container;
			padding: 48rpx;
			border-radius: 48rpx;
			min-height: 320rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.label {
					font-size: 28rpx;
					font-weight: 500;
					color: rgba($shouna-on-surface, 0.8);
				}
			}
			
			.price-display {
				display: flex;
				align-items: baseline;
				gap: 8rpx;
				
				.symbol {
					font-size: 36rpx;
					font-weight: 800;
					color: $shouna-on-surface;
				}
				
				.value {
					font-size: 80rpx;
					font-weight: 800;
					color: $shouna-on-surface;
				}
			}
			
			.desc {
				font-size: 24rpx;
				color: rgba($shouna-on-surface, 0.6);
				margin-top: 8rpx;
			}
		}
		
		.small-card {
			background-color: $shouna-surface-container;
			padding: 32rpx;
			border-radius: 48rpx;
			display: flex;
			flex-direction: column;
			gap: 16rpx;
			
			.label {
				font-size: 20rpx;
				font-weight: bold;
				color: $shouna-tertiary;
				text-transform: uppercase;
				letter-spacing: 2rpx;
			}
			
			.value-row {
				display: flex;
				align-items: baseline;
				gap: 8rpx;
				
				.num {
					font-size: 48rpx;
					font-weight: bold;
					color: $shouna-on-surface;
				}
				
				.unit {
					font-size: 24rpx;
					color: $shouna-tertiary;
				}
			}
			
			.progress-bar {
				width: 100%;
				height: 12rpx;
				background-color: $shouna-surface-variant;
				border-radius: 100rpx;
				overflow: hidden;
				
				.progress-inner {
					height: 100%;
					background-color: $shouna-primary;
					border-radius: 100rpx;
				}
			}
			
			.sub-desc {
				font-size: 20rpx;
				color: rgba($shouna-tertiary, 0.6);
				font-style: italic;
			}
		}
	}

	.records-section {
		padding: 0 32rpx;
		margin-bottom: 48rpx;
		
		.section-header {
			margin-bottom: 24rpx;
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: $shouna-on-surface;
			}
		}
		
		.remark-content {
			background-color: #fff;
			padding: 32rpx;
			border-radius: 32rpx;
			font-size: 26rpx;
			color: $shouna-tertiary;
			line-height: 1.6;
		}
	}

	.footer-spacer {
		height: 240rpx;
	}

	.footer-actions {
		position: fixed;
		bottom: 40rpx;
		left: 48rpx;
		right: 48rpx;
		display: flex;
		gap: 24rpx;
		z-index: 100;
		
		.action-btn {
			flex: 1;
			height: 100rpx;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 12rpx;
			font-size: 28rpx;
			font-weight: 600;
			box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.05);
			
			&.delete {
				background-color: #fff;
				color: #a73b21;
				border: 2rpx solid #a73b2122;
			}
			
			&.edit {
				background-color: $shouna-primary;
				color: #fff;
			}
			
			&:active {
				opacity: 0.8;
				transform: scale(0.98);
			}
		}
	}

	.page-empty {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 32rpx;
		color: $shouna-tertiary;
	}
</style>
