import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import {
  Restaurant,
  Nature,
  Egg,
} from '@mui/icons-material';
import { useUserPreferences } from '../../hooks/useUserPreferences';

/**
 * Diet type options with their metadata
 */
const DIET_TYPES = [
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based diet with dairy products',
    icon: <Nature />,
    color: 'success',
  },
  {
    id: 'non-vegetarian',
    label: 'Non Vegetarian',
    description: 'Includes meat, poultry, and fish',
    icon: <Restaurant />,
    color: 'primary',
  },
  {
    id: 'eggetarian',
    label: 'Eggetarian',
    description: 'Vegetarian diet that includes eggs',
    icon: <Egg />,
    color: 'warning',
  },
];

/**
 * DietTypeSelector component for selecting dietary preference
 * 
 * @param {Object} props - Component props
 * @param {string} props.selected - Currently selected diet type
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} [props.error] - Error message to display
 * @returns {JSX.Element} Diet type selection component
 */
function DietTypeSelector({ selected = 'vegetarian', onChange, error }) {
  const [selectedDietType, setSelectedDietType] = useState(selected);

  // Update local state when prop changes
  // Update local state when prop changes
  useEffect(() => {
    if (selected) {
      setSelectedDietType(selected);
    }
  }, [selected]);

  /**
   * Handle radio button change event
   * @param {Object} event - Change event
   */
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedDietType(value);
    
    // Call prop onChange if provided
    if (onChange) {
      onChange(value);
    }
    
    // Always update context
    updatePreferenceField('dietType', value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Diet Type
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        Choose your dietary preference.
      </Typography>

      <RadioGroup 
        value={selectedDietType} 
        onChange={handleChange}
        aria-label="diet type selection"
      >
        <Grid container spacing={3}>
          {DIET_TYPES.map((diet) => (
            <Grid item xs={12} md={4} key={diet.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedDietType === diet.id ? 2 : 1,
                  borderColor: selectedDietType === diet.id ? `${diet.color}.main` : 'divider',
                  bgcolor: selectedDietType === diet.id ? `${diet.color}.50` : 'background.paper',
                }}
                onClick={() => {
                  setSelectedDietType(diet.id);
                  if (onChange) {
                    onChange(diet.id);
                  }
                  updatePreferenceField('dietType', diet.id);
                }}
                role="radio"
                aria-checked={selectedDietType === diet.id}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: `${diet.color}.main`, mb: 2, fontSize: '2rem' }}>
                    {diet.icon}
                  </Box>
                  <FormControlLabel
                    value={diet.id}
                    control={<Radio color={diet.color} />}
                    label={diet.label}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {diet.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

DietTypeSelector.propTypes = {
  /**
   * Currently selected diet type
   */
  selected: PropTypes.string,
  
  /**
   * Callback function when selection changes
   */
  onChange: PropTypes.func.isRequired,
  
  /**
   * Error message to display
   */
  error: PropTypes.string,
};

DietTypeSelector.defaultProps = {
  selected: 'vegetarian',
  error: null,
};

export default DietTypeSelector;

