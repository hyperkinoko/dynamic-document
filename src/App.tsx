import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, VFC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "./hooks/Auth";
import { CreateDocument } from "./pages/CreateDocument";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";

export const App: VFC = () => {
  const setAuth = useSetRecoilState(authState);
  const auth = useRecoilValue(authState);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuth(user);
      }
    });
    setIsLoading(false);
  }, [setAuth]);

  return (
    <BrowserRouter>
      {isLoading ? (
        <></>
      ) : (
        <Routes>
          <Route path="/" element={auth ? <Home /> : <Login />} />
          <Route path="/edit" element={auth ? <CreateDocument /> : <Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
