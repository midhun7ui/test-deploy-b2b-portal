import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, clearCurrentUser, setCurrentUser } from "../features/auth/authState";
import { fetchMe } from "../features/auth/authApi";

function ProtectedRoute({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(() => isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated()) {
      setIsValid(false);
      setIsValidating(false);
      return;
    }

    let isMounted = true;
    fetchMe()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user);
          setIsValid(true);
          setIsValidating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          // If backend is offline or token is invalid/expired -> log out immediately
          clearCurrentUser();
          setIsValid(false);
          setIsValidating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isValidating && !isValid) {
    return <Navigate to="/" replace />;
  }

  if (isValidating) {
    return null;
  }

  return children;
}

export default ProtectedRoute;