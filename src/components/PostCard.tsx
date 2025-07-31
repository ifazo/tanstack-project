// "use client"
import type React from "react"
import { useState } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Divider,
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
} from "@mui/material"
import { ThumbUp, ChatBubbleOutline, Share, MoreVert, ThumbUpOutlined } from "@mui/icons-material"

interface Comment {
  id: number
  user: string
  avatar: string
  text: string
  timestamp: string
}

export default function PostCard() {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(42)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      text: "This looks amazing! Great work 👏",
      timestamp: "2h",
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      text: "Love the design! When will this be available?",
      timestamp: "1h",
    },
  ])

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        text: newComment,
        timestamp: "now",
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleAddComment()
    }
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", boxShadow: 3 }}>
      {/* Card Header */}
      <CardHeader
        avatar={<Avatar src="/placeholder.svg?height=40&width=40" sx={{ width: 40, height: 40 }} />}
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={
          <Typography variant="subtitle1" fontWeight="600">
            John Doe
          </Typography>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              3 hours ago
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🌍
            </Typography>
          </Box>
        }
      />

      {/* Post Content */}
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Just finished working on this amazing new project! Really excited to share it with everyone. The team has been
          incredible and I couldn't be happier with how it turned out. What do you all think? 🚀
        </Typography>

        {/* Post Image */}
        <Box
          component="img"
          src="/placeholder.svg?height=300&width=600"
          alt="Post content"
          sx={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 1,
            cursor: "pointer",
          }}
        />
      </CardContent>

      {/* Reactions Summary */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#1877f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 0.5,
                }}
              >
                <ThumbUp sx={{ fontSize: 12, color: "white" }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {likeCount}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: "pointer" }}
            onClick={() => setShowComments(!showComments)}
          >
            {comments.length} comments • 5 shares
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Action Buttons */}
      <CardActions sx={{ justifyContent: "space-around", py: 1 }}>
        <Button
          startIcon={liked ? <ThumbUp /> : <ThumbUpOutlined />}
          onClick={handleLike}
          sx={{
            color: liked ? "#1877f2" : "text.secondary",
            textTransform: "none",
            fontWeight: 600,
            flex: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Like
        </Button>
        <Button
          startIcon={<ChatBubbleOutline />}
          onClick={() => setShowComments(!showComments)}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
            flex: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Comment
        </Button>
        <Button
          startIcon={<Share />}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
            flex: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Share
        </Button>
      </CardActions>

      {/* Comments Section */}
      {showComments && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            {/* Add Comment */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Avatar src="/placeholder.svg?height=32&width=32" sx={{ width: 32, height: 32 }} />
              <TextField
                fullWidth
                placeholder="Write a comment..."
                variant="outlined"
                size="small"
                multiline
                maxRows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#f0f2f5",
                  },
                }}
              />
            </Box>

            {/* Comments List */}
            <List sx={{ p: 0 }}>
              {comments.map((comment) => (
                <ListItem key={comment.id} sx={{ px: 0, alignItems: "flex-start" }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar src={comment.avatar} sx={{ width: 32, height: 32 }} />
                  </ListItemAvatar>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: "#f0f2f5",
                        borderRadius: 2,
                        p: 1.5,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
                        {comment.user}
                      </Typography>
                      <Typography variant="body2">{comment.text}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, px: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                      >
                        Like
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                      >
                        Reply
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Card>
  )
}
