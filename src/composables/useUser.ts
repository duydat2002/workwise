import { db } from "@/plugins/firebase";
import { useUserStore } from "@/stores";
import { IUser } from "@/types";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export const useUser = () => {
  const { setUser } = useUserStore();

  const getUser = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const user = {
        id: userId,
        ...userDoc.data(),
      } as IUser;

      return user;
    } else {
      return null;
    }
  };

  const watchUserChange = (userId: string) => {
    return onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        console.log("Data change", userId);
        setUser({
          id: userId,
          ...doc.data(),
        } as IUser);
      }
    });
  };

  return {
    getUser,
    watchUserChange,
  };
};
