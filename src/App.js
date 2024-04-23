import * as React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/log-in">
        <Route index element={<LogIn />} />
      </Route>

      <Route path="/sign-up">
        <Route index element={<SignUp />} />
      </Route>

      <Route path="/dash">
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
