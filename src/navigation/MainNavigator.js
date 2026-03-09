import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LessonsScreen from '../screens/LessonsScreen';
import LessonReaderScreen from '../screens/LessonReaderScreen';
import { floatingTabBarStyle } from '../components/FloatingTabBarStyle';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeModules" component={HomeScreen} options={{ title: 'Modules' }} />
      <Stack.Screen name="LessonsList" component={LessonsScreen} options={{ title: 'Lessons' }} />
      <Stack.Screen name="LessonReader" component={LessonReaderScreen} options={{ title: 'Read Lesson' }} />
    </Stack.Navigator>
  );
}

function LessonsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LessonsRoot" component={LessonsScreen} options={{ title: 'Lessons' }} />
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Lessons" component={LessonsStack} />
    </Tab.Navigator>
  );
}
