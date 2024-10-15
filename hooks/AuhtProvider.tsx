import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  auth: {
    isLogin: false,
    user: null,
  },
  hanldeLogin: (user: any) => {},
});
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState({
    isLogin: false,
    user: null,
  });
  const hanldeLogin = (user: any) => {
    setAuth({
      isLogin: true,
      user,
    });
  };
  return (
    <AuthContext.Provider value={{ auth, hanldeLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  if (!AuthContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const data = useContext(AuthContext);
  return data;
};
export default AuthProvider;
export { useAuth };
