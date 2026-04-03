<template>
	<view class="container" :style="themeStore.cssVars">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left">
				<uni-icons type="shop-filled" size="24" color="var(--shouna-primary)"></uni-icons>
				<text class="nav-title">MAD收纳</text>
			</view>
			<view class="nav-right">
			</view>
		</view>

		<scroll-view scroll-y class="main-content">
			<view class="content-wrapper">
				<!-- 标题 -->
				<view class="page-header">
					<text class="page-title">设置</text>
				</view>

				<!-- 用户信息卡片 -->
				<view class="profile-section">
					<view class="profile-card">
						<view class="profile-bg-decoration"></view>
						<view class="avatar-box">
							<image src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1o2F9tuV-v6KwceA0An1O-Mjm3POMEXGRASLNPuC1gTirCOHzjGb_Zj_9gd2Av2_CTVFTLrHXGJbzLApgeCaGb13h_FapPehd6qT3NEMBiKmm4dct1_ZBxJGi8Tn9KG31WwB2Ki7Veps7hZumdnFtxAR2M5wINb9Blq_T7XqRQdSvK7vorewMB3niYzoYh6_PFw1YS9y397uhPEHOoOKIGlhr3A0m4RO9InaB_l6_5tkndQPoUn8OEWKW4aMZm3s0b8WP1hwT76E" mode="aspectFill" class="avatar"></image>
						</view>
						<view class="user-info">
							<text class="user-name">MAD 整理师</text>
							<text class="user-id">微信号: mad_organizer_01</text>
						</view>
						<uni-icons type="right" size="20" color="#b1b3a8"></uni-icons>
					</view>
				</view>

				<!-- 账号与数据 -->
				<view class="setting-group">
					<view class="group-header">
						<text class="group-title">账号与数据</text>
						<view class="group-line"></view>
					</view>
					<view class="list-container">
						<view class="list-item" v-for="(item, index) in dataSettings" :key="index" @tap="handleItemClick(item)">
							<view class="item-left">
								<view class="icon-box" :class="{ 'is-danger': item.danger }">
									<uni-icons :type="item.icon" size="20" :color="item.danger ? '#a73b21' : 'var(--shouna-primary)'"></uni-icons>
								</view>
								<text class="item-label" :class="{ 'is-danger': item.danger }">{{ item.label }}</text>
							</view>
							<uni-icons type="right" size="14" :color="item.danger ? 'rgba(167, 59, 33, 0.4)' : '#b1b3a8'"></uni-icons>
						</view>
					</view>
				</view>

				<!-- 个性化 -->
				<view class="setting-group">
					<view class="group-header">
						<text class="group-title">个性化</text>
						<view class="group-line"></view>
					</view>
					<view class="bento-grid">
						<view class="bento-card" @tap="openThemePicker">
							<uni-icons type="color-filled" size="32" color="var(--shouna-primary)"></uni-icons>
							<view class="card-info">
								<text class="card-title">主题模式</text>
								<text class="card-desc">{{ themeStore.currentTheme.name }} ({{ themeStore.currentTheme.desc }})</text>
							</view>
						</view>
						<view class="bento-card">
							<uni-icons type="list" size="32" color="var(--shouna-primary)"></uni-icons>
							<view class="card-info">
								<text class="card-title">列表布局</text>
								<text class="card-desc">舒适宫格</text>
							</view>
						</view>
						<view class="budget-card">
							<view class="budget-left">
								<uni-icons type="wallet-filled" size="24" color="var(--shouna-primary)"></uni-icons>
								<view class="budget-info">
									<text class="budget-title">预算设置</text>
									<text class="budget-desc">管理月度收纳采购预算</text>
								</view>
							</view>
							<view class="budget-tag">¥ 2000</view>
						</view>
					</view>
				</view>

				<!-- 其他 -->
				<view class="setting-group">
					<view class="group-header">
						<text class="group-title">其他</text>
						<view class="group-line"></view>
					</view>
					<view class="other-list">
						<view class="other-item">
							<text class="other-label">隐私政策</text>
							<uni-icons type="paperplane" size="18" color="#b1b3a8"></uni-icons>
						</view>
						<view class="other-item">
							<text class="other-label">关于 MAD收纳</text>
							<text class="other-value">v 2.4.0</text>
						</view>
						<view class="other-item">
							<text class="other-label">帮助与反馈</text>
							<uni-icons type="chat-filled" size="18" color="#b1b3a8"></uni-icons>
						</view>
					</view>
				</view>

				<!-- 底部标识 -->
				<view class="footer-signature">
					<uni-icons type="leaf-filled" size="36" color="rgba(95, 96, 86, 0.3)"></uni-icons>
					<text class="signature-text">ORGANIZE WITH INTENTION</text>
				</view>
				
				<!-- 底部占位 -->
				<view class="safe-area-bottom"></view>
			</view>
		</scroll-view>

		<!-- 统一风格的自定义弹窗 -->
		<view class="popup-mask" v-if="popup.show" @click="closePopup">
			<view class="popup-content" @click.stop>
				<view class="popup-header">
					<text class="popup-title">{{ popup.title }}</text>
					<view class="close-btn" @click="closePopup">
						<uni-icons type="closeempty" size="20" color="#5f6056"></uni-icons>
					</view>
				</view>

				<view class="popup-body">
					<view class="warning-box" :class="{ 'is-success': popup.type === 'success', 'is-danger': popup.type === 'danger' }">
						<uni-icons 
							:type="popup.type === 'danger' ? 'info-filled' : 'checkbox-filled'" 
							size="64" 
							:color="popup.type === 'danger' ? '#a73b21' : '#4b6646'"
						></uni-icons>
						<text class="warning-text" :class="{ 'is-success': popup.type === 'success', 'is-danger': popup.type === 'danger' }">{{ popup.content }}</text>
					</view>

					<view class="popup-actions">
						<button v-if="popup.showCancel" class="cancel-popup-btn" @click="closePopup">
							<text>{{ popup.cancelText || '取消' }}</text>
						</button>
						<button 
							:class="popup.type === 'danger' ? 'delete-popup-btn' : 'save-popup-btn'" 
							@click="handlePopupConfirm"
						>
							<text>{{ popup.confirmText || '确定' }}</text>
							<uni-icons v-if="popup.type === 'danger'" type="trash-filled" size="18" color="#fff"></uni-icons>
							<uni-icons v-else type="checkmarkempty" size="18" color="#fff"></uni-icons>
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 自定义 TabBar -->
		<tab-bar :currentTab="4"></tab-bar>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useItemStore } from '@/stores/item';
import { useThemeStore } from '@/stores/theme';
import TabBar from '@/components/tab-bar/tab-bar.vue';

const itemStore = useItemStore();
const themeStore = useThemeStore();

// 统一弹窗状态管理
const popup = reactive({
	show: false,
	title: '',
	content: '',
	type: 'danger', // 'danger' | 'success'
	showCancel: true,
	cancelText: '取消',
	confirmText: '确定',
	confirmCallback: null
});

onShow(() => {
	uni.hideTabBar();
});

const openThemePicker = () => {
	const itemList = themeStore.themes.map(t => `${t.name} (${t.desc})`);
	uni.showActionSheet({
		itemList,
		success: (res) => {
			const selected = themeStore.themes[res.tapIndex];
			if (selected) themeStore.setTheme(selected.key);
		}
	});
};

const dataSettings = [
	{ id: 'backup', label: '数据备份', icon: 'cloud-upload-filled', danger: false },
	{ id: 'export', label: '导出记录', icon: 'redo-filled', danger: false },
	{ id: 'restore', label: '恢复数据', icon: 'refresh-filled', danger: false },
	{ id: 'clear', label: '清空所有内容', icon: 'trash-filled', danger: true }
]

const handleItemClick = (item) => {
	switch (item.id) {
		case 'backup':
			handleBackup();
			break;
		case 'export':
			handleExport();
			break;
		case 'restore':
			handleRestore();
			break;
		case 'clear':
			showCustomPopup({
				title: '确认清空',
				content: '此操作将永久删除所有收纳数据及自定义标签/区域，且无法恢复！',
				type: 'danger',
				confirmText: '确认清空',
				cancelText: '我再想想',
				confirmCallback: confirmClear
			});
			break;
	}
}

// 显示自定义弹窗的工具函数
const showCustomPopup = (config) => {
	popup.title = config.title || '提示';
	popup.content = config.content || '';
	popup.type = config.type || 'success';
	popup.showCancel = config.showCancel !== false;
	popup.cancelText = config.cancelText || '取消';
	popup.confirmText = config.confirmText || '确定';
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

// 1. 数据备份
const handleBackup = () => {
	const data = {
		items: itemStore.items,
		tags: itemStore.tags,
		areas: itemStore.areas,
		backupTime: new Date().toLocaleString()
	};
	uni.setStorageSync('shouna_backup', data);
	uni.showToast({
		title: '备份成功',
		icon: 'success'
	});
};

// 2. 导出记录 (复制 JSON 到剪贴板)
const handleExport = () => {
	const data = {
		items: itemStore.items,
		tags: itemStore.tags,
		areas: itemStore.areas,
		exportTime: new Date().toLocaleString(),
		version: '2.4.0'
	};
	const jsonStr = JSON.stringify(data);
	uni.setClipboardData({
		data: jsonStr,
		success: () => {
			showCustomPopup({
				title: '导出成功',
				content: '收纳数据已转换为 JSON 字符串并复制到剪贴板，请妥善保存。',
				type: 'success',
				showCancel: false,
				confirmText: '好哒'
			});
		}
	});
};

// 3. 恢复数据
const handleRestore = () => {
	uni.showActionSheet({
		itemList: ['从本地备份恢复', '从剪贴板导入'],
		success: (res) => {
			if (res.tapIndex === 0) {
				// 从本地备份恢复
				const backup = uni.getStorageSync('shouna_backup');
				if (backup) {
					showCustomPopup({
						title: '确认恢复',
						content: `发现备份于 ${backup.backupTime} 的数据，确认恢复吗？当前数据将被覆盖。`,
						type: 'danger',
						confirmText: '确认恢复',
						confirmCallback: () => {
							if (itemStore.importData(backup)) {
								uni.showToast({ title: '恢复成功', icon: 'success' });
							}
						}
					});
				} else {
					uni.showToast({ title: '未发现备份', icon: 'none' });
				}
			} else {
				// 从剪贴板导入
				uni.getClipboardData({
					success: (clipboardRes) => {
						const data = clipboardRes.data;
						if (data && data.includes('items')) {
							showCustomPopup({
								title: '确认导入',
								content: '识别到合法的收纳数据，确认导入吗？当前数据将被覆盖。',
								type: 'danger',
								confirmText: '确认导入',
								confirmCallback: () => {
									if (itemStore.importData(data)) {
										uni.showToast({ title: '导入成功', icon: 'success' });
									} else {
										uni.showToast({ title: '解析失败', icon: 'none' });
									}
								}
							});
						} else {
							uni.showToast({ title: '剪贴板无有效数据', icon: 'none' });
						}
					}
				});
			}
		}
	});
};

// 4. 确认清空内容
const confirmClear = () => {
	itemStore.resetAllData();
	uni.showToast({
		title: '已全部清空',
		icon: 'success'
	});
	// 延迟回到首页
	setTimeout(() => {
		uni.reLaunch({ url: '/pages/index/index' });
	}, 1500);
}
</script>

<style lang="scss" scoped>
/* 统一风格的自定义弹窗样式 (完全对齐区域页面) */
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
	animation: popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popupScale {
	from { transform: scale(0.9); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
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
	.warning-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32rpx;
		padding: 64rpx 48rpx;
		background-color: #f1f3e8; /* 默认淡雅绿灰 */
		border-radius: 40rpx;
		margin-bottom: 48rpx;
		border: 2rpx solid rgba(0,0,0,0.02);
		
		&.is-success {
			background-color: #edf5ea; /* 成功绿 */
			border-color: rgba(75, 102, 70, 0.1);
		}
		
		&.is-danger {
			background-color: #fbeeee; /* 危险红 */
			border-color: rgba(167, 59, 33, 0.1);
		}

		.warning-text {
			font-size: 30rpx;
			color: $shouna-on-surface;
			text-align: center;
			line-height: 1.6;
			font-weight: 600;
			
			&.is-success {
				color: $shouna-primary;
			}
			
			&.is-danger {
				color: #a73b21;
			}
		}
	}
}

.popup-actions {
	display: flex;
	gap: 24rpx;

	button {
		height: 112rpx;
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		font-size: 28rpx;
		font-weight: 700;
		border: none;
		transition: all 0.2s;

		&::after { border: none; }
		&:active { opacity: 0.8; transform: scale(0.98); }
	}

	.cancel-popup-btn {
		flex: 1;
		background-color: rgba(var(--shouna-tertiary-rgb), 0.1);
		color: $shouna-on-surface-variant;
	}

	.delete-popup-btn {
		flex: 2;
		background-color: $shouna-error;
		color: #fff;
		box-shadow: 0 16rpx 32rpx rgba($shouna-error, 0.2);
	}

	.save-popup-btn {
		flex: 2;
		background-color: var(--shouna-primary);
		color: #fff;
		box-shadow: 0 16rpx 32rpx rgba(var(--shouna-primary-rgb), 0.2);
	}
}
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
			color: var(--shouna-primary);
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
}

.profile-section {
	margin-bottom: 80rpx;

	.profile-card {
		background-color: $shouna-surface-container-lowest;
		border-radius: 32rpx;
		padding: 48rpx;
		display: flex;
		align-items: center;
		gap: 32rpx;
		position: relative;
		overflow: hidden;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);

		.profile-bg-decoration {
			position: absolute;
			top: -32rpx;
			right: -32rpx;
			width: 192rpx;
			height: 192rpx;
			background-color: rgba(var(--shouna-primary-container-rgb), 0.2);
			border-radius: 50%;
			filter: blur(40px);
		}

		.avatar-box {
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 4rpx solid $shouna-surface-container-high;
			flex-shrink: 0;

			.avatar {
				width: 100%;
				height: 100%;
			}
		}

		.user-info {
			flex: 1;
			display: flex;
			flex-direction: column;

			.user-name {
				font-size: 36rpx;
				font-weight: 700;
				color: $shouna-on-surface;
			}

			.user-id {
				font-size: 28rpx;
				color: $shouna-on-surface-variant;
				margin-top: 4rpx;
			}
		}
	}
}

.setting-group {
	margin-bottom: 64rpx;

	.group-header {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 32rpx;
		padding: 0 8rpx;

		.group-title {
			font-size: 28rpx;
			font-weight: 700;
			color: var(--shouna-primary);
			letter-spacing: 4rpx;
			text-transform: uppercase;
		}

		.group-line {
			flex: 1;
			height: 2rpx;
			background-color: $shouna-surface-container-high;
		}
	}
}

.list-container {
	display: flex;
	flex-direction: column;
	gap: 24rpx;

	.list-item {
		background-color: $shouna-surface-container-low;
		padding: 32rpx;
		border-radius: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: background-color 0.2s;

		&:active {
			background-color: $shouna-surface-container-high;
		}

		.item-left {
			display: flex;
			align-items: center;
			gap: 24rpx;

			.icon-box {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background-color: $shouna-surface-container-lowest;
				display: flex;
				align-items: center;
				justify-content: center;

				&.is-danger {
					background-color: rgba(167, 59, 33, 0.05);
				}
			}

			.item-label {
				font-size: 30rpx;
				font-weight: 500;
				color: $shouna-on-surface;

				&.is-danger {
					color: #a73b21;
					font-weight: 600;
				}
			}
		}
	}
}

.bento-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;

	.bento-card {
		background-color: $shouna-surface-container-low;
		border-radius: 32rpx;
		padding: 32rpx;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.card-info {
			display: flex;
			flex-direction: column;

			.card-title {
				font-size: 32rpx;
				font-weight: 700;
				color: $shouna-on-surface;
			}

			.card-desc {
				font-size: 24rpx;
				color: $shouna-on-surface-variant;
				margin-top: 4rpx;
			}
		}
	}

	.budget-card {
		grid-column: span 2;
		background-color: rgba(var(--shouna-primary-container-rgb), 0.4);
		border-radius: 32rpx;
		padding: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.budget-left {
			display: flex;
			align-items: center;
			gap: 32rpx;

			.budget-info {
				display: flex;
				flex-direction: column;

				.budget-title {
					font-size: 32rpx;
					font-weight: 700;
					color: $shouna-on-surface;
				}

				.budget-desc {
					font-size: 24rpx;
					color: $shouna-on-surface-variant;
				}
			}
		}

		.budget-tag {
			background-color: var(--shouna-primary);
			color: #fff;
			padding: 8rpx 24rpx;
			border-radius: 100rpx;
			font-size: 24rpx;
			font-weight: 700;
		}
	}
}

.other-list {
	background-color: $shouna-surface-container-low;
	border-radius: 32rpx;
	overflow: hidden;

	.other-item {
		padding: 32rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid rgba($shouna-surface-container-highest, 0.3);

		&:last-child {
			border-bottom: none;
		}

		.other-label {
			font-size: 30rpx;
			color: $shouna-on-surface;
		}

		.other-value {
			font-size: 24rpx;
			font-weight: 500;
			color: $shouna-on-surface-variant;
		}
	}
}

.footer-signature {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 32rpx;
	opacity: 0.3;

	.signature-text {
		font-size: 20rpx;
		font-weight: 700;
		letter-spacing: 4rpx;
		color: var(--shouna-tertiary);
		margin-top: 8rpx;
	}
}

.safe-area-bottom {
	height: 240rpx;
}
</style>
