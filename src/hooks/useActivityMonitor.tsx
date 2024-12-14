import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "@/services/store/auth/auth.thunk";
import { client } from "@/services/config/client";

export const useTokenMonitor = (dispatch: any) => {
  const navigate = useNavigate();
  const lastActivityTime = useRef(Date.now());
  const refreshTokenTimeout = useRef<ReturnType<typeof setTimeout>>();
  const logoutTimeout = useRef<ReturnType<typeof setTimeout>>();
  const hasRefreshed = useRef(false);

  const setupTokenRefresh = () => {
    const expiresIn = localStorage.getItem("expiresIn");
    if (!expiresIn) return;

    const expiresInMs = parseFloat(JSON.parse(expiresIn)) * 1000;

    if (refreshTokenTimeout.current) clearTimeout(refreshTokenTimeout.current);
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    refreshTokenTimeout.current = setTimeout(async () => {
      if (!hasRefreshed.current) {
        await dispatch(refreshToken());
        hasRefreshed.current = true;
      }
    }, expiresInMs - Date.now());
  };

  const resetActivityTimer = () => {
    lastActivityTime.current = Date.now();

    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    logoutTimeout.current = setTimeout(
      () => {
<<<<<<< HEAD
        const expiresIn = localStorage.getItem("expiresIn");
        if (expiresIn) {
          const expirationTime = Number(expiresIn);
          const currentTime = Date.now();
          const timeRemaining = expirationTime - currentTime;

          if (timeRemaining <= 0) {
            navigate("auth/login");
          }
        }
      },
      5 * 60 * 1000, // This can remain as a fallback
=======
        navigate("/auth/login");
      },
      60 * 60 * 1000,
>>>>>>> 3ec0bc08b0db9908c1ddebadfac45fd230545b68
    );
  };

  const handleRequest = () => {
    const timeSinceLastActivity = Date.now() - lastActivityTime.current;

    if (timeSinceLastActivity < 60 * 60 * 1000) {
      if (hasRefreshed.current) {
        setupTokenRefresh();
        hasRefreshed.current = false;
      }
      resetActivityTimer();
    } else {
<<<<<<< HEAD
      const expiresIn = localStorage.getItem("expiresIn");
      if (expiresIn) {
        const expirationTime = Number(expiresIn);
        const currentTime = Date.now();
        const timeRemaining = expirationTime - currentTime;

        if (timeRemaining <= 0) {
          navigate("auth/login");
        }
      }
=======
      navigate("/auth/login");
>>>>>>> 3ec0bc08b0db9908c1ddebadfac45fd230545b68
    }
  };

  useEffect(() => {
    setupTokenRefresh();

    // Thêm interceptor request
    const requestInterceptor = async (options: any) => {
      handleRequest(); // Gọi handleRequest
      return options; // Trả lại config để tiếp tục gửi yêu cầu
    };

    client.interceptors.use(requestInterceptor); // Thêm interceptor

    return () => {
      client.interceptors.eject(requestInterceptor); // Xóa interceptor khi unmount
      if (refreshTokenTimeout.current) clearTimeout(refreshTokenTimeout.current);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    };
  }, []);

  useEffect(() => {
    resetActivityTimer();
  }, []);
};
