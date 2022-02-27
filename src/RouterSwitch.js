import { BrowserRouter, Route, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

const RouterSwitch = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/accounts/emailsignup/' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterSwitch;