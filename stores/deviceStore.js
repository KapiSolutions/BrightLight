import create from 'zustand'

export const useDeviceStore = create((set) => ({
  isMobile: false,
  setMobile: (state) => set({ isMobile: state }),
}))

//     import { useThemeStore} from '../stores/themeStore'
//     const updateTheme = useThemeStore((state) => state.updateTheme);
//     updateTheme(newVal);
//     const actTheme = useThemeStore((state) => state.theme)