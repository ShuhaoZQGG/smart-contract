import React from 'react';
import { PresenceUser } from '../services/realtime';

interface CollaborationPresenceProps {
  users: PresenceUser[];
  isConnected: boolean;
}

export const CollaborationPresence: React.FC<CollaborationPresenceProps> = ({ 
  users, 
  isConnected 
}) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
        <span className="text-xs text-gray-600">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>

      {/* Active Users */}
      {users.length > 0 && (
        <>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 mr-1">
              {users.length} {users.length === 1 ? 'user' : 'users'} editing
            </span>
            <div className="flex -space-x-2">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="relative group"
                  title={user.name}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {user.name}
                  </div>
                </div>
              ))}
              
              {/* Show +N more indicator */}
              {users.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white shadow-sm">
                  +{users.length - 5}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* No active users message */}
      {isConnected && users.length === 0 && (
        <>
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-xs text-gray-500">
            No other users editing
          </span>
        </>
      )}
    </div>
  );
};

export default CollaborationPresence;