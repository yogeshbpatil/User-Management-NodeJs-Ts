export interface User {
  _id?: string; // Changed to string for frontend compatibility
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pinCode?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  total?: number;
  showing?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  showing: number;
}
