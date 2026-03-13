import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ModulesScreen from '../screens/ModulesScreen';
import LessonsScreen from '../screens/LessonsScreen';
import LessonReaderScreen from '../screens/LessonReaderScreen';
import ReadLaterScreen from '../screens/ReadLaterScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { floatingTabBarStyle } from '../components/FloatingTabBarStyle';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ModulesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ModulesRoot" component={ModulesScreen} options={{ title: 'Modules' }} />
      <Stack.Screen name="ModuleDetails" component={LessonsScreen} options={{ title: 'Module Details' }} />
      <Stack.Screen name="LessonReader" component={LessonReaderScreen} options={{ title: 'Read Lesson' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: floatingTabBarStyle,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Modules" component={ModulesStack} />
      <Tab.Screen name="Bookmarks" component={ReadLaterScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
