import create from 'zustand'

export const useThemeStore = create((set) => ({
  theme: 'light',
  updateTheme: (theme) => set({ theme: theme }),
  log: (theme) => console.log(theme),
}))

//     import { useThemeStore} from '../stores/themeStore'
//     const updateTheme = useThemeStore((state) => state.updateTheme);
//     updateTheme(newVal);
//     const actTheme = useThemeStore((state) => state.theme)