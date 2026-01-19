"use client";

import type { IconBaseProps } from "@team-numberone/daepiro-design-system";
import { Icon } from "@team-numberone/daepiro-design-system";

export function IconWrapper(props: { name: string } & IconBaseProps) {
	return <Icon {...props} />;
}
