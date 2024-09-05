import {
  isSignInWithEmailLink,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithEmailLink,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  linkWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
  signOut,
  User,
  AuthCredential,
} from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { saveToken, removeToken } from "@/utils/token";
import instance from "@/utils/axios";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
    verificationId: string;
  }
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  otp: string;
}

const errorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/invalid-verification-code":
      return "The OTP entered is invalid or expired. Please check the code and try again.";
    case "auth/email-already-in-use":
      return "This email is already linked with another account.";
    case "auth/credential-already-in-use":
      return "This phone number is already linked with another account.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email address but different sign-in credentials. Please sign in using a provider associated with this email address.";
    case "auth/phone-number-already-exists":
      return "This phone number is already linked with another account.";
    case "auth/invalid-verification-id":
      return "The verification ID is invalid. Please try again.";
    case "auth/missing-verification-code":
      return "Please enter the OTP code sent to your phone number.";
    case "auth/invalid-phone-number":
      return "The phone number entered is invalid. Please enter a valid phone number.";
    case "auth/missing-verification-code":
      return "Please enter the OTP code sent to your phone number.";
    case "auth/missing-verification-id":
      return "The verification ID is missing. Please try again.";

    default:
      return "An unexpected error occurred. Please try again.";
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();
    saveToken(token);
    return userCredential;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signUpWithEmailPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    return { status: "success", emailUser: user };
  } catch (error) {
    console.error("Error signing up with email and password:", error);
    return { status: "fail", error };
  }
};

export const signInWithEmailPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    saveToken(token);
    return { status: "success", result: userCredential };
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    return { status: "fail", error };
  }
};

export const sendVerifyEmailLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/user/finishLogin`,
    handleCodeInApp: true,
  };
  try {
    const response = await sendSignInLinkToEmail(
      auth,
      email,
      actionCodeSettings
    );
    console.log("Email sent:", response);
    window.localStorage.setItem("emailForSignIn", email);

    return { status: "success", response };
  } catch (error:any) {
    console.error("Error sending email link:", error);

    return { status: "fail", error: errorMessage(error.code) };
  }
};

export const verifySignInEmailLink = async (): Promise<any> => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem("emailForSignIn");

    if (!email) {
      email = window.prompt("Please provide your email for confirmation") || "";
    }

    try {
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
     

      const response :any = await instance.post('/user/verifyEmail', { email },{
            headers: {
              "Content-Type": "application/json"
            }
      });

      if (!response.success) {
        return { status: "fail", error: "Email verification failed" };
      }
      window.localStorage.removeItem("emailForSignIn");
      return { status: "success" };

    } catch (error:any) {
      return { status: "fail", error: errorMessage(error.code) };
    }
  } else {
    return { status: "fail", error: "Invalid sign-in link" };
  }
};

export const setupRecaptcha = () => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: string) => {
          console.log("Recaptcha verified");
        },
      }
    );

    return { status: "success" };
  } catch (error: any) {
    console.error("Error setting up recaptcha:", error);
    const err = errorMessage(error.code);
    console.log(`Error setting up recaptcha:${err}`);
    return { status: "fail", error: err };
  }
};

export const sendOtp = async (phoneNumber: string): Promise<any> => {
  try {
    const {status,error}=setupRecaptcha();

    if(status==="fail"){
      return {status:"fail",error}
    }

    const appVerifier = window.recaptchaVerifier as RecaptchaVerifier;
    const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    window.confirmationResult = confirmationResult;
    return { status: "success", result: confirmationResult };
  } catch (error: any) {
    console.error("Error sending OTP:", error.code);
    return { status: "fail", error: errorMessage(error.code) };
  }
};

export const verifyOtp = async (otpCode: string): Promise<any> => {
  const confirmationResult = window.confirmationResult as ConfirmationResult;

  try {
    const result = await confirmationResult?.confirm(otpCode);

    const user: User = result.user;

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: errorMessage(error.code) };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    removeToken();
    console.log("User signed out");
    return "Logged out successfully";
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const signUpWithEmailAndPhone = async (
  formData: FormData,
  phoneVerificationId: string
): Promise<any> => {
  const { email, phone, countryCode, password, otp } = formData;
  try {
    const response = await instance.get("user/phoneEmail", {
      params: {
        email,
        phone,
      },
    });

    if (response.data.success) {
      return { success: false, error: "Email or Phone number already exists" };
    }
    const verificationId = phoneVerificationId;
    const verificationCode = otp;

    const result = await verifyOtp(verificationCode);
    console.log("Result:", result);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const user = result.user;
    console.log("Phone credential:", user);

    const credential = EmailAuthProvider.credential(email, password);

    const linkedUser = await linkWithCredential(user, credential);
    console.log("Phone number linked to email user", linkedUser);

    const updatedPhone = countryCode + phone;

    const res = await instance.post("user/signup", {
      email,
      phone: updatedPhone,
      name: formData.name,
      password,
      uid: user.uid,
    });

    return { success: true, user };
  } catch (error: any) {
    return { status: "fail", error: errorMessage(error.code) };
  }
};
