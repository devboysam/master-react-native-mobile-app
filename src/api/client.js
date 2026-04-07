const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://api.masterreactnative.dev';

const REQUEST_TIMEOUT = 30000; // 30 seconds

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      signal: controller.signal,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.message || 'Request failed');
    }

    return json.data;
  } finally {
    clearTimeout(timeout);
  }
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
