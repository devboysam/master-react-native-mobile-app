const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://master-react-native-backend-production.up.railway.app';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || 'Request failed');
  }

  return json.data;
}

export function getModules() {
  return request('/api/modules');
}

export function getModuleById(moduleId) {
  return request(`/api/modules/${moduleId}`);
}

export function getLessonsByModule(moduleId) {
  return request(`/api/modules/${moduleId}/lessons`);
}

export function getAppContent() {
  return request('/api/app-content');
}

export function getLessonById(lessonId) {
  return request(`/api/lessons/${lessonId}`);
}
