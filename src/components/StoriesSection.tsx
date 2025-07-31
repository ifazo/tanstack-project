// "use client"
import { useState } from "react"
import { Box, Card, CardContent, Avatar, Typography, IconButton, Chip } from "@mui/material"
import { Add, ChevronLeft, ChevronRight } from "@mui/icons-material"

interface Story {
  id: number
  user: string
  avatar: string
  hasUnviewedStory: boolean
  isOnline?: boolean
}

export default function StoriesSection() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const stories: Story[] = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "/placeholder.svg?height=120&width=120",
      hasUnviewedStory: true,
      isOnline: true,
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "/placeholder.svg?height=120&width=120",
      hasUnviewedStory: true,
    },
    {
      id: 3,
      user: "Emma Wilson",
      avatar: "/placeholder.svg?height=120&width=120",
      hasUnviewedStory: false,
    },
    {
      id: 4,
      user: "David Rodriguez",
      avatar: "/placeholder.svg?height=120&width=120",
      hasUnviewedStory: true,
      isOnline: true,
    },
    {
      id: 5,
      user: "Lisa Park",
      avatar: "/placeholder.svg?height=120&width=120",
      hasUnviewedStory: false,
    },
    {
      id: 6,
      user: "James Smith",
      avatar: "/placeholder.svg?height=120&width=120",
      hasUnviewedStory: true,
    },
    {
      id: 7,
      user: "Anna Taylor",
      avatar: "/placeholder.svg?height=120&width=120",
      hasUnviewedStory: false,
    },
  ]

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("stories-container")
    if (container) {
      const scrollAmount = 200
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  return (
    <Box sx={{ position: "relative", mb: 3 }}>
      {/* Left scroll button */}
      <IconButton
        sx={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "white",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "grey.100",
          },
          display: scrollPosition > 0 ? "flex" : "none",
        }}
        onClick={() => handleScroll("left")}
      >
        <ChevronLeft />
      </IconButton>

      {/* Right scroll button */}
      <IconButton
        sx={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "white",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "grey.100",
          },
        }}
        onClick={() => handleScroll("right")}
      >
        <ChevronRight />
      </IconButton>

      {/* Stories container */}
      <Box
        id="stories-container"
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          px: 2,
        }}
      >
        {/* Add Story Card */}
        <Card
          sx={{
            minWidth: 120,
            height: 200,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              transform: "scale(1.02)",
              transition: "transform 0.2s ease-in-out",
            },
          }}
        >
          <Box
            sx={{
              height: "70%",
              backgroundImage: "url(/placeholder.svg?height=140&width=120&query=your profile background)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              pb: 1,
            }}
          >
            <IconButton
              sx={{
                backgroundColor: "#1877f2",
                color: "white",
                width: 40,
                height: 40,
                "&:hover": {
                  backgroundColor: "#166fe5",
                },
              }}
            >
              <Add />
            </IconButton>
          </Box>
          <CardContent sx={{ p: 1, textAlign: "center", height: "30%" }}>
            <Typography variant="caption" fontWeight="600" sx={{ fontSize: "0.75rem" }}>
              Create Story
            </Typography>
          </CardContent>
        </Card>

        {/* Story Cards */}
        {stories.map((story) => (
          <Card
            key={story.id}
            sx={{
              minWidth: 120,
              height: 200,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                transform: "scale(1.02)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <Box
              sx={{
                height: "100%",
                backgroundImage: `url(${story.avatar})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 1,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)",
                },
              }}
            >
              {/* Profile Avatar with Story Ring */}
              <Box sx={{ position: "relative", zIndex: 1, alignSelf: "flex-start" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: story.hasUnviewedStory
                      ? "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
                      : "rgba(255,255,255,0.3)",
                    p: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    src={story.avatar}
                    sx={{
                      width: 38,
                      height: 38,
                      border: "2px solid white",
                    }}
                  />
                </Box>
                {story.isOnline && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 14,
                      height: 14,
                      backgroundColor: "#42b883",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                )}
              </Box>

              {/* User Name */}
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  zIndex: 1,
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {story.user}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Stories indicator */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Chip
          label={`${stories.filter((s) => s.hasUnviewedStory).length} new stories`}
          size="small"
          sx={{
            backgroundColor: "rgba(24, 119, 242, 0.1)",
            color: "#1877f2",
            fontSize: "0.7rem",
          }}
        />
      </Box>
    </Box>
  )
}
