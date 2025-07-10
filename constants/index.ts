export const quickNav = [
    {
        id: 1,
        title: 'Check Symptoms',
        subtitle: "Input your symptoms",
        icon: 'medical-outline',
        color: 'primary',
        screen: "/(tabs)/symptoms",
    },
    {
        id: 2,
        title: 'View Progress',
        subtitle: "Track your health",
        icon: 'trending-up-outline',
        color: 'success',
        screen: "/(tabs)/progress",

    },
    {
        id: 3,
        title: 'Set Reminders',
        subtitle: "Never miss a dose",
        icon: 'notifications-outline',
        color: 'warning',
        screen: "/(tabs)/reminders",
    },
    {
    id: 4,
    title: "Edit Profile",
    subtitle: "Personal info",
    icon: "person-outline",
    color: "info",
    screen: "/edit-profile", // dynamic route, not inside tabs
  },
]

export const colors= {
    primary: '#4A90E2', // Beautiful blue
    secondary: '#7BB3F0', // Lighter blue
    tertiary: '#E8F4FD', // Very light blue
    background: '#FFFFFF', // Pure white
    surface: '#F8FBFF', // Slightly tinted white
    white: '#FFFFFF',
    lightGray: '#F5F7FA',
    gray: '#9CA3AF',
    darkGray: '#6B7280',
    text: '#1F2937',
    textSecondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }

  import loginGraphic from "@/assets/images/loginGraphics1.jpg";

  export const images = {
    loginGraphic
  }