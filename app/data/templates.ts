
import { FormTemplate } from '~/types/form';

export const formTemplates: FormTemplate[] = [
  {
    id: 'contact-us',
    name: 'Contact Us',
    description: 'A simple contact form with name, email, and message fields',
    config: {
      title: 'Contact Us',
      description: 'Get in touch with us',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          helpText: 'Please enter your first and last name'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          validation: {
            pattern: '^[^@]+@[^@]+\.[^@]+$'
          }
        },
        {
          id: 'phone',
          type: 'phone',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: false
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: true,
          validation: {
            minLength: 10,
            maxLength: 500
          }
        }
      ],
      steps: [{
        id: 'step-1',
        title: 'Contact Information',
        fields: ['name', 'email', 'phone', 'message']
      }],
      isMultiStep: false
    }
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'Multi-step job application form',
    config: {
      title: 'Job Application',
      description: 'Apply for a position at our company',
      fields: [
        {
          id: 'first-name',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
          stepId: 'personal-info'
        },
        {
          id: 'last-name',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
          stepId: 'personal-info'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          stepId: 'personal-info'
        },
        {
          id: 'position',
          type: 'dropdown',
          label: 'Position Applied For',
          required: true,
          options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer'],
          stepId: 'job-details'
        },
        {
          id: 'experience',
          type: 'dropdown',
          label: 'Years of Experience',
          required: true,
          options: ['0-1 years', '2-3 years', '4-5 years', '5+ years'],
          stepId: 'job-details'
        },
        {
          id: 'cover-letter',
          type: 'textarea',
          label: 'Cover Letter',
          placeholder: 'Tell us why you want to work with us',
          required: true,
          stepId: 'job-details',
          validation: {
            minLength: 100
          }
        }
      ],
      steps: [
        {
          id: 'personal-info',
          title: 'Personal Information',
          description: 'Tell us about yourself',
          fields: ['first-name', 'last-name', 'email']
        },
        {
          id: 'job-details',
          title: 'Job Details',
          description: 'Information about the position',
          fields: ['position', 'experience', 'cover-letter']
        }
      ],
      isMultiStep: true
    }
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Registration form for events with date and checkbox options',
    config: {
      title: 'Event Registration',
      description: 'Register for our upcoming event',
      fields: [
        {
          id: 'participant-name',
          type: 'text',
          label: 'Participant Name',
          placeholder: 'Enter participant name',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true
        },
        {
          id: 'event-date',
          type: 'date',
          label: 'Preferred Event Date',
          required: true
        },
        {
          id: 'dietary-restrictions',
          type: 'checkbox',
          label: 'I have dietary restrictions',
          required: false
        },
        {
          id: 'event-type',
          type: 'dropdown',
          label: 'Event Type',
          required: true,
          options: ['Workshop', 'Conference', 'Networking', 'Seminar']
        }
      ],
      steps: [{
        id: 'step-1',
        title: 'Registration Details',
        fields: ['participant-name', 'email', 'event-date', 'dietary-restrictions', 'event-type']
      }],
      isMultiStep: false
    }
  }
];
