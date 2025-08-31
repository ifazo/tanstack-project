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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (user: {
    name?: string;
    image?: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to sign in");
      }

      const data = await res.json();
      saveUser(data.user);
      saveToken(data.token);
      return data;
    } catch (err: any) {
      setError(err.message || "Sign in failed");
      setShowToast(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (!result?.user?.email) throw new Error("Invalid login");

      await handleSignIn({ email: result.user.email, password });

      setMessage("Email sign in successful!");
      setShowToast(true);
      router.navigate({ to: "/" });

      // reset only after success
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
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

      if (!result?.user?.email) throw new Error(`${provider} login failed`);

      await handleSignIn({
        name: result.user.displayName || "",
        image: result.user.photoURL || "",
        email: result.user.email,
        password: "social",
      });

      setMessage(`${provider} sign in successful!`);
      setShowToast(true);
      router.navigate({ to: "/" });
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
              Don't have an account? <Link to="/sign-up">Sign up</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
