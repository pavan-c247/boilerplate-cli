

/**
 * Default form values
 */
export const SIMPLE_FORM_DEFAULT_VALUES = {
  name: '',
  dob: '',
  password: '',
  search: '',
  bio: '',
  event_datetime: '',
  date_range_start: '',
  date_range_end: '',
  preferred_time_am_pm: '',
  profile_image: null,
  documents: [],
  agreeToTerms: false,
  interests: [],
  gender: '',
  country: '',
  languages: [],
};

/**
 * Gender options for radio group
 */
export const SIMPLE_FORM_GENDER_OPTIONS= [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

/**
 * Interest options for checkbox group
 */
export const SIMPLE_FORM_INTEREST_OPTIONS = [
  { label: 'Technology', value: 'technology' },
  { label: 'Sports', value: 'sports' },
  { label: 'Music', value: 'music' },
  { label: 'Travel', value: 'travel' },
  { label: 'Reading', value: 'reading' },
];

/**
 * Country options for select field
 */
export const SIMPLE_FORM_COUNTRY_OPTIONS = [
  { label: 'United States', value: 'usa' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'canada' },
  { label: 'Australia', value: 'australia' },
  { label: 'India', value: 'india' },
];

/**
 * Language options for multi-select field
 */
export const SIMPLE_FORM_LANGUAGE_OPTIONS = [
  { label: 'English', value: 'english' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'French', value: 'french' },
  { label: 'German', value: 'german' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'Japanese', value: 'japanese' },
];

/**
 * Date constraints for date of birth field
 */
export const SIMPLE_FORM_DATE_CONSTRAINTS = {
  MIN_DATE: '1900-01-01',
  getMaxDate: (): string => new Date().toISOString().split('T')[0], // Today's date
};

/**
 * File upload constraints
 */
export const SIMPLE_FORM_FILE_CONSTRAINTS = {
  PROFILE_IMAGE: {
    accept: 'image/*',
    maxSizeMb: 5,
  },
  DOCUMENTS: {
    accept: '.pdf,.jpg,.png',
    maxFiles: 5,
    maxSizeMb: 10,
  },
};
