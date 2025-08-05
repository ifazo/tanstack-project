import type React from "react"
import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Fade,
  Stack,
} from "@mui/material"
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material"
import { saveToken, saveUser } from "../store"

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (!email || !password) {
        setError("Email and password are required")
        return
      }
      const response = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (response.status !== 200) {
        setLoading(false)
        const errorData = await response.json()
        setError(errorData.message || "Failed to sign in")
        return
      }
      const data = await response.json()
      saveToken(data.token)
      saveUser(data.user)
      console.log("Sign in successful:", data)
      setEmail("")
      setPassword("")
    } catch (error) {
      console.error("Sign in error:", error)
      setError("Failed to sign in")
      return
    } finally {
      setLoading(false)
    }
    console.log("Email sign in:", { email, password })
  }

  const handleGoogleSignIn = () => {
    console.log("Google sign in")
  }

  const handleFacebookSignIn = () => {
    console.log("Facebook sign in")
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "1rem",
                }}
              >
                Sign in to your account
              </Typography>
            </Box>

            <Stack spacing={3}>
              {/* Social Login Buttons */}
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Continue with Google
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FacebookIcon />}
                  onClick={handleFacebookSignIn}
                  sx={{
                    backgroundColor: "#1877F2",
                    color: "white",
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    boxShadow: "0 4px 12px rgba(24, 119, 242, 0.3)",
                    "&:hover": {
                      backgroundColor: "#166FE5",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 16px rgba(24, 119, 242, 0.4)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Continue with Facebook
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    px: 2,
                  }}
                >
                  or
                </Typography>
              </Divider>

              {/* Email Form */}
              <Box component="form" onSubmit={handleEmailSignIn}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.8)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "white",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.8)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "white",
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>

              <Box textAlign="center" mt={2}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {"Don't have an account? "}
                  <Button
                    variant="text"
                    sx={{
                      color: "white",
                      textDecoration: "underline",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  )
}
