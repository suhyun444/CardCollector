"use client"; // 👈 이것이 핵심입니다! (브라우저 전용)

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 👈 CSS도 여기서 불러옵니다

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}