import React from "react";
import clsx from "clsx";

export function Badge({ children, className = "" }) {
  return (
    <span
      className={clsx(
        "inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full",
        "bg-gray-100 text-gray-800",
        className
      )}
    >
      {children}
    </span>
  );
}
