export function useAuth() {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("accessToken");
  return { user: user ? JSON.parse(user) : null, token };
}
