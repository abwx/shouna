<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left">
				<uni-icons type="shop-filled" size="24" color="#4b6646"></uni-icons>
				<text class="nav-title">设置</text>
			</view>
			<view class="nav-right">
				<uni-icons type="search" size="24" color="#4b6646"></uni-icons>
			</view>
		</view>

		<scroll-view scroll-y class="main-content">
			<view class="content-wrapper">
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
									<uni-icons :type="item.icon" size="20" :color="item.danger ? '#a73b21' : '#4b6646'"></uni-icons>
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
						<view class="bento-card">
							<uni-icons type="color-filled" size="32" color="#4b6646"></uni-icons>
							<view class="card-info">
								<text class="card-title">主题模式</text>
								<text class="card-desc">莫兰迪绿 (浅色)</text>
							</view>
						</view>
						<view class="bento-card">
							<uni-icons type="list" size="32" color="#4b6646"></uni-icons>
							<view class="card-info">
								<text class="card-title">列表布局</text>
								<text class="card-desc">舒适宫格</text>
							</view>
						</view>
						<view class="budget-card">
							<view class="budget-left">
								<uni-icons type="wallet-filled" size="24" color="#4b6646"></uni-icons>
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

		<!-- 自定义 TabBar -->
		<tab-bar :currentTab="4"></tab-bar>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import TabBar from '@/components/tab-bar/tab-bar.vue';

onShow(() => {
	uni.hideTabBar();
});

const dataSettings = [
	{ label: '数据备份', icon: 'cloud-upload-filled', danger: false },
	{ label: '导出记录', icon: 'redo-filled', danger: false },
	{ label: '恢复数据', icon: 'refresh-filled', danger: false },
	{ label: '清空所有内容', icon: 'trash-filled', danger: true }
]

const handleItemClick = (item) => {
	if (item.danger) {
		uni.showModal({
			title: '确认清空',
			content: '此操作将永久删除所有收纳数据，无法恢复。',
			confirmColor: '#a73b21'
		})
	}
}
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
			background-color: rgba($shouna-primary-container, 0.2);
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
			color: $shouna-primary;
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
		background-color: rgba($shouna-primary-container, 0.4);
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
			background-color: $shouna-primary;
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
		color: $shouna-tertiary;
		margin-top: 8rpx;
	}
}

.safe-area-bottom {
	height: 240rpx;
}
</style>
