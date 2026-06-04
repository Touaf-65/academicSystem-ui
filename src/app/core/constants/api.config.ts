export const API_CONFIG = {
  BASE_URL: 'http://localhost:8090',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      // LOGOUT: '/auth/logout',
    },
    DEPARTMENT: {
      BASE: '/departments',
    },
    PROGRAM: {
      BASE: '/programs',
    },
    CYCLE: {
      BASE: '/cycles',
    },
    LEVEL: {
      BASE: '/academic-levels',
    },
    CLASS: {
      BASE: '/classrooms',
    },
    BUILDING: {
      BASE: '/buildings',
    },
    FLOOR: {
      BASE: '/floors',
    },
    ROOM: {
      BASE: '/rooms',
    },
    TEACHER: {
      BASE: '/teachers',
    },
    COURSE: {
      BASE: '/courses',
    },
  },
};
