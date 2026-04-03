<template>
	<view class="tab-bar">
		<view 
			v-for="(tab, index) in tabs" 
			:key="index" 
			class="tab-item" 
			:class="{ active: currentTab === index }"
			@click="switchTab(index)"
		>
			<view class="icon-wrapper">
				<uni-icons 
					:type="tab.icon" 
					size="24" 
					:color="currentTab === index ? 'var(--shouna-primary)' : 'var(--shouna-tertiary)'"
				></uni-icons>
			</view>
			<text class="tab-label">{{ tab.text }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tab-bar",
		props: {
			currentTab: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				tabs: [
					{ text: '首页', icon: 'home-filled', url: '/pages/index/index' },
					{ text: '物品', icon: 'list', url: '/pages/items/items' },
					{ text: '区域', icon: 'location-filled', url: '/pages/area/area' },
					{ text: '统计', icon: 'bars', url: '/pages/statistics/statistics' },
					{ text: '设置', icon: 'gear-filled', url: '/pages/setting/setting' }
				]
			};
		},
		methods: {
			switchTab(index) {
				const url = this.tabs[index].url;
				if (url && index !== this.currentTab) {
					uni.switchTab({
						url: url
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: rgba($shouna-background, 0.85);
		backdrop-filter: blur(15px);
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		box-shadow: 0 -4rpx 40rpx rgba(0,0,0,0.04);
		z-index: 100;
		
		.tab-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 8rpx 0;
			width: 120rpx;
			transition: all 0.3s ease;
			
			.icon-wrapper {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: all 0.3s ease;
				margin-bottom: 4rpx;
			}
			
			.tab-label {
				font-size: 20rpx;
				font-weight: 500;
				color: var(--shouna-tertiary);
			}
			
			&.active {
				.icon-wrapper {
					background-color: var(--shouna-primary-container);
				}
				
				.tab-label {
					color: var(--shouna-primary);
					font-weight: bold;
				}
			}
		}
	}
</style>
