import React, { useState } from 'react';
import { isLoggedIn } from '@/helpers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name?: string;
  email?: string;
  user_id?: string;
  sub?: string;
  id?: string | number;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

const AuthTest: React.FC = () => {
  const [testToken, setTestToken] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleTestToken = () => {
    if (testToken) {
      // First validate the token format
      try {
        const decoded = jwtDecode<DecodedToken>(testToken);
        if (decoded && (decoded.name || decoded.email || decoded.user_id || decoded.sub || decoded.id)) {
          // Save token to both localStorage and cookies
          localStorage.setItem('token', testToken);
          
          // Set cookie for cross-domain access (less restrictive for localhost)
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          const cookieOptions = isLocalhost 
            ? `token=${testToken}; path=/; max-age=${60 * 60 * 24 * 7}`
            : `token=${testToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
          document.cookie = cookieOptions;
          
          const testUrl = `${window.location.origin}${window.location.pathname}?token=${testToken}`;
          setCurrentUrl(testUrl);
          
          // Show success message
          alert('Token saved successfully! Now testing URL flow...');
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: { token: testToken } }));
          
          // Navigate to the test URL
          window.location.href = testUrl;
        } else {
          alert('Invalid token format: Missing required user identifier fields');
        }
      } catch (error: any) {
        alert('Invalid token format: ' + (error?.message || 'Unknown error'));
      }
    } else {
      alert('Please enter a token first');
    }
  };

  const checkAuthStatus = () => {
    const isAuth = isLoggedIn();
    const token = localStorage.getItem('token');
    
    let tokenInfo = 'No token';
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        tokenInfo = `Valid: ${JSON.stringify(decoded, null, 2)}`;
      } catch (error: any) {
        tokenInfo = `Invalid: ${error?.message || 'Unknown error'}`;
      }
    }
    
    alert(`
      Authenticated: ${isAuth}
      Token in localStorage: ${token ? 'Yes' : 'No'}
      Token length: ${token?.length || 0}
      
      Token details:
      ${tokenInfo}
    `);
  };

  const generateTestToken = () => {
    // Generate a simple test JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      name: 'Test User',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour from now
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('test-signature');
    const testToken = `${header}.${payload}.${signature}`;
    setTestToken(testToken);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border z-50">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Auth Test</h3>
        <span className="text-gray-600 dark:text-gray-400 text-xl select-none">
          {isCollapsed ? '▼' : '▲'}
        </span>
      </div>
      
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter test JWT token"
              value={testToken}
              onChange={(e) => setTestToken(e.target.value)}
              className="w-full p-2 border rounded text-sm text-gray-800"
            />
            
            <button
              onClick={generateTestToken}
              className="w-full bg-purple-500 text-white p-2 rounded text-sm hover:bg-purple-600"
            >
              Generate Test Token
            </button>
            
            <button
              onClick={() => {
                if (testToken) {
                  try {
                    const decoded = jwtDecode<DecodedToken>(testToken);
                    if (decoded && (decoded.name || decoded.email || decoded.user_id || decoded.sub || decoded.id)) {
                      // Save token to both localStorage and cookies
                      localStorage.setItem('token', testToken);
                      
                      // Set cookie for cross-domain access (less restrictive for localhost)
                      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                      const cookieOptions = isLocalhost 
                        ? `token=${testToken}; path=/; max-age=${60 * 60 * 24 * 7}`
                        : `token=${testToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
                      document.cookie = cookieOptions;
                      alert('Token saved successfully! Check auth status to verify.');
                      
                      // Dispatch custom event to notify other components
                      window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: { token: testToken } }));
                      
                      window.location.reload(); // Refresh to update UI
                    } else {
                      alert('Invalid token format: Missing required user identifier fields');
                    }
                  } catch (error: any) {
                    alert('Invalid token format: ' + (error?.message || 'Unknown error'));
                  }
                } else {
                  alert('Please enter a token first');
                }
              }}
              className="w-full bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
            >
              Save Token Only
            </button>
            
            <button
              onClick={handleTestToken}
              className="w-full bg-indigo-500 text-white p-2 rounded text-sm hover:bg-indigo-600"
            >
              Test Token URL
            </button>
            
            <button
              onClick={checkAuthStatus}
              className="w-full bg-green-500 text-white p-2 rounded text-sm hover:bg-green-600"
            >
              Check Auth Status
            </button>
            
            <button
              onClick={() => {
                // Force refresh authentication state
                window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: { token: localStorage.getItem('token') } }));
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
              className="w-full bg-orange-500 text-white p-2 rounded text-sm hover:bg-orange-600"
            >
              Force Auth Refresh
            </button>
            
            <button
              onClick={() => {
                const existingToken = localStorage.getItem('token');
                if (existingToken) {
                  setTestToken(existingToken);
                  alert('Existing token loaded into input field');
                } else {
                  // Try to get token from cookies as fallback
                  const cookies = document.cookie.split(';');
                  let cookieToken = null;
                  for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.startsWith('token=')) {
                      cookieToken = decodeURIComponent(cookie.substring(6));
                      break;
                    }
                  }
                  
                  if (cookieToken) {
                    setTestToken(cookieToken);
                    alert('Token found in cookies and loaded into input field');
                  } else {
                    alert('No token found in localStorage or cookies');
                  }
                }
              }}
              className="w-full bg-yellow-500 text-white p-2 rounded text-sm hover:bg-yellow-600"
            >
              Load Existing Token
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('token');
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.reload();
              }}
              className="w-full bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600"
            >
              Clear Auth & Reload
            </button>
          </div>
          
          {currentUrl && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Test URL: {currentUrl}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthTest;
