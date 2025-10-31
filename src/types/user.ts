export interface User {
  _id?: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string; // Store as DD/MM/YYYY
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string; // DD/MM/YYYY format
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  dateOfBirth?: string; // DD/MM/YYYY format
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pinCode?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  showing: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
