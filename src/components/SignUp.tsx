// 'use client'

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Google,
  GitHub,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from "@mui/icons-material";
import { saveToken, saveUser } from "~/store";
import { Link, useRouter } from "@tanstack/react-router";
import { User } from "firebase/auth";
import { signInWithGithub, signInWithGoogle, signUp } from "~/lib/firebase";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const saveUserDB = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.status !== 201) {
        const errorData = await response.json();
        console.error("Error saving user to MongoDB:", errorData);
        setError(errorData.message || "Failed to save user");
        setShowToast(true);
        return;
      }
      const data = await response.json();
      console.log("User saved to MongoDB:", data);
      saveUser(data.user);
      saveToken(data.token);
      return data;
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
      setError("An error occurred while saving user data");
      setShowToast(true);
    }
  };

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
      }
      const data = await response.json();
      saveUser(data.user);
      console.log("Stored User saved:", data.user);
      saveToken(data.token);
      return data;
    } catch (error) {
      console.error("Error signin:", error);
      setError("Failed to sign in user");
      setShowToast(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setShowToast(false);
    try {
      if (!name || !email || !password) {
        setLoading(false);
        setError("All fields are required");
        setShowToast(true);
        return;
      }

      const result = await signUp(email, password);
      console.log("Sign up result:", result);
      if (!result || !result.user) {
        setError("Failed to create user");
        setShowToast(true);
        setLoading(false);
        return;
      }
      console.log("Stored User saved:", result.user);
      await saveUserDB({
        name: name,
        email: result.user.email || "",
        password: password,
      });
      setShowToast(true);
      setMessage("Sign up successful!");
      console.log("Sign up successful!");
      router.navigate({ to: "/" });
    } catch (error: any) {
      console.error("Error during sign up:", error);
      setLoading(false);
      setError(error.message || "Failed to sign up");
      setShowToast(true);
    } finally {
      setName("");
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
          {message || "Sign up successful!"}
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
              Sign Up
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account to get started
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

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
                {loading ? "Loading..." : "Create Account"}
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
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
