import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "./hooks/Auth";
import { CreateDocument } from "./pages/CreateDocument";
import { Admin } from "./pages/Admin";
import { ViewDocument } from "./pages/ViewDocument";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authState);
  return auth ? children : <Navigate to="/login" replace={true} />;
};

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authState);
  return auth ? <Navigate to="/admin" replace={true} /> : children;
};

export const App: FC = (): JSX.Element => {
  const setAuth = useSetRecoilState(authState);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) setAuth(user);
      }
      setIsLoading(false);
    });
  }, [setAuth]);

  return (
    <BrowserRouter>
      {isLoading ? (
        <></>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/view"
            element={
              <PrivateRoute>
                <ViewDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit"
            element={
              <PrivateRoute>
                <CreateDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PrivateRoute>
                <SignUp />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
