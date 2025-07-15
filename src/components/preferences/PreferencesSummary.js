import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
} from '@mui/material';

function PreferencesSummary({ preferences }) {
  const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const formatValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None selected';
    }
    return value || 'Not specified';
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Review Your Preferences
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        Please review your preferences before we generate your personalized recipes.
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {Object.entries(preferences).map(([key, value], index) => (
              <Box key={key}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {formatLabel(key)}
                </Typography>
                
                {Array.isArray(value) && value.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {value.map((item) => (
                      <Chip
                        key={item}
                        label={item.replace('-', ' ')}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {formatValue(key, value)}
                  </Typography>
                )}
                
                {index < Object.entries(preferences).length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box mt={3} p={2} bgcolor="grey.100" borderRadius={2}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Complete Preferences Object:
        </Typography>
        <Box
          component="pre"
          sx={{
            fontSize: '0.75rem',
            overflow: 'auto',
            maxHeight: 200,
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {JSON.stringify(preferences, null, 2)}
        </Box>
      </Box>
    </Box>
  );
}

export default PreferencesSummary;