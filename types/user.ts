export interface User {
  id: string;
  name: string;
  state: string;
  district: string;
  profileImage?: string;
  contributionCredits?: number;
}

export interface Representative {
  id: string;
  name: string;
  position: string;
  state: string;
  district?: string;
  party: string;
  profileImage: string;
  contact?: string;
  biography?: string;
  committees?: string[];
  recentEvents?: { title: string; date: string; description?: string }[];
  stats?: {
    productivityScore?: number;
    attendanceRate?: number;
    bipartisanIndex?: number;
  };
}

export interface Interest {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
}

export interface Agency {
  id: string;
  name: string;
  level: "federal" | "state" | "county" | "city" | "neighborhood";
  description?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Discussion {
  id: string;
  title: string;
  comments: Comment[];
  participants: number;
}
