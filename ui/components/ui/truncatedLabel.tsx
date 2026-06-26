import * as React from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type TruncatedLabelProps = {
	children: React.ReactNode;
	className?: string;
	tooltip?: React.ReactNode;
	tooltipSide?: React.ComponentProps<typeof TooltipContent>["side"];
} & Omit<React.ComponentProps<"span">, "children">;

function TruncatedLabel({ children, className, tooltip, tooltipSide = "right", ...props }: TruncatedLabelProps) {
	const textRef = useRef<HTMLSpanElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);

	const checkTruncation = useCallback(() => {
		const el = textRef.current;
		if (el) {
			setIsTruncated(el.scrollWidth > el.clientWidth);
		}
	}, []);

	useLayoutEffect(() => {
		const el = textRef.current;
		if (!el) return;
		checkTruncation();
		const observer = new ResizeObserver(checkTruncation);
		observer.observe(el);
		return () => observer.disconnect();
	}, [checkTruncation]);

	const tooltipContent = tooltip ?? (typeof children === "string" ? children : undefined);

	const inner = (
		<span ref={textRef} className={cn("min-w-0 truncate", className)} {...props}>
			{children}
		</span>
	);

	if (!isTruncated || tooltipContent == null) return inner;

	return (
		<Tooltip>
			<TooltipTrigger asChild>{inner}</TooltipTrigger>
			<TooltipContent side={tooltipSide}>{tooltipContent}</TooltipContent>
		</Tooltip>
	);
}

export { TruncatedLabel };
