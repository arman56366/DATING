import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import BASE_URL from "../config";
import context from "../store/context";

import HeartIcon from "../components/icons/Heart";

const LoginPage = () => {
  const { setTokenValue, setTokenIsSet } = useContext(context);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  const viewPortHeight = window.Telegram.WebApp.viewportHeight;
  const colors = window.Telegram.WebApp.themeParams;
  const { button_color: btnColor, text_color: txtColor } = colors;

  const handleLogin = () => {
    setIsLoggingIn(true);
    const queryString = window.Telegram.WebApp.initData;

    var newHeader = new Headers();
    newHeader.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      check_value: queryString,
    });

    var requestOptions = {
      method: "POST",
      headers: newHeader,
      body: raw,
      redirect: "follow",
    };

    fetch(BASE_URL + "/api/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoggingIn(false);
        if (result.success) {
          sessionStorage.setItem("dateUserToken", result.token);
          setTokenValue(result.token);
          setTokenIsSet(true);
          window.Telegram.WebApp.expand();
          navigate("/home");
        } else {
          console.log("Login failed, please create account");
        }
        console.log(result);
      })
      .catch((error) => {
        setIsLoggingIn(false);
        console.log("error", error);
      });
  };

  return (
    <div
      style={{ height: viewPortHeight, backgroundColor: "rgba(0,0,0,0.95)" }}
      className="text-white flex flex-col items-center justify-center relative gap-6 px-6"
    >
      <HeartIcon styles="w-16 h-16 text-red-600 mb-4" />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Dating App</h1>
        <p className="text-gray-400">Find your perfect match</p>
      </div>

      {isLoggingIn ? (
        <div className="flex flex-col items-center gap-3">
          <HeartIcon styles="w-8 h-8 animate-ping text-red-600" />
          <p className="text-sm text-gray-400">Logging in...</p>
        </div>
      ) : (
        <div className="w-full max-w-xs flex flex-col gap-3 mt-8">
          <button
            onClick={() => navigate("/signup")}
            style={{ backgroundColor: btnColor, color: txtColor }}
            className="w-full py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
          >
            Create Account
          </button>

          <button
            onClick={handleLogin}
            style={{ 
              backgroundColor: "transparent", 
              border: `2px solid ${btnColor}`,
              color: btnColor 
            }}
            className="w-full py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
