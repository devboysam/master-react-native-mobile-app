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
    shadowColor: theme.mode === 'dark' ? '#000000' : '#061736',
    shadowOpacity: theme.mode === 'dark' ? 0.38 : 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    paddingBottom: 8,
    paddingTop: 8,
  };
}
