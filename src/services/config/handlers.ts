export const refreshToken = async (url: string) => {
  try {
    if (!localStorage.getItem("refreshToken")) return;
    const response = await fetch(`${url}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("accessToken", JSON.stringify(data.metaData.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.metaData.refreshToken));
    } else throw new Error();
    return response.ok;
  } catch (e) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return false;
  }
};
