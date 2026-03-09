const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000';

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

export function getLessonsByModule(moduleId) {
  return request(`/api/modules/${moduleId}/lessons`);
}

export function getLessonById(lessonId) {
  return request(`/api/lesson/${lessonId}`);
}
