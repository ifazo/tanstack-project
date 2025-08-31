// "use client"
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  InputAdornment,
  AppBar,
  Toolbar,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  Send,
  AttachFile,
  EmojiEmotions,
  Phone,
  VideoCall,
  MoreVert,
  CameraAlt,
} from "@mui/icons-material";
import type { Chat } from "~/types";
import { getToken, getUser } from "~/store";

export default function ChatList({
  chat,
  loading,
  error,
}: {
  chat: Chat;
  loading: boolean;
  error: string | null;
}) {
  const router = useRouter();
  const user = getUser();
  const token = getToken();

  const [messageText, setMessageText] = useState("");

  const formatTime = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isMyMessage = (senderId: string) => {
    return user._id === senderId;
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const newMessage = {
        chatId: chat?._id,
        senderId: user._id,
        text: messageText.trim(),
        createdAt: new Date(),
      };
      await fetch(`${import.meta.env.VITE_API_URL}/chats/${chat?._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });
    }
    setMessageText("");
    // window.location.reload();
  };

  const handleBackClick = () => {
    router.navigate({ to: "/chat" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Chat Header */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black", boxShadow: 1 }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <IconButton edge="start" onClick={handleBackClick} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Avatar src={chat?.image} sx={{ width: 40, height: 40, mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight="600"
              sx={{ lineHeight: 1.2 }}
            >
              {chat?.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              {/* {message.isOnline ? "Active now" : "Last seen recently"} */}
              {"Active Now"}
            </Typography>
          </Box>
          <IconButton color="inherit">
            <Phone />
          </IconButton>
          <IconButton color="inherit">
            <VideoCall />
          </IconButton>
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Messages Area */}
      <Box
        sx={{
          height: "70vh",
          overflowY: "auto",
          padding: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        {chat?.messages.length !== 0 && (
          <Stack spacing={2}>
            {chat?.messages.map((message) => {
              const isMe = isMyMessage(message.senderId);

              return (
                <Box
                  key={message._id}
                  sx={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 1,
                  }}
                >
                  {!isMe && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#1976d2",
                        fontSize: "0.875rem",
                      }}
                    >
                      {message.senderId.slice(-2).toUpperCase()}
                    </Avatar>
                  )}

                  <Paper
                    elevation={1}
                    sx={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: isMe
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      backgroundColor: isMe ? "#1976d2" : "#ffffff",
                      color: isMe ? "#ffffff" : "#000000",
                      position: "relative",
                      ...(isMe && {
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(25, 118, 210, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }),
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-word",
                        lineHeight: 1.4,
                      }}
                    >
                      {message.text}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        marginTop: 0.5,
                        opacity: 0.7,
                        fontSize: "0.75rem",
                        textAlign: isMe ? "right" : "left",
                      }}
                    >
                      {formatTime(message.createdAt)}
                    </Typography>
                  </Paper>

                  {isMe && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#4caf50",
                        fontSize: "0.875rem",
                      }}
                    >
                      Me
                    </Avatar>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <IconButton color="primary" sx={{ mb: 0.5 }}>
          <CameraAlt />
        </IconButton>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onClick={() => handleSendMessage()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <AttachFile />
                </IconButton>
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#f0f2f5",
              border: "none",
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          sx={{
            mb: 0.5,
            backgroundColor: messageText.trim() ? "#1877f2" : "transparent",
            color: messageText.trim() ? "white" : "inherit",
            "&:hover": {
              backgroundColor: messageText.trim()
                ? "#166fe5"
                : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
}
