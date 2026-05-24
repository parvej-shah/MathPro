import React from 'react';

// ─── Premium Shimmer Bone (shared primitive) ─────────────────────
const Bone: React.FC<{ className?: string; rounded?: string }> = ({
  className = '',
  rounded = 'rounded-lg',
}) => (
  <div
    className={`relative overflow-hidden bg-gray-200/60 dark:bg-white/[0.06] ${rounded} ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/[0.08] to-transparent" />
    <div className="absolute inset-0 -translate-x-full animate-shimmer-slow bg-gradient-to-r from-transparent via-purple/[0.04] to-transparent" />
  </div>
);

// Text line skeleton
export const TextLineSkeleton: React.FC<{ 
  width?: string; 
  height?: string;
  className?: string;
}> = ({ 
  width = 'w-full', 
  height = 'h-4',
  className = '' 
}) => (
  <Bone className={`${height} ${width} rounded ${className}`} />
);

// Button skeleton
export const ButtonSkeleton: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}> = ({ size = 'md', fullWidth = false, className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-28',
    lg: 'h-12 w-36',
  };

  return (
    <Bone 
      className={`${fullWidth ? 'w-full' : sizeClasses[size]} rounded-lg ${className}`} 
    />
  );
};

// Avatar skeleton
export const AvatarSkeleton: React.FC<{ 
  size?: number;
  className?: string;
}> = ({ size = 40, className = '' }) => (
  <div 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
  >
    <Bone className="w-full h-full rounded-full" />
  </div>
);

// Card skeleton
export const CardSkeleton: React.FC<{ 
  hasImage?: boolean;
  lines?: number;
  className?: string;
}> = ({ hasImage = true, lines = 3, className = '' }) => (
  <div className={`bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl overflow-hidden backdrop-blur-lg border border-gray-300/10 ${className}`}>
    {hasImage && <Bone className="w-full h-48" />}
    <div className="p-6 space-y-3">
      <Bone className="h-6 w-3/4 rounded-lg" />
      {Array.from({ length: lines }).map((_, i) => (
        <Bone 
          key={i} 
          className={`h-4 rounded ${i === lines - 1 ? 'w-5/6' : 'w-full'}`}
        />
      ))}
    </div>
  </div>
);

// Table row skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-300/10">
    {Array.from({ length: columns }).map((_, i) => (
      <div key={i} className="flex-1">
        <Bone className="h-4 w-full rounded" />
      </div>
    ))}
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
}> = ({ rows = 5, columns = 4, hasHeader = true }) => (
  <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl overflow-hidden backdrop-blur-lg border border-gray-300/10">
    {hasHeader && (
      <div className="bg-gray-400/10 dark:bg-gray-700/20 p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1">
              <Bone className="h-5 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    )}
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} columns={columns} />
    ))}
  </div>
);

// Form field skeleton
export const FormFieldSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Bone className="h-5 w-32 rounded" />
    <Bone className="h-12 w-full rounded-lg" />
  </div>
);

// List item skeleton
export const ListItemSkeleton: React.FC<{ 
  hasAvatar?: boolean;
  hasAction?: boolean;
}> = ({ hasAvatar = false, hasAction = false }) => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-300/10">
    {hasAvatar && <AvatarSkeleton />}
    <div className="flex-1 space-y-2">
      <Bone className="h-5 w-3/4 rounded" />
      <Bone className="h-4 w-1/2 rounded" />
    </div>
    {hasAction && <ButtonSkeleton size="sm" />}
  </div>
);

// Badge skeleton
export const BadgeSkeleton: React.FC<{ 
  width?: string;
  className?: string;
}> = ({ width = 'w-20', className = '' }) => (
  <Bone className={`h-6 ${width} rounded-full ${className}`} />
);

// Notification skeleton
export const NotificationSkeleton: React.FC = () => (
  <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-xl p-4 flex gap-3 backdrop-blur-lg border border-gray-300/10">
    <AvatarSkeleton size={48} />
    <div className="flex-1 space-y-2">
      <Bone className="h-5 w-3/4 rounded" />
      <Bone className="h-4 w-full rounded" />
      <Bone className="h-3 w-24 rounded" />
    </div>
  </div>
);

// Search bar skeleton
export const SearchBarSkeleton: React.FC = () => (
  <div className="relative">
    <Bone className="h-12 w-full rounded-lg" />
    <div className="absolute right-4 top-1/2 -translate-y-1/2">
      <Bone className="h-6 w-6 rounded-full" />
    </div>
  </div>
);

// Navigation skeleton
export const NavSkeleton: React.FC = () => (
  <div className="bg-background border-b border-gray-300/10 px-8 py-4">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <Bone className="h-10 w-32 rounded" />
      <div className="flex gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Bone key={i} className="h-6 w-20 rounded" />
        ))}
      </div>
      <div className="flex gap-4">
        <AvatarSkeleton size={40} />
      </div>
    </div>
  </div>
);

// Modal skeleton
export const ModalSkeleton: React.FC = () => (
  <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-300/20 max-w-2xl mx-auto">
    <div className="space-y-6">
      <Bone className="h-8 w-3/4 rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Bone key={i} className="h-4 w-full rounded" />
        ))}
      </div>
      <div className="flex justify-end gap-4">
        <ButtonSkeleton />
        <ButtonSkeleton />
      </div>
    </div>
  </div>
);

// Tabs skeleton
export const TabsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="flex gap-4 border-b border-gray-300/10 pb-4">
    {Array.from({ length: count }).map((_, i) => (
      <Bone key={i} className="h-10 w-32 rounded-lg" />
    ))}
  </div>
);

// Breadcrumb skeleton
export const BreadcrumbSkeleton: React.FC = () => (
  <div className="flex items-center gap-2">
    {[1, 2, 3].map((i) => (
      <React.Fragment key={i}>
        <Bone className="h-5 w-24 rounded" />
        {i < 3 && <span className="text-muted-foreground">/</span>}
      </React.Fragment>
    ))}
  </div>
);

// Full page loader with branding
export const FullPageSkeleton: React.FC<{ 
  message?: string;
}> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-6">
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-gray-300/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-purple border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-2">
        <Bone className="h-6 w-48 rounded-lg mx-auto" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  </div>
);

export default {
  TextLine: TextLineSkeleton,
  Button: ButtonSkeleton,
  Avatar: AvatarSkeleton,
  Card: CardSkeleton,
  TableRow: TableRowSkeleton,
  Table: TableSkeleton,
  FormField: FormFieldSkeleton,
  ListItem: ListItemSkeleton,
  Badge: BadgeSkeleton,
  Notification: NotificationSkeleton,
  SearchBar: SearchBarSkeleton,
  Nav: NavSkeleton,
  Modal: ModalSkeleton,
  Tabs: TabsSkeleton,
  Breadcrumb: BreadcrumbSkeleton,
  FullPage: FullPageSkeleton,
};
