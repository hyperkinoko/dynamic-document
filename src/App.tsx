import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, VFC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "./hooks/Auth";
import { CreateDocument } from "./pages/CreateDocument";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authState);
  return auth ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useRecoilValue(authState);
  return auth ? <Navigate to="/" /> : children;
};

export const App: VFC = () => {
  const setAuth = useSetRecoilState(authState);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuth(user);
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
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
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
