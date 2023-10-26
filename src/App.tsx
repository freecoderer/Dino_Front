import React from "react";
import loadable from "@loadable/component";
import { Route, Routes } from "react-router-dom";
import Layout from "@components/Layout/layout";
const Home = loadable(() => import("@pages/Home/home"));
const LogIn = loadable(() => import("@pages/LogIn"));
const SignUp = loadable(() => import("@pages/SignUp"));
const Admin = loadable(() => import("@pages/Admin"));
const EditPlayList = loadable(() => import("@pages/Editlist/editPlaylist"));

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/:id" element={<EditPlayList />} />
      </Routes>
    </Layout>
  );
}

export default App;
