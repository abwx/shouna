<template>
	<view class="page-add">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<uni-icons type="arrow-left" size="24" color="#4b6646"></uni-icons>
				<text class="nav-title">添加物品</text>
			</view>
			<view class="nav-right">
				<text class="save-btn" @click="handleSave">保存</text>
			</view>
		</view>

		<scroll-view scroll-y class="main-content">
			<view class="content-wrapper">
				<!-- 图片上传区域 -->
				<view class="upload-section">
					<view class="dashed-border" @click="chooseImage">
						<view class="upload-box" v-if="!tempFilePath">
							<view class="icon-circle">
								<uni-icons type="camera-filled" size="32" color="#4b6646"></uni-icons>
							</view>
							<text class="upload-text">点击上传物品照片</text>
							<text class="upload-tip">支持 JPG, PNG, HEIC</text>
						</view>
						<image v-else :src="tempFilePath" mode="aspectFill" class="preview-img"></image>
					</view>
				</view>

				<!-- 基础信息表单 -->
				<view class="form-section">
					<view class="info-card">
						<view class="form-item">
							<text class="label">物品名称</text>
							<input class="input-field" type="text" placeholder="输入物品名称..." v-model="formData.name" />
						</view>
						
						<view class="grid-row">
							<view class="form-item half">
								<text class="label">价格 (¥)</text>
								<input class="input-field" type="digit" placeholder="0.00" v-model="formData.price" @input="calculateCost" />
							</view>
							<view class="form-item half">
								<text class="label">购入日期</text>
								<picker mode="date" :value="formData.buyDate" @change="onDateChange">
									<view class="picker-box">
										<text :class="{ 'placeholder': !formData.buyDate }">{{ formData.buyDate || 'yyyy/mm/dd' }}</text>
										<uni-icons type="calendar" size="18" color="#797c72"></uni-icons>
									</view>
								</picker>
							</view>
						</view>
					<view class="grid-row">
						<view class="form-item half">
							<text class="label">生产日期</text>
							<picker mode="date" :value="formData.productionDate" @change="onProdDateChange">
								<view class="picker-box">
									<text :class="{ 'placeholder': !formData.productionDate }">{{ formData.productionDate || 'yyyy/mm/dd' }}</text>
									<uni-icons type="calendar" size="18" color="#797c72"></uni-icons>
								</view>
							</picker>
						</view>
						<view class="form-item half">
							<text class="label">保质期 (天)</text>
							<input class="input-field" type="number" placeholder="输入天数" v-model="formData.shelfLife" />
						</view>
					</view>
				</view>

				<!-- 成本估算卡片 -->
					<view class="cost-card-box">
						<view class="cost-card">
							<view class="deco-icon">
								<uni-icons type="paperplane-filled" size="64" color="#4b6646" style="opacity: 0.1;"></uni-icons>
							</view>
							<view class="card-header">
								<uni-icons type="tune-filled" size="20" color="#4b6646"></uni-icons>
								<text class="title">成本估算</text>
							</view>
							<view class="card-body">
								<view class="form-item no-margin">
									<text class="label on-container">预计使用天数</text>
									<input class="input-field transparent" type="number" placeholder="365" v-model="formData.estimatedDays" @input="calculateCost" />
								</view>
								<view class="cost-display">
									<text class="cost-label">预估日均成本</text>
									<view class="cost-value-box">
										<text class="symbol">¥</text>
										<text class="value">{{ dailyCost }}</text>
										<text class="unit">/天</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 存放区域 -->
					<view class="selection-section">
						<view class="section-header">
							<text class="label">存放区域</text>
							<uni-icons type="right" size="14" color="#797c72"></uni-icons>
						</view>
						<scroll-view scroll-x class="chip-scroll" :show-scrollbar="false">
						<view class="chip-list">
							<view 
								v-for="(areaName, index) in itemStore.areaNames" 
								:key="index" 
								class="chip-item" 
								:class="{ active: formData.area === areaName }"
								@click="formData.area = areaName"
							>
								{{ areaName }}
							</view>
							<view class="chip-add" @click="handleAddArea">
								<uni-icons type="plus" size="18" color="#797c72"></uni-icons>
							</view>
						</view>
					</scroll-view>
					</view>

					<!-- 标签 -->
					<view class="selection-section">
						<text class="label">标签</text>
						<view class="tag-list">
							<view 
								v-for="(tag, index) in itemStore.tags" 
								:key="index" 
								class="tag-item" 
								:class="{ active: formData.tags.includes(tag) }"
								@click="toggleTag(tag)"
							>
								<view class="tag-dot" v-if="formData.tags.includes(tag)"></view>
								<text>{{ tag }}</text>
							</view>
							<view class="tag-add" @click="handleAddTag">
								<uni-icons type="plus" size="12" color="#797c72"></uni-icons>
								<text>添加标签</text>
							</view>
						</view>
					</view>

					<!-- 备注 -->
					<view class="form-item">
						<text class="label">备注</text>
						<textarea class="textarea-field" placeholder="记录关于物品的故事或保养方式..." v-model="formData.remark" />
					</view>
				</view>

				<view class="footer-spacer"></view>
			</view>
		</scroll-view>

		<!-- 底部操作按钮 -->
		<view class="footer-action">
			<button class="confirm-btn" @click="handleSave">确认保存</button>
		</view>

		<!-- 装饰性 SVG -->
		<view class="deco-scribble">
			<svg width="60" height="60" viewBox="0 0 100 100" fill="none">
				<path d="M10 50C10 50 30 10 50 10C70 10 90 50 90 50C90 50 70 90 50 90C30 90 10 50 10 50Z" stroke="#5f6056" stroke-opacity="0.2" stroke-width="2" />
				<circle cx="50" cy="50" r="15" stroke="#5f6056" stroke-opacity="0.2" stroke-width="2" />
			</svg>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useItemStore } from '@/stores/item';

const itemStore = useItemStore();

const tempFilePath = ref('');
const dailyCost = ref('0.00');

const formData = reactive({
	name: '',
	price: '',
	buyDate: '',
	productionDate: '',
	shelfLife: '',
	estimatedDays: 365,
	area: '客厅',
	tags: ['数码产品'],
	remark: ''
});

const goBack = () => {
	uni.navigateBack();
};

const chooseImage = () => {
	uni.chooseImage({
		count: 1,
		success: (res) => {
			tempFilePath.value = res.tempFilePaths[0];
		}
	});
};

const onDateChange = (e) => {
	formData.buyDate = e.detail.value;
};

const onProdDateChange = (e) => {
	formData.productionDate = e.detail.value;
};

const calculateCost = () => {
	const price = parseFloat(formData.price) || 0;
	const days = parseInt(formData.estimatedDays) || 1;
	dailyCost.value = (price / days).toFixed(2);
};

const toggleTag = (tag) => {
	const index = formData.tags.indexOf(tag);
	if (index > -1) {
		formData.tags.splice(index, 1);
	} else {
		formData.tags.push(tag);
	}
};

const handleAddTag = () => {
	uni.showModal({
		title: '添加新标签',
		editable: true,
		placeholderText: '请输入标签名称',
		success: (res) => {
			if (res.confirm && res.content) {
				const newTag = res.content.trim();
				if (newTag) {
					itemStore.addTag(newTag);
					if (!formData.tags.includes(newTag)) {
						formData.tags.push(newTag);
					}
				}
			}
		}
	});
};

const handleAddArea = () => {
	uni.showModal({
		title: '添加新区域',
		editable: true,
		placeholderText: '请输入区域名称',
		success: (res) => {
			if (res.confirm && res.content) {
				const newArea = res.content.trim();
				if (newArea) {
					itemStore.addArea(newArea);
					formData.area = newArea;
				}
			}
		}
	});
};

const handleSave = () => {
	if (!formData.name) {
		uni.showToast({ title: '请输入物品名称', icon: 'none' });
		return;
	}
	
	uni.showLoading({ title: '保存中...' });
	
	// 准备保存的数据
	const itemToSave = {
		...formData,
		image: tempFilePath.value || 'https://via.placeholder.com/150', // 默认占位图
		cost: `¥${dailyCost.value}`
	};
	
	setTimeout(() => {
		itemStore.addItem(itemToSave);
		uni.hideLoading();
		uni.showToast({ title: '保存成功' });
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	}, 800);
};
</script>

<style lang="scss">
	.page-add {
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
				font-size: 32rpx;
				font-weight: bold;
				color: $shouna-primary;
			}
		}
		
		.save-btn {
			font-size: 28rpx;
			font-weight: bold;
			color: $shouna-primary;
		}
	}

	.main-content {
		flex: 1;
		padding-top: calc(100rpx + var(--status-bar-height));
	}

	.content-wrapper {
		padding: 0 $shouna-page-padding;
	}

	/* 上传区域 */
	.upload-section {
		margin-bottom: 60rpx;
		
		.dashed-border {
			width: 100%;
			aspect-ratio: 1/1;
			background-color: $shouna-surface-container-low;
			border-radius: 64rpx;
			border: 2rpx dashed $shouna-surface-variant;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			position: relative;
			
			.upload-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.icon-circle {
					width: 128rpx;
					height: 128rpx;
					background-color: $shouna-primary-container;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 32rpx;
				}
				
				.upload-text {
					font-size: 28rpx;
					font-weight: 600;
					color: $shouna-on-surface;
					margin-bottom: 8rpx;
				}
				
				.upload-tip {
					font-size: 22rpx;
					color: $shouna-tertiary;
				}
			}
			
			.preview-img {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 表单部分 */
	.form-section {
		display: flex;
		flex-direction: column;
		gap: 60rpx;
	}

	.info-card {
		background-color: $shouna-surface-container-lowest;
		border-radius: 32rpx;
		padding: 48rpx;
		display: flex;
		flex-direction: column;
		gap: 48rpx;
	}

	.form-item {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		
		&.half {
			flex: 1;
		}
		
		&.no-margin {
			gap: 4rpx;
		}
		
		.label {
			font-size: 22rpx;
			font-weight: bold;
			color: $shouna-tertiary;
			margin-left: 4rpx;
			
			&.on-container {
				color: rgba($shouna-on-primary-container, 0.7);
			}
		}
		
		.input-field {
			background-color: $shouna-surface-container-high;
			height: 96rpx;
			border-radius: 24rpx;
			padding: 0 32rpx;
			font-size: 28rpx;
			color: $shouna-on-surface;
			
			&.transparent {
				background-color: rgba(255, 255, 255, 0.6);
			}
		}
		
		.textarea-field {
			background-color: $shouna-surface-container-high;
			width: 100%;
			height: 240rpx;
			border-radius: 24rpx;
			padding: 24rpx 32rpx;
			font-size: 28rpx;
			color: $shouna-on-surface;
			box-sizing: border-box;
		}
	}

	.grid-row {
		display: flex;
		gap: 32rpx;
	}

	.picker-box {
		background-color: $shouna-surface-container-high;
		height: 96rpx;
		border-radius: 24rpx;
		padding: 0 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		text {
			font-size: 28rpx;
			color: $shouna-on-surface;
			
			&.placeholder {
				color: rgba($shouna-on-surface-variant, 0.6);
			}
		}
	}

	/* 成本卡片 */
	.cost-card-box {
		.cost-card {
			background-color: rgba($shouna-primary-container, 0.3);
			border-radius: 32rpx;
			padding: 48rpx;
			position: relative;
			overflow: hidden;
			
			.deco-icon {
				position: absolute;
				top: -30rpx;
				right: -30rpx;
				transform: rotate(15deg);
			}
			
			.card-header {
				display: flex;
				align-items: center;
				gap: 16rpx;
				margin-bottom: 32rpx;
				
				.title {
					font-size: 28rpx;
					font-weight: bold;
					color: $shouna-on-primary-container;
				}
			}
			
			.card-body {
				display: flex;
				flex-direction: column;
				gap: 32rpx;
			}
			
			.cost-display {
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				padding-top: 16rpx;
				
				.cost-label {
					font-size: 26rpx;
					color: rgba($shouna-on-primary-container, 0.8);
				}
				
				.cost-value-box {
					display: flex;
					align-items: baseline;
					gap: 4rpx;
					
					.symbol {
						font-size: 28rpx;
						font-weight: 800;
						color: $shouna-primary;
					}
					
					.value {
						font-size: 48rpx;
						font-weight: 800;
						color: $shouna-primary;
					}
					
					.unit {
						font-size: 22rpx;
						color: rgba($shouna-on-primary-container, 0.6);
						margin-left: 4rpx;
					}
				}
			}
		}
	}

	/* 选项部分 */
	.selection-section {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		
		.chip-scroll {
			margin: 0 (-$shouna-page-padding);
			width: calc(100% + 2 * #{$shouna-page-padding});
			
			.chip-list {
				display: inline-flex;
				padding: 0 $shouna-page-padding;
				gap: 24rpx;
			}
			
			.chip-item {
				padding: 16rpx 48rpx;
				background-color: $shouna-surface-container-high;
				border-radius: 100rpx;
				font-size: 26rpx;
				font-weight: 600;
				color: $shouna-on-surface-variant;
				white-space: nowrap;
				transition: all 0.2s;
				
				&.active {
					background-color: $shouna-primary;
					color: #fff;
				}
			}
			
			.chip-add {
				width: 80rpx;
				height: 80rpx;
				background-color: $shouna-surface-container-high;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.tag-list {
			display: flex;
			flex-wrap: wrap;
			gap: 16rpx;
			
			.tag-item {
				padding: 12rpx 28rpx;
				background-color: $shouna-surface-container-high;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				gap: 12rpx;
				
				text {
					font-size: 24rpx;
					font-weight: 600;
					color: $shouna-on-surface-variant;
				}
				
				.tag-dot {
					width: 10rpx;
					height: 10rpx;
					background-color: $shouna-primary;
					border-radius: 50%;
				}
				
				&.active {
					background-color: $shouna-primary-container;
					
					text {
						color: $shouna-on-primary-container;
					}
				}
			}
			
			.tag-add {
				padding: 12rpx 28rpx;
				border: 1rpx solid rgba($shouna-tertiary, 0.2);
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				gap: 8rpx;
				
				text {
					font-size: 24rpx;
					color: $shouna-tertiary;
				}
			}
		}
	}

	.footer-spacer {
		height: 280rpx;
	}

	/* 底部操作 */
	.footer-action {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 32rpx $shouna-page-padding 80rpx;
		background-color: rgba($shouna-background, 0.8);
		backdrop-filter: blur(10px);
		z-index: 100;
		
		.confirm-btn {
			height: 112rpx;
			background: linear-gradient(to right, $shouna-primary, $shouna-primary-dim);
			color: #fff;
			border-radius: 100rpx;
			font-size: 32rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 16rpx 32rpx rgba($shouna-primary, 0.2);
			
			&:active {
				transform: scale(0.98);
			}
		}
	}

	.deco-scribble {
		position: fixed;
		top: 240rpx;
		right: 32rpx;
		opacity: 0.3;
		pointer-events: none;
		z-index: 1;
	}
</style>
