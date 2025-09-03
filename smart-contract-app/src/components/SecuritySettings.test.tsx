import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SecuritySettings from './SecuritySettings';
import * as authConfig from '../services/authConfig';

// Mock the authConfig module
jest.mock('../services/authConfig');

describe('SecuritySettings Component', () => {
  const mockUserId = 'test-user-123';
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (authConfig.getAuthSecurityConfig as jest.Mock).mockResolvedValue({
      enabledMfaMethods: ['totp', 'sms'],
      leakedPasswordProtection: true,
      passwordStrengthRequirements: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
    });
    
    (authConfig.configureMFA as jest.Mock).mockResolvedValue({
      id: 'mfa-123',
      status: 'enrolled',
    });
    
    (authConfig.generateBackupCodes as jest.Mock).mockResolvedValue([
      'CODE1234',
      'CODE5678',
      'CODE9012',
    ]);
    
    (authConfig.checkPasswordLeaked as jest.Mock).mockResolvedValue(false);
  });

  it('renders security settings component', async () => {
    render(<SecuritySettings userId={mockUserId} />);
    
    expect(screen.getByText('Security Settings')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Leaked Password Protection: Enabled/)).toBeInTheDocument();
    });
  });

  it('displays security status correctly', async () => {
    render(<SecuritySettings userId={mockUserId} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Leaked Password Protection: Enabled/)).toBeInTheDocument();
      expect(screen.getByText(/MFA Methods Available: totp, sms/)).toBeInTheDocument();
    });
  });

  it('enables TOTP MFA when button is clicked', async () => {
    render(<SecuritySettings userId={mockUserId} />);
    
    const totpButton = await screen.findByText('Enable TOTP (Authenticator App)');
    fireEvent.click(totpButton);
    
    await waitFor(() => {
      expect(authConfig.configureMFA).toHaveBeenCalledWith('totp');
      expect(screen.getByText(/TOTP MFA enabled successfully!/)).toBeInTheDocument();
    });
  });

  it('enables SMS MFA when button is clicked', async () => {
    render(<SecuritySettings userId={mockUserId} />);
    
    const smsButton = await screen.findByText('Enable SMS');
    fireEvent.click(smsButton);
    
    await waitFor(() => {
      expect(authConfig.configureMFA).toHaveBeenCalledWith('sms');
      expect(screen.getByText(/SMS MFA enabled successfully!/)).toBeInTheDocument();
    });
  });

  it('generates backup codes when button is clicked', async () => {
    render(<SecuritySettings userId={mockUserId} />);
    
    const generateButton = await screen.findByText('Generate Backup Codes');
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(authConfig.generateBackupCodes).toHaveBeenCalled();
      expect(screen.getByText('CODE1234')).toBeInTheDocument();
      expect(screen.getByText('CODE5678')).toBeInTheDocument();
      expect(screen.getByText('CODE9012')).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    (authConfig.validatePasswordStrength as jest.Mock).mockReturnValue({
      valid: false,
      errors: ['Password must be at least 12 characters long'],
    });
    
    render(<SecuritySettings userId={mockUserId} />);
    
    const passwordInput = await screen.findByPlaceholderText('Enter a new password to test');
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    
    await waitFor(() => {
      expect(screen.getByText('• Password must be at least 12 characters long')).toBeInTheDocument();
    });
  });

  it('checks password against breaches', async () => {
    (authConfig.validatePasswordStrength as jest.Mock).mockReturnValue({
      valid: true,
      errors: [],
    });
    
    render(<SecuritySettings userId={mockUserId} />);
    
    const passwordInput = await screen.findByPlaceholderText('Enter a new password to test');
    fireEvent.change(passwordInput, { target: { value: 'SecureP@ssw0rd123' } });
    
    await waitFor(() => {
      expect(authConfig.checkPasswordLeaked).toHaveBeenCalledWith('SecureP@ssw0rd123');
      expect(screen.getByText(/This password has not been found in known data breaches/)).toBeInTheDocument();
    });
  });

  it('shows warning for leaked passwords', async () => {
    (authConfig.validatePasswordStrength as jest.Mock).mockReturnValue({
      valid: true,
      errors: [],
    });
    (authConfig.checkPasswordLeaked as jest.Mock).mockResolvedValue(true);
    
    render(<SecuritySettings userId={mockUserId} />);
    
    const passwordInput = await screen.findByPlaceholderText('Enter a new password to test');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    await waitFor(() => {
      expect(screen.getByText(/This password has been found in data breaches/)).toBeInTheDocument();
    });
  });

  it('handles MFA enrollment errors', async () => {
    (authConfig.configureMFA as jest.Mock).mockRejectedValue(new Error('MFA enrollment failed'));
    
    render(<SecuritySettings userId={mockUserId} />);
    
    const totpButton = await screen.findByText('Enable TOTP (Authenticator App)');
    fireEvent.click(totpButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to enable MFA/)).toBeInTheDocument();
    });
  });

  it('displays security recommendations', async () => {
    render(<SecuritySettings userId={mockUserId} />);
    
    await waitFor(() => {
      expect(screen.getByText('Security Recommendations')).toBeInTheDocument();
      expect(screen.getByText(/Use a unique password for this account/)).toBeInTheDocument();
      expect(screen.getByText(/Enable at least two MFA methods/)).toBeInTheDocument();
    });
  });
});