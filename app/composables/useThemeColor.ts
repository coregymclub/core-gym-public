// Set iOS Safari theme-color
export function useThemeColor(color: string = '#1a1a1a') {
  useHead({
    meta: [
      { name: 'theme-color', content: color }
    ]
  })
}
