import { auth, db } from "@/plugins/firebase";
import { createUser, getUser } from "@/services/user";
import { useCommonStore, useUserStore } from "@/stores";
import { IUser } from "@/types";
import {
  signInWithEmailAndPassword,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut as signOutFirebase,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export const useAuth = () => {
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  const { verifyEmail } = storeToRefs(useCommonStore());
  const authError = ref("");
  const { setUser } = useUserStore();

  const signUp = async (fullname: string, email: string, password: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCred.user.getIdToken();
      localStorage.setItem("token", token);

      const data = await createUser(userCred.user.uid, email, fullname, false);

      if (data.success) {
        setUser(data.result!.user);
        router.push({ name: "VerifyEmail" });
      } else {
        toast.error("Đăng ký thất bại!. Vui lòng thử lại sau.");
        localStorage.removeItem("token");
      }
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.EMAIL_EXISTS:
          authError.value = "Email này đã được đăng ký.";
          break;
        case AuthErrorCodes.INVALID_EMAIL:
          authError.value = "Email không hợp lệ.";
          break;
        default:
          authError.value = "Có gì đó không ổn. Hãy thử lại sau.";
          break;
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        router.push({ name: "VerifyEmail" });
      } else {
        const token = await userCred.user.getIdToken();
        localStorage.setItem("token", token);

        const data = await getUser();
        if (data.success) {
          setUser(data.result!.user);
          router.push({ name: "Home" });
        } else {
          toast.error("Đăng nhập thất bại!. Vui lòng thử lại sau.");
          localStorage.removeItem("token");
        }
      }
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
          authError.value = "Email hoặc mật khẩu không đúng.";
          break;
        case AuthErrorCodes.INVALID_EMAIL:
          authError.value = "Email không hợp lệ.";
          break;
        default:
          authError.value = "Có gì đó không ổn. Hãy thử lại sau.";
          break;
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      const data = await createUser(
        user.uid,
        user.email!,
        user.displayName!,
        true,
        user.photoURL
      );

      if (data.success) {
        setUser(data.result!.user);
        router.push({ name: "Home" });
      } else {
        toast.error("Đăng nhập thất bại!. Vui lòng thử lại sau.");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogleRedirect = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };

  const getGoogleRedirectResult = async () => {
    try {
      const userCred = await getRedirectResult(auth);
      const user = userCred?.user;

      console.log(user);

      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token);

        const data = await createUser(
          user.uid,
          user.email!,
          user.displayName!,
          true,
          user.photoURL
        );

        if (data.success) {
          setUser(data.result!.user);
          router.push({ name: "Home" });
        } else {
          toast.error("Đăng nhập thất bại!. Vui lòng thử lại sau.");
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendVerifyEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      verifyEmail.value = {
        email: auth.currentUser.email,
        lastResend: new Date(),
      };
    }
  };

  const updateUserEmailVerified = async () => {
    if (auth.currentUser)
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        emailVerified: true,
      });
  };

  const sendResetPasswordEmail = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const changePassword = async () => {};

  const signOut = async () => {
    await signOutFirebase(auth);
    localStorage.clear();
    setUser(null);
  };

  return {
    authError,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGoogleRedirect,
    getGoogleRedirectResult,
    sendVerifyEmail,
    sendResetPasswordEmail,
    updateUserEmailVerified,
    changePassword,
    signOut,
  };
};
