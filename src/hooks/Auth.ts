import { atom } from "recoil";
import { User } from "firebase/auth";

type AuthState = User | null;

export const authState = atom<AuthState>({
  key: "authState",
  default: null,
  dangerouslyAllowMutability: true,
});
