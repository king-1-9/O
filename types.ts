export type ThemeMode = 'light' | 'dark' | 'boy' | 'girl';
export type Language = 'en' | 'ar';

export interface Subject {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
}

export interface StudyFile {
  id: string;
  subjectId: string;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'zip' | 'video';
  url: string; // In a real app, this is a cloud URL. Here we simulate or use base64/placeholder.
  downloads: number;
  ratingSum: number;
  ratingCount: number;
  uploadedAt: string;
}

export interface SummaryRequest {
  id: string;
  studentName: string;
  subjectId: string;
  comments: string;
  status: 'pending' | 'completed';
}

export interface User {
  id: string;
  username: string;
  password?: string; // Stored for mock auth purposes
  role: 'admin' | 'super_admin' | 'editor' | 'student';
  fullName?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}