import axios from "axios";

const AuthButton = () => {
  // Handle Google OAuth login
  const handleAuthClick = async () => {
    try {
      const response = await axios.get("http://localhost:4000/auth/google");
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleAuthClick}
        className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500"
       
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default AuthButton;
