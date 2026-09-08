/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Lucide from 'lucide-react';

interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className = '', size = 20, ...props }: IconProps) {
  // Map our custom tool icons or names to Lucide icons
  let IconComponent = (Lucide as any)[name];

  if (!IconComponent) {
    // Custom fallbacks or standard map
    switch (name) {
      case 'ImageIcon':
        IconComponent = Lucide.Image;
        break;
      case 'Signature':
        IconComponent = Lucide.PenTool;
        break;
      default:
        IconComponent = Lucide.HelpCircle;
    }
  }

  return <IconComponent className={className} size={size} {...props} />;
}
