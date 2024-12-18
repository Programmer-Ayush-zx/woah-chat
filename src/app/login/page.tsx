"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// Import Image if you have an image to optimize, or remove if not needed
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const router = useRouter();

  const HandleJoinChat = () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter both username and password to join the chat.");
      return;
    }
    // Redirect to chat page with username as query parameter
    router.push(`/chats?username=${encodeURIComponent(username)}`);
  };

  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen mx-auto p-4 bg-neutral-100">
      <h1 className="text-5xl font-bold mb-4 text-sky-500 rotate-3">WOAH
      </h1>
      {/* <Image src="/chatico.png" alt="Email Icon" className="h-28 w-28 animate-bounce delay-1000" width={112} height={112} /> */}
      <Image src="/ghost-castle.png" alt="Email Icon" className="h-28 w-28" width={112} height={112} />
      <p className="font-bold mb-4 text-xl text-blue-800">Username:</p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-[85%] p-2 mb-2 border border-gray-700 rounded-full text-black text-center outline-none"
        placeholder="Enter your username..."
      />
      <p className="font-bold mb-4 text-xl text-blue-800">Password:</p>
      <div className="flex items-center flex-row justify-center w-screen">
        <input
          type={passwordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-[70%] p-2 mb-2 border border-gray-700 rounded-l-full text-black text-center outline-none"
          placeholder="Enter your password..."
        />
        <button
          onClick={handleShowPassword}
          className="bg-blue-500 w-fit mb-2 border-blue-800  hover:bg-blue-700 active:bg-blue-700 text-white font-bold p-2 rounded-r-full active:border-b-2"
        >
          {passwordVisible ? "Hide" : "Show"}
        </button>
      </div>
      {error && (
        <p className="text-red-800 text-center mb-4 p-2 bg-red-400 rounded border-red-900 border-b-4">{error}</p>
      )}
      <button
        onClick={HandleJoinChat}
        className="bg-green-500 mt-6 w-80 border-green-800 border-b-4 hover:bg-green-700 active:bg-green-700 text-white font-bold text-xl py-2 px-4 rounded-3xl active:border-b-2"
      >
        Join Chat
      </button>
      <p className="text-center mb-4 p-2 bg-yellow-300 rounded mt-4 text-orange-800">
        This is a simple chat engine. Messages sent here are well encrypted!
      </p>
    </div>
  );
};

export default LoginPage;
