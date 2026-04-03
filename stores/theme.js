import { defineStore } from 'pinia';

const hexToRgb = (hex) => {
	const h = String(hex || '').replace('#', '').trim();
	if (h.length !== 6) return '0, 0, 0';
	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);
	if ([r, g, b].some(v => Number.isNaN(v))) return '0, 0, 0';
	return `${r}, ${g}, ${b}`;
};

const THEMES = [
	{
		key: 'morandi',
		name: '莫兰迪绿',
		desc: '浅色',
		primary: '#4b6646',
		primaryDim: '#3f5a3a',
		primaryContainer: '#ccebc2',
		secondary: '#4f6549',
		tertiary: '#5f6056'
	},
	{
		key: 'coffee',
		name: '咖啡豆棕',
		desc: '暖调',
		primary: '#6b4f3b',
		primaryDim: '#5a3f2c',
		primaryContainer: '#e8d7c8',
		secondary: '#7a5a43',
		tertiary: '#6b625a'
	},
	{
		key: 'ocean',
		name: '海盐蓝',
		desc: '清爽',
		primary: '#2f5f7a',
		primaryDim: '#264e64',
		primaryContainer: '#c7e6f4',
		secondary: '#356b86',
		tertiary: '#5b6670'
	},
	{
		key: 'sunset',
		name: '落日橙',
		desc: '活力',
		primary: '#a15a2a',
		primaryDim: '#874a22',
		primaryContainer: '#ffd9c2',
		secondary: '#b86a33',
		tertiary: '#6b625a'
	},
	{
		key: 'lavender',
		name: '薰衣草紫',
		desc: '温柔',
		primary: '#5b4a7a',
		primaryDim: '#4b3d64',
		primaryContainer: '#e3d8ff',
		secondary: '#67558a',
		tertiary: '#6b625a'
	}
];

export const useThemeStore = defineStore('theme', {
	state: () => ({
		themeKey: uni.getStorageSync('shouna_theme') || 'morandi'
	}),
	getters: {
		themes: () => THEMES,
		currentTheme: (state) => THEMES.find(t => t.key === state.themeKey) || THEMES[0],
		cssVars() {
			const t = this.currentTheme;
			return {
				'--shouna-primary': t.primary,
				'--shouna-primary-rgb': hexToRgb(t.primary),
				'--shouna-primary-dim': t.primaryDim,
				'--shouna-primary-dim-rgb': hexToRgb(t.primaryDim),
				'--shouna-primary-container': t.primaryContainer,
				'--shouna-primary-container-rgb': hexToRgb(t.primaryContainer),
				'--shouna-secondary': t.secondary,
				'--shouna-secondary-rgb': hexToRgb(t.secondary),
				'--shouna-tertiary': t.tertiary,
				'--shouna-tertiary-rgb': hexToRgb(t.tertiary)
			};
		}
	},
	actions: {
		setTheme(key) {
			const next = THEMES.find(t => t.key === key);
			if (!next) return;
			this.themeKey = next.key;
			uni.setStorageSync('shouna_theme', next.key);
		}
	}
});

