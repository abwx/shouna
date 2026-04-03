<template>
	<view class="page-area">
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
				<!-- 页面标题 & 添加区域 -->
				<view class="header-section">
					<view class="title-box">
						<text class="sub-title">MANAGEMENT</text>
						<text class="main-title">我的区域</text>
					</view>
					<view class="add-area-btn" @click="showAddPopup = true">
						<uni-icons type="plus" size="20" color="#fff"></uni-icons>
						<text>添加区域</text>
					</view>
				</view>

				<!-- 统计概览 -->
				<view class="stats-overview">
					<view class="stats-item">
						<text class="stats-label">总计区域</text>
						<text class="stats-value">{{ itemStore.areas.length }}</text>
					</view>
					<view class="divider"></view>
					<view class="stats-item">
						<text class="stats-label">待整理</text>
						<text class="stats-value">02</text>
					</view>
				</view>

				<!-- 区域卡片网格 -->
				<view class="area-grid">
					<view class="area-card" v-for="(area, index) in areaStats" :key="index" @click="filterByArea(area.name)">
						<view class="card-header">
							<view class="icon-circle" :style="{ backgroundColor: area.count > 0 ? '#ccebc2' : '#eeefe5' }">
								<uni-icons :type="area.icon" size="24" :color="area.count > 0 ? area.color : '#5d6057'"></uni-icons>
							</view>
							<view class="edit-icon-box" @click.stop="handleEditArea(area)">
								<uni-icons type="compose" size="20" color="#b1b3a8"></uni-icons>
							</view>
						</view>
						<view class="card-footer">
							<text class="area-name">{{ area.name }}</text>
							<view class="item-count">
								<text class="count-num">{{ area.count }}</text>
								<text class="count-unit">件物品</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 装饰性底部 -->
				<view class="bottom-deco">
					<uni-icons type="compose" size="40" color="#5f6056" style="opacity: 0.2;"></uni-icons>
					<text class="deco-text">— 精细收纳，从区域开始 —</text>
				</view>

				<view class="footer-spacer"></view>
			</view>
		</scroll-view>

		<!-- 添加/编辑区域弹窗 -->
		<view class="popup-mask" v-if="showAddPopup" @click="closePopup">
			<view class="popup-content" @click.stop>
				<view class="popup-header">
					<text class="popup-title">{{ isEditMode ? '编辑区域' : '新建区域' }}</text>
					<view class="close-btn" @click="closePopup">
						<uni-icons type="closeempty" size="20" color="#5f6056"></uni-icons>
					</view>
				</view>

				<view class="popup-body">
					<view class="form-item">
						<text class="label">区域名称</text>
						<input class="input-field" type="text" placeholder="输入区域名..." v-model="newAreaForm.name" />
					</view>

					<view class="form-item">
						<text class="label">选择标识色</text>
						<view class="color-list">
							<view 
								v-for="color in presetColors" 
								:key="color" 
								class="color-dot" 
								:style="{ backgroundColor: color }"
								:class="{ active: newAreaForm.color === color }"
								@click="newAreaForm.color = color"
							>
								<view class="dot-inner" v-if="newAreaForm.color === color"></view>
							</view>
						</view>
					</view>

					<view class="form-item">
						<text class="label">关联图标</text>
						<view class="icon-selector-wrapper">
							<view class="icon-list">
								<view 
									v-for="icon in presetIcons" 
									:key="icon" 
									class="icon-item" 
									:class="{ active: newAreaForm.icon === icon }"
									@click="newAreaForm.icon = icon"
								>
									<uni-icons :type="icon" size="24" :color="newAreaForm.icon === icon ? '#4b6646' : '#797c72'"></uni-icons>
								</view>
							</view>
						</view>
					</view>

					<view class="popup-actions">
						<button v-if="isEditMode" class="delete-popup-btn" @click="handleDeleteArea">
							<uni-icons type="trash-filled" size="18" color="#a73b21"></uni-icons>
							<text>删除</text>
						</button>
						<button class="save-popup-btn" :class="{ 'is-edit': isEditMode }" @click="confirmSaveArea">
							<text>{{ isEditMode ? '保存修改' : '保存新区域' }}</text>
							<uni-icons type="checkmarkempty" size="18" color="#fff"></uni-icons>
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部导航栏 -->
		<tab-bar :currentTab="2"></tab-bar>
	</view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useItemStore } from '@/stores/item';
import TabBar from '@/components/tab-bar/tab-bar.vue';

const itemStore = useItemStore();

// 弹窗相关
const showAddPopup = ref(false);
const isEditMode = ref(false);
const originalName = ref('');
const presetColors = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#a855f7', '#94a3b8', '#f97316'];
const presetIcons = ['home-filled', 'person-filled', 'shop-filled', 'paperplane-filled', 'calendar-filled', 'map-filled', 'wallet-filled', 'box'];

const newAreaForm = reactive({
	name: '',
	color: '#10b981',
	icon: 'home-filled'
});

onShow(() => {
	uni.hideTabBar();
});

const areaStats = computed(() => {
	const stats = itemStore.statsByArea;
	return itemStore.areas.map(area => ({
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
		originalName.value = '';
		newAreaForm.name = '';
		newAreaForm.color = presetColors[0];
		newAreaForm.icon = presetIcons[0];
	}, 200);
};

const confirmSaveArea = () => {
	if (!newAreaForm.name.trim()) {
		uni.showToast({ title: '请输入区域名称', icon: 'none' });
		return;
	}
	
	const areaData = {
		name: newAreaForm.name.trim(),
		color: newAreaForm.color,
		icon: newAreaForm.icon
	};

	if (isEditMode.value) {
		itemStore.updateArea(originalName.value, areaData);
		uni.showToast({ title: '更新成功', icon: 'success' });
	} else {
		itemStore.addArea(areaData);
		uni.showToast({ title: '添加成功', icon: 'success' });
	}
	
	closePopup();
};

const handleDeleteArea = () => {
	uni.showModal({
		title: '确认删除',
		content: `确定要删除“${originalName.value}”区域吗？该区域下的物品将不再关联区域。`,
		confirmColor: '#a73b21',
		success: (res) => {
			if (res.confirm) {
				itemStore.deleteArea(originalName.value);
				uni.showToast({ title: '已删除', icon: 'success' });
				closePopup();
			}
		}
	});
};

const filterByArea = (areaName) => {
	// 通过 Store 传递区域过滤参数
	itemStore.setFilterArea(areaName);
	uni.switchTab({
		url: '/pages/items/items'
	});
};
</script>

<style lang="scss">
	.page-area {
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

	/* 页面标题 & 添加按钮 */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 60rpx;
		
		.sub-title {
			font-size: 24rpx;
			color: $shouna-tertiary;
			font-weight: 600;
			letter-spacing: 4rpx;
			display: block;
			margin-bottom: 8rpx;
		}
		
		.main-title {
			font-size: 48rpx;
			font-weight: bold;
			color: $shouna-on-surface;
			display: block;
		}
		
		.add-area-btn {
			background-color: $shouna-primary;
			padding: 24rpx 40rpx;
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			gap: 12rpx;
			box-shadow: 0 8rpx 20rpx rgba($shouna-primary, 0.15);
			
			text {
				color: #fff;
				font-size: 28rpx;
				font-weight: 600;
			}
		}
	}

	/* 统计概览 */
	.stats-overview {
		background-color: $shouna-surface-container-low;
		border-radius: 32rpx;
		padding: 40rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 60rpx;
		
		.stats-item {
			text-align: center;
			
			.stats-label {
				font-size: 20rpx;
				color: $shouna-tertiary;
				font-weight: 500;
				display: block;
				margin-bottom: 8rpx;
			}
			
			.stats-value {
				font-size: 48rpx;
				font-weight: bold;
				color: $shouna-primary;
			}
		}
		
		.divider {
			width: 2rpx;
			height: 60rpx;
			background-color: rgba($shouna-tertiary, 0.1);
		}
	}

	/* 区域网格 */
	.area-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48rpx;
		padding-bottom: 40rpx;
		
		.area-card {
			background-color: $shouna-surface-container-lowest;
			height: 384rpx;
			border-radius: 32rpx;
			padding: 32rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			border: 1rpx solid rgba(177, 179, 168, 0.2);
			transition: all 0.3s;
			
			&:nth-child(even) {
				transform: translateY(48rpx);
			}
			
			&:active {
				opacity: 0.8;
				transform: scale(0.98);
			}
			
			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				
				.icon-circle {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			
			.card-footer {
				.area-name {
					font-size: 36rpx;
					font-weight: bold;
					color: $shouna-on-surface;
					display: block;
					margin-bottom: 8rpx;
				}
				
				.item-count {
					display: flex;
					align-items: baseline;
					gap: 8rpx;
					
					.count-num {
						font-size: 24rpx;
						font-weight: bold;
						color: $shouna-primary;
					}
					
					.count-unit {
						font-size: 24rpx;
						color: $shouna-tertiary;
					}
				}
			}
		}
	}

	/* 底部装饰 */
	.bottom-deco {
		margin-top: 120rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0.4;
		
		.deco-text {
			font-size: 20rpx;
			color: $shouna-tertiary;
			margin-top: 16rpx;
			letter-spacing: 4rpx;
			font-style: italic;
		}
	}

	.footer-spacer {
		height: 240rpx;
	}

	/* 添加区域弹窗样式 */
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.popup-content {
		width: 85%;
		background-color: #fafaf3;
		border-radius: 64rpx;
		padding: 48rpx;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 48rpx;

		.popup-title {
			font-size: 40rpx;
			font-weight: 800;
			color: $shouna-on-surface;
		}

		.close-btn {
			padding: 8rpx;
		}
	}

	.popup-body {
		.form-item {
			margin-bottom: 40rpx;

			.label {
				font-size: 24rpx;
				font-weight: 600;
				color: $shouna-tertiary;
				margin-bottom: 16rpx;
				display: block;
			}

			.input-field {
				background-color: #eeefe5;
				height: 100rpx;
				border-radius: 24rpx;
				padding: 0 32rpx;
				font-size: 28rpx;
				color: $shouna-on-surface;
			}
		}

		.color-list {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;

			.color-dot {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: transform 0.2s;

				&:active {
					transform: scale(0.9);
				}

				&.active {
					border: 4rpx solid #ccebc2;
				}

				.dot-inner {
					width: 24rpx;
					height: 24rpx;
					background-color: #fff;
					border-radius: 50%;
				}
			}
		}

		.icon-selector-wrapper {
			background-color: #eeefe5;
			border-radius: 32rpx;
			padding: 12rpx;
			
			.icon-list {
				display: flex;
				justify-content: space-between;
				padding: 8rpx;

				.icon-item {
					width: 72rpx;
					height: 72rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 16rpx;
					transition: background-color 0.2s;

					&.active {
						background-color: rgba(255, 255, 255, 0.6);
					}
				}
			}
		}

		.popup-actions {
			margin-top: 60rpx;
			display: flex;
			gap: 24rpx;

			.delete-popup-btn {
				flex: 1;
				height: 112rpx;
				background-color: rgba(167, 59, 33, 0.1);
				border-radius: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 12rpx;

				text {
					color: #a73b21;
					font-size: 28rpx;
					font-weight: bold;
				}
			}

			.save-popup-btn {
				flex: 2;
				height: 112rpx;
				background-color: $shouna-primary;
				border-radius: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 12rpx;
				box-shadow: 0 16rpx 32rpx rgba($shouna-primary, 0.2);

				&.is-edit {
					background: linear-gradient(to right, $shouna-primary, $shouna-primary-dim);
				}

				text {
					color: #fff;
					font-size: 32rpx;
					font-weight: bold;
				}
			}
		}
	}
</style>
