import type React from "react";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Google,
  GitHub,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";
import { saveToken, saveUser } from "../store";
import { Link, useRouter } from "@tanstack/react-router";
import {
  signInWithEmail,
  signInWithGithub,
  signInWithGoogle,
} from "~/lib/firebase";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async ({
    name,
    email,
    password,
  }: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.status !== 200) {
        const errorData = await response.json();
        console.error("Error sign in user:", errorData);
        setError(errorData.message || "Failed to sign in user");
        setShowToast(true);
        return;
      }
      const data = await response.json();
      console.log("Sign in user response:", data);
      saveUser(data.user);
      saveToken(data.token);
      return data;
    } catch (error) {
      console.error("Error signin:", error);
      setError("Failed to sign in user");
      setShowToast(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowToast(false);
    try {
      if (!email || !password) {
        setLoading(false);
        setError("Email and password are required");
        setShowToast(true);
        return;
      }
      const result = await signInWithEmail(email, password);
      console.log("Sign in result:", result);
      if (!result || !result.user) {
        setError("Failed to login user");
        setShowToast(true);
        setLoading(false);
        return;
      }
      if (result && result.user.email) {
        await handleSignIn({ email: result.user.email, password });
      }
      setShowToast(true);
      setMessage("Email sign in successful!");
      console.log("Email sign in successful!");
      router.navigate({ to: "/" });
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "Failed to sign in");
      setLoading(false);
      setShowToast(true);
      return;
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Google sign in");
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      console.log("Google sign in result:", result);
      if (result && result.user.email) {
        await handleSignIn({ name: result.user.displayName || "", email: result.user.email, password: "social" });
      }
      setShowToast(true);
      setMessage("Google sign in successful!");
      console.log("Google sign in successful!");
      router.navigate({ to: "/" });
    } catch (error: any) {
      console.error("Error with Google sign-in:", error);
      setLoading(false);
      setError(error.message || "Failed to sign in with Google");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    console.log("Github sign in");
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGithub();
      console.log("GitHub sign in result:", result);
      if (result && result.user.email) {
        await handleSignIn({ name: result.user.displayName || "", email: result.user.email, password: "social" });
      }
      setShowToast(true);
      setMessage("GitHub sign in successful!");
      console.log("GitHub sign in successful!");
      router.navigate({ to: "/" });
    } catch (error: any) {
      console.error("Error with GitHub sign-in:", error);
      setLoading(false);
      setError(error.message || "Failed to sign in with GitHub");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowToast(false);
    setError(null);
  };

  return (
    <>
      {/* Toast notifications */}
      <Snackbar
        open={showToast && !error}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message || "Sign in successful!"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showToast && !!error}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Main content */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
          pt: 2,
          pb: 8,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            mx: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please sign in to your account.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, mt: 2 }}
              >
                {loading ? "Loading..." : "Sign in"}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or continue with
            </Typography>
          </Divider>

          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Google />}
              onClick={() => handleGoogleSignIn()}
              disabled={loading}
              sx={{
                py: 1.5,
                borderColor: "grey.300",
                color: "text.primary",
                "&:hover": {
                  borderColor: "grey.400",
                  bgcolor: "grey.50",
                },
              }}
            >
              Continue with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GitHub />}
              onClick={() => handleGithubSignIn()}
              disabled={loading}
              sx={{
                py: 1.5,
                borderColor: "grey.300",
                color: "text.primary",
                "&:hover": {
                  borderColor: "grey.400",
                  bgcolor: "grey.50",
                },
              }}
            >
              Continue with GitHub
            </Button>
          </Stack>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account? <Link to="/sign-up">Sign up</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
