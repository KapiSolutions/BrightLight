import create from 'zustand'

export const useDeviceStore = create((set) => ({
  isMobile: false,
  themeState: "light",
  lang: "en",
  currency: "usd",
  setMobile: (state) => set({ isMobile: state }),
  setThemeState: (state) => set({ themeState: state }),
  setLang: (state) => set({ lang: state }),
  setCurrency: (state) => set({ currency: state }),
}))

//     import { useThemeStore} from '../stores/themeStore'
//     const updateTheme = useThemeStore((state) => state.updateTheme);
//     updateTheme(newVal);
//     const actTheme = useThemeStore((state) => state.theme)