import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      localStorage.getItem("movix-current-user") || "null"
    );
  } catch {
    currentUser = null;
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;