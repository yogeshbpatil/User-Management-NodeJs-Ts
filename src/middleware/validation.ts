import { Request, Response, NextFunction } from "express";
import { CreateUserRequest } from "../types/user";

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
