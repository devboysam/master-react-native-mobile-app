import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ModulesScreen from '../screens/ModulesScreen';
import LessonsScreen from '../screens/LessonsScreen';
import LessonReaderScreen from '../screens/LessonReaderScreen';
import ReadLaterScreen from '../screens/ReadLaterScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { getFloatingTabBarStyle } from '../components/FloatingTabBarStyle';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



function ModulesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ModulesRoot" component={ModulesScreen} options={{ title: 'Modules' }} />
      <Stack.Screen name="ModuleDetails" component={LessonsScreen} options={{ title: 'Module Details' }} />
      <Stack.Screen name="LessonReader" component={LessonReaderScreen} options={{ title: 'Read Lesson' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: getFloatingTabBarStyle(theme),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Modules: focused ? 'grid' : 'grid-outline',
            Bookmarks: focused ? 'bookmark' : 'bookmark-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          };

          return <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Modules" component={ModulesStack} />
      <Tab.Screen name="Bookmarks" component={ReadLaterScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );

}
