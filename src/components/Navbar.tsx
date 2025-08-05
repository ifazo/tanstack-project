import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RestoreIcon from '@mui/icons-material/Restore';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from '@tanstack/react-router';

const navItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Favorite', icon: <FavoriteIcon />, path: '/favorite' },
  { label: 'Chat', icon: <QuestionAnswerIcon />, path: '/chat' },
  { label: 'History', icon: <RestoreIcon />, path: '/history' },
  { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
];

export default function SimpleBottomNavigation() {
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  const currentPath = router.state.location.pathname;
  const currentIndex = navItems.findIndex((item) => item.path === currentPath);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 500,
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: 1000,
      }}
    >
       <BottomNavigation
        value={currentIndex}
        onChange={(event, newValue) => {
          setValue(newValue);
          router.navigate({ to: navItems[newValue].path });
        }}
        showLabels
        sx={{ borderRadius: '20px' }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Box>
  );
}
