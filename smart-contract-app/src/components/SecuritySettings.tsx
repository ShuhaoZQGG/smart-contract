import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, AlertCircle, CheckCircle } from 'lucide-react';
import {
  configureMFA,
  generateBackupCodes,
  getAuthSecurityConfig,
  validatePasswordStrength,
  checkPasswordLeaked,
  AuthSecurityConfig,
} from '../services/authConfig';

interface SecuritySettingsProps {
  userId: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ userId }) => {
  const [config, setConfig] = useState<AuthSecurityConfig | null>(null);
  const [mfaStatus, setMfaStatus] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [passwordCheck, setPasswordCheck] = useState<{
    checking: boolean;
    leaked: boolean;
  }>({ checking: false, leaked: false });
  const [newPassword, setNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    loadSecurityConfig();
  }, []);

  const loadSecurityConfig = async () => {
    try {
      const securityConfig = await getAuthSecurityConfig();
      setConfig(securityConfig);
    } catch (error) {
      console.error('Failed to load security config:', error);
    }
  };

  const handleEnableMFA = async (type: 'totp' | 'sms', phone?: string) => {
    try {
      setMfaStatus('Enrolling...');
      await configureMFA(type, phone);
      setMfaStatus(`${type.toUpperCase()} MFA enabled successfully!`);
    } catch (error) {
      setMfaStatus(`Failed to enable MFA: ${error}`);
    }
  };

  const handleGenerateBackupCodes = async () => {
    try {
      const codes = await generateBackupCodes();
      setBackupCodes(codes);
    } catch (error) {
      console.error('Failed to generate backup codes:', error);
    }
  };

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    // Validate password strength
    const validation = validatePasswordStrength(password);
    setPasswordErrors(validation.errors);

    // Check if password has been leaked
    if (password.length >= 8) {
      setPasswordCheck({ checking: true, leaked: false });
      const isLeaked = await checkPasswordLeaked(password);
      setPasswordCheck({ checking: false, leaked: isLeaked });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Shield className="mr-3 text-blue-600" size={24} />
        <h2 className="text-2xl font-bold">Security Settings</h2>
      </div>

      {/* Security Status Overview */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-3">Security Status</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            {config?.leakedPasswordProtection ? (
              <CheckCircle className="mr-2 text-green-500" size={16} />
            ) : (
              <AlertCircle className="mr-2 text-yellow-500" size={16} />
            )}
            <span>Leaked Password Protection: {config?.leakedPasswordProtection ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex items-center">
            {config?.enabledMfaMethods && config.enabledMfaMethods.length > 1 ? (
              <CheckCircle className="mr-2 text-green-500" size={16} />
            ) : (
              <AlertCircle className="mr-2 text-yellow-500" size={16} />
            )}
            <span>MFA Methods Available: {config?.enabledMfaMethods.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Multi-Factor Authentication */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Key className="mr-2 text-gray-600" size={20} />
          <h3 className="font-semibold">Multi-Factor Authentication</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => handleEnableMFA('totp')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enable TOTP (Authenticator App)
          </button>
          <button
            onClick={() => {
              const phone = window.prompt('Enter your phone number (with country code):');
              if (phone) {
                handleEnableMFA('sms', phone);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enable SMS
          </button>
        </div>
        {mfaStatus && (
          <p className="mt-3 text-sm text-gray-600">{mfaStatus}</p>
        )}
      </div>

      {/* Backup Codes */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Lock className="mr-2 text-gray-600" size={20} />
          <h3 className="font-semibold">Backup Codes</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Generate backup codes that you can use to access your account if you lose access to your MFA device.
        </p>
        <button
          onClick={handleGenerateBackupCodes}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Generate Backup Codes
        </button>
        {backupCodes.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-semibold mb-2">⚠️ Save these codes in a secure place:</p>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <code key={index} className="p-2 bg-white rounded border">
                  {code}
                </code>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Password Strength Checker */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Password Strength Checker</h3>
        <input
          type="password"
          placeholder="Enter a new password to test"
          value={newPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 border rounded mb-3"
        />
        
        {passwordErrors.length > 0 && (
          <div className="mb-3">
            {passwordErrors.map((error, index) => (
              <p key={index} className="text-red-500 text-sm">• {error}</p>
            ))}
          </div>
        )}
        
        {passwordCheck.checking && (
          <p className="text-gray-600">Checking password against known breaches...</p>
        )}
        
        {!passwordCheck.checking && newPassword.length >= 8 && (
          <div className={`p-3 rounded ${passwordCheck.leaked ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {passwordCheck.leaked ? (
              <>
                <AlertCircle className="inline mr-2" size={16} />
                This password has been found in data breaches. Please choose a different password.
              </>
            ) : (
              <>
                <CheckCircle className="inline mr-2" size={16} />
                This password has not been found in known data breaches.
              </>
            )}
          </div>
        )}
      </div>

      {/* Security Recommendations */}
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Security Recommendations</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Use a unique password for this account</li>
          <li>• Enable at least two MFA methods</li>
          <li>• Store backup codes in a secure location</li>
          <li>• Regularly review your account activity</li>
          <li>• Keep your recovery email up to date</li>
        </ul>
      </div>
    </div>
  );
};

export default SecuritySettings;