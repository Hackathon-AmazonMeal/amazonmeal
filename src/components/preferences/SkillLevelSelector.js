import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import {
  School,
  Star,
  EmojiEvents,
} from '@mui/icons-material';

const skillLevels = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Simple recipes with basic techniques',
    icon: <School />,
    color: 'success',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Moderate complexity with some techniques',
    icon: <Star />,
    color: 'primary',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Complex recipes and advanced techniques',
    icon: <EmojiEvents />,
    color: 'warning',
  },
];

function SkillLevelSelector({ selected = 'intermediate', onChange, error }) {
  const [selectedLevel, setSelectedLevel] = useState(selected);

  useEffect(() => {
    setSelectedLevel(selected);
  }, [selected]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedLevel(value);
    onChange(value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Cooking Skill Level
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        What's your cooking experience level? This helps us recommend recipes that match your skills.
      </Typography>

      <RadioGroup value={selectedLevel} onChange={handleChange}>
        <Grid container spacing={3}>
          {skillLevels.map((level) => (
            <Grid item xs={12} md={4} key={level.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedLevel === level.id ? 2 : 1,
                  borderColor: selectedLevel === level.id ? `${level.color}.main` : 'divider',
                  bgcolor: selectedLevel === level.id ? `${level.color}.50` : 'background.paper',
                }}
                onClick={() => {
                  setSelectedLevel(level.id);
                  onChange(level.id);
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: `${level.color}.main`, mb: 2, fontSize: '2rem' }}>
                    {level.icon}
                  </Box>
                  <FormControlLabel
                    value={level.id}
                    control={<Radio color={level.color} />}
                    label={level.label}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {level.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {error && (
        <FormHelperText error sx={{ mt: 2, fontSize: '1rem' }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

export default SkillLevelSelector;