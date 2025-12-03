import { Subject, StudyFile, SummaryRequest, User } from '../types';
import { INITIAL_SUBJECTS } from '../constants';

const KEYS = {
  SUBJECTS: 'it_hub_subjects',
  FILES: 'it_hub_files',
  REQUESTS: 'it_hub_requests',
  USERS: 'it_hub_users', // Renamed to store list of users
  CURRENT_USER: 'it_hub_current_user',
};

// Initialize if empty
const init = () => {
  if (!localStorage.getItem(KEYS.SUBJECTS)) {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  }
  if (!localStorage.getItem(KEYS.FILES)) {
    localStorage.setItem(KEYS.FILES, JSON.stringify([]));
  }
  
  // Initialize default Admin User if not exists
  const storedUsers = localStorage.getItem(KEYS.USERS);
  if (!storedUsers) {
    const defaultAdmin: User = {
      id: '1',
      username: 'Ahmed@Ali',
      password: 'Ahmed@Ali', // In a real app, hash this!
      role: 'super_admin',
      fullName: 'Ahmed Ali',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify([defaultAdmin]));
  }
};

init();

export const StorageService = {
  // Subject Management
  getSubjects: (): Subject[] => {
    return JSON.parse(localStorage.getItem(KEYS.SUBJECTS) || '[]');
  },

  addSubject: (subject: Subject): void => {
    const subjects = StorageService.getSubjects();
    subjects.push(subject);
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  deleteSubject: (id: string): void => {
    const subjects = StorageService.getSubjects();
    // Also delete associated files to keep clean
    const files = StorageService.getFiles();
    const newFiles = files.filter(f => f.subjectId !== id);
    localStorage.setItem(KEYS.FILES, JSON.stringify(newFiles));

    const newSubjects = subjects.filter(s => s.id !== id);
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(newSubjects));
  },

  // File Management
  getFiles: (subjectId?: string): StudyFile[] => {
    const files: StudyFile[] = JSON.parse(localStorage.getItem(KEYS.FILES) || '[]');
    if (subjectId) {
      return files.filter(f => f.subjectId === subjectId);
    }
    return files;
  },

  addFile: (file: StudyFile): void => {
    const files = StorageService.getFiles();
    files.push(file);
    localStorage.setItem(KEYS.FILES, JSON.stringify(files));
  },

  deleteFile: (id: string): void => {
    const files = StorageService.getFiles();
    const newFiles = files.filter(f => f.id !== id);
    localStorage.setItem(KEYS.FILES, JSON.stringify(newFiles));
  },

  rateFile: (id: string, rating: number): void => {
    const files = StorageService.getFiles();
    const idx = files.findIndex(f => f.id === id);
    if (idx !== -1) {
      files[idx].ratingSum += rating;
      files[idx].ratingCount += 1;
      localStorage.setItem(KEYS.FILES, JSON.stringify(files));
    }
  },

  incrementDownload: (id: string): void => {
    const files = StorageService.getFiles();
    const idx = files.findIndex(f => f.id === id);
    if (idx !== -1) {
      files[idx].downloads += 1;
      localStorage.setItem(KEYS.FILES, JSON.stringify(files));
    }
  },

  saveRequest: (request: SummaryRequest): void => {
    const requests: SummaryRequest[] = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    requests.push(request);
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
  },
  
  getRequests: (): SummaryRequest[] => {
    return JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
  },

  // User Management
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  addUser: (user: User): void => {
    const users = StorageService.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (user: User): void => {
    const users = StorageService.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      // Update current session if it's the same user
      const currentUser = StorageService.getUser();
      if (currentUser && currentUser.id === user.id) {
        StorageService.login(user);
      }
    }
  },

  deleteUser: (id: string): void => {
    const users = StorageService.getUsers();
    // Prevent deleting the last admin
    if (users.length <= 1) return; 
    const newUsers = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(newUsers));
  },

  validateUser: (username: string, password: string): User | null => {
    const users = StorageService.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
  },

  login: (user: User) => {
    // We store the full object to keep track of ID for updates, 
    // but purely locally. In real app, store token.
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getUser: (): User | null => {
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  }
};