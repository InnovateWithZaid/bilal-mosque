export interface Mosque {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'mosque' | 'musallah';
  iqamahTimes: IqamahTimes;
  jummahTimes: string[];
  eidAvailable: boolean;
  adminUids: string[];
  lastUpdatedAt: Date;
  distance?: number;
}

export interface IqamahTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export type AnnouncementType = 'talk' | 'salah_update' | 'janazah' | 'notice';

export interface Announcement {
  id: string;
  mosqueId: string;
  type: AnnouncementType;
  title: string;
  description: string;
  eventTime?: Date;
  createdAt: Date;
}

export type ReportStatus = 'pending' | 'reviewed';
export type IssueType = 'wrong_times' | 'wrong_location' | 'closed' | 'other';

export interface Report {
  id: string;
  mosqueId: string;
  issueType: IssueType;
  description: string;
  status: ReportStatus;
  createdAt: Date;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  role: 'user' | 'mosque_admin' | 'core_admin';
  followedMosques: string[];
}
