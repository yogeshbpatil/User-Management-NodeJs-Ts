import { Request, Response, NextFunction } from "express";
import { CreateUserRequest, UpdateUserRequest } from "../types/user";

export const validateUserRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userData: CreateUserRequest = req.body;
  const errors: string[] = [];

  // Full Name validation
  if (!userData.fullName || userData.fullName.trim().length < 2) {
    errors.push("Full Name is required and must be at least 2 characters long");
  }

  // Mobile Number validation (10 digits)
  const mobileRegex = /^\d{10}$/;
  if (!userData.mobileNumber || !mobileRegex.test(userData.mobileNumber)) {
    errors.push("Mobile Number must be exactly 10 digits");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.emailAddress || !emailRegex.test(userData.emailAddress)) {
    errors.push("Valid Email Address is required");
  }

  // Date of Birth validation (mm/dd/yyyy format)
  const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!userData.dateOfBirth || !dobRegex.test(userData.dateOfBirth)) {
    errors.push("Date of Birth must be in mm/dd/yyyy format");
  }

  // Address Line 1 validation
  if (!userData.addressLine1 || userData.addressLine1.trim().length < 5) {
    errors.push(
      "Address Line 1 is required and must be at least 5 characters long"
    );
  }

  // City validation
  if (!userData.city || userData.city.trim().length < 2) {
    errors.push("City is required and must be at least 2 characters long");
  }

  // Pin Code validation (6 digits)
  const pinCodeRegex = /^\d{6}$/;
  if (!userData.pinCode || !pinCodeRegex.test(userData.pinCode)) {
    errors.push("Pin Code must be exactly 6 digits");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
    return;
  }

  next();
};

export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userData: UpdateUserRequest = req.body;
  const errors: string[] = [];

  // For update, fields are optional but if provided, must be valid

  // Full Name validation (if provided)
  if (userData.fullName !== undefined) {
    if (userData.fullName.trim().length < 2) {
      errors.push("Full Name must be at least 2 characters long");
    }
  }

  // Mobile Number validation (if provided)
  if (userData.mobileNumber !== undefined) {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(userData.mobileNumber)) {
      errors.push("Mobile Number must be exactly 10 digits");
    }
  }

  // Email validation (if provided)
  if (userData.emailAddress !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.emailAddress)) {
      errors.push("Valid Email Address is required");
    }
  }

  // Date of Birth validation (if provided)
  if (userData.dateOfBirth !== undefined) {
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dobRegex.test(userData.dateOfBirth)) {
      errors.push("Date of Birth must be in mm/dd/yyyy format");
    }
  }

  // Address Line 1 validation (if provided)
  if (userData.addressLine1 !== undefined) {
    if (userData.addressLine1.trim().length < 5) {
      errors.push("Address Line 1 must be at least 5 characters long");
    }
  }

  // City validation (if provided)
  if (userData.city !== undefined) {
    if (userData.city.trim().length < 2) {
      errors.push("City must be at least 2 characters long");
    }
  }

  // Pin Code validation (if provided)
  if (userData.pinCode !== undefined) {
    const pinCodeRegex = /^\d{6}$/;
    if (!pinCodeRegex.test(userData.pinCode)) {
      errors.push("Pin Code must be exactly 6 digits");
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
    return;
  }

  next();
};
