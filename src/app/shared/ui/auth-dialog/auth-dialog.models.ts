export interface AuthDialogInput {
  isExistingUser: boolean;
}

export interface AuthDialogResult {
  isExistingUser?: boolean;
  userName: string;
  password: string;
  confirmPassword?: string;
  code?: string;
}
