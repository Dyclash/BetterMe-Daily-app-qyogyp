
import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

// Ultra-modern dark luxury color palette
export const colors = {
  // Primary colors - Jet Black, Neon Blue, Cyan
  background: '#0A0A0A',
  backgroundSecondary: '#1A1A1A',
  backgroundTertiary: '#2A2A2A',
  
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#707070',
  
  primary: '#00D9FF',
  secondary: '#00FFF0',
  accent: '#00D9FF',
  
  card: '#1A1A1A',
  cardBorder: '#2A2A2A',
  
  highlight: '#00FFF0',
  success: '#00FF88',
  error: '#FF3366',
  warning: '#FFB800',
  
  border: '#2A2A2A',
  
  // Glassmorphism overlays
  glassLight: 'rgba(255, 255, 255, 0.05)',
  glassMedium: 'rgba(255, 255, 255, 0.08)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
  
  // Neon glow colors
  neonBlue: '#00D9FF',
  neonCyan: '#00FFF0',
  neonPurple: '#B026FF',
  neonPink: '#FF006E',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: `0 0 30px ${colors.neonBlue}20, 0 8px 32px rgba(0, 0, 0, 0.4)`,
      },
      default: {
        shadowColor: colors.neonBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }
    }),
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  // Ultra-modern glassmorphism card style
  glassCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    borderColor: 'rgba(0, 217, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: `0 0 40px ${colors.neonBlue}30, 0 8px 32px rgba(0, 0, 0, 0.5)`,
      },
      default: {
        shadowColor: colors.neonBlue,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
      }
    }),
  },
});
