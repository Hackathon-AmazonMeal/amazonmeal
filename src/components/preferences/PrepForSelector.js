import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormHelperText,
  IconButton,
  Stack,
  Grid,
} from '@mui/material';
import {
  Add,
  Remove,
  Person,
  People,
  Edit,
} from '@mui/icons-material';

function PrepForSelector({ selected = 1, onChange, error }) {
  const [selectedOption, setSelectedOption] = useState('single');
  const [customCount, setCustomCount] = useState(3);

  useEffect(() => {
    if (selected === 1) setSelectedOption('single');
    else if (selected === 2) setSelectedOption('two');
    else {
      setSelectedOption('custom');
      setCustomCount(selected);
    }
  }, [selected]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'single') onChange(1);
    else if (option === 'two') onChange(2);
    else onChange(customCount);
  };

  const handleCustomIncrease = () => {
    const newCount = customCount + 1;
    setCustomCount(newCount);
    if (selectedOption === 'custom') onChange(newCount);
  };

  const handleCustomDecrease = () => {
    if (customCount > 3) {
      const newCount = customCount - 1;
      setCustomCount(newCount);
      if (selectedOption === 'custom') onChange(newCount);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Prep For
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        How many people are you cooking for?
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Button
            variant={selectedOption === 'single' ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
            size="large"
            startIcon={<Person />}
            onClick={() => handleOptionSelect('single')}
            sx={{ py: 2 }}
          >
            Single Serving
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Button
            variant={selectedOption === 'two' ? 'contained' : 'outlined'}
            color="secondary"
            fullWidth
            size="large"
            startIcon={<People />}
            onClick={() => handleOptionSelect('two')}
            sx={{ py: 2 }}
          >
            2 People
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Button
            variant={selectedOption === 'custom' ? 'contained' : 'outlined'}
            color="info"
            fullWidth
            size="large"
            startIcon={<Edit />}
            onClick={() => handleOptionSelect('custom')}
            sx={{ py: 2 }}
          >
            Custom
          </Button>
        </Grid>
      </Grid>

      {selectedOption === 'custom' && (
        <Box mt={4} display="flex" justifyContent="center">
          <Stack direction="row" alignItems="center" spacing={3}>
            <IconButton
              onClick={handleCustomDecrease}
              disabled={customCount <= 3}
              size="large"
              sx={{
                bgcolor: 'info.main',
                color: 'white',
                '&:hover': { bgcolor: 'info.dark' },
                '&:disabled': { bgcolor: 'grey.300' },
              }}
            >
              <Remove />
            </IconButton>

            <Box textAlign="center" sx={{ minWidth: 100 }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                {customCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                people
              </Typography>
            </Box>

            <IconButton
              onClick={handleCustomIncrease}
              size="large"
              sx={{
                bgcolor: 'info.main',
                color: 'white',
                '&:hover': { bgcolor: 'info.dark' },
              }}
            >
              <Add />
            </IconButton>
          </Stack>
        </Box>
      )}

      {error && (
        <FormHelperText error sx={{ mt: 2, fontSize: '1rem', textAlign: 'center' }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}

export default PrepForSelector;