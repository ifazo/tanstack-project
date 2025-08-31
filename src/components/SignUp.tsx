import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Stack,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
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
import { signInWithGithub, signInWithGoogle, signUp } from "~/lib/firebase";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadToImgbb = async (file: File) => {
    if (!IMGBB_API_KEY) {
      setError("Image upload configuration missing");
      setShowToast(true);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
      return data.data.display_url as string;
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setShowToast(true);
    }
  };

  const saveUserDB = async (userData: {
    name: string;
    image?: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save user");
      }

      const data = await res.json();
      saveUser(data.user);
      saveToken(data.token);
      return data;
    } catch (err: any) {
      setError(err.message);
      setShowToast(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email & Password are required");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password);
      if (!result?.user) throw new Error("Failed to create user");

      let uploadedImageUrl;
      if (imageFile) uploadedImageUrl = await uploadToImgbb(imageFile);

      await saveUserDB({
        name,
        image: uploadedImageUrl,
        email: result.user.email!,
        password,
      });

      setMessage("Sign up successful!");
      setShowToast(true);
      router.navigate({ to: "/" });

      setName("");
      setEmail("");
      setPassword("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      const result =
        provider === "google" ? await signInWithGoogle() : await signInWithGithub();

      if (result?.user?.email) {
        await saveUserDB({
          name: result.user.displayName || "",
          image: result.user.photoURL || "",
          email: result.user.email,
          password: "social",
        });
        setMessage(`${provider} sign in successful!`);
        setShowToast(true);
        router.navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
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

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={imagePreview || undefined} alt={name} />
                <Button variant="outlined" component="label" disabled={loading}>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Stack>

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
              onClick={() => handleSocialSignIn("google")}
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
              onClick={() => handleSocialSignIn("github")}
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
