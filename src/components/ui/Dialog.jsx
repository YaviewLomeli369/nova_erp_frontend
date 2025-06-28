// src/components/ui/dialog.jsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "phosphor-react"; // ícono (puedes usar cualquier otro o SVG)

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = (props) => (
  <DialogPrimitive.Overlay
    {...props}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
  />
);
export const DialogContent = React.forwardRef(({ children, className, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-lg 
        translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-md bg-white 
        p-6 shadow-lg focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className, ...props }) => (
  <div className={`mb-4 flex items-center justify-between ${className}`} {...props} />
);

export const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold leading-none ${className}`}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
));
DialogTitle.displayName = "DialogTitle";

export const DialogClose = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={`absolute top-3 right-3 rounded-md p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    {...props}
  >
    <X size={20} />
  </DialogPrimitive.Close>
));
DialogClose.displayName = "DialogClose";
