import create from 'zustand'

export const useDeviceStore = create((set) => ({
  isMobile: false,
  themeState: "light",
  setMobile: (state) => set({ isMobile: state }),
  setThemeState: (state) => set({ themeState: state }),
}))

//     import { useThemeStore} from '../stores/themeStore'
//     const updateTheme = useThemeStore((state) => state.updateTheme);
//     updateTheme(newVal);
//     const actTheme = useThemeStore((state) => state.theme)