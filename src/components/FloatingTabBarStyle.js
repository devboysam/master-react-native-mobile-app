export function getFloatingTabBarStyle(theme) {
  return {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    borderRadius: 20,
    height: 66,
    backgroundColor: theme.colors.card,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#0f172a',
    shadowOpacity: theme.mode === 'dark' ? 0.32 : 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    paddingBottom: 8,
    paddingTop: 8,
  };
}
