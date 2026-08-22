"use client";

import { forwardRef, useState, InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

// forwardRef matters here specifically because react-hook-form's register() needs a REAL ref to the actual <input> DOM element to do its job - without forwardRef, the ref react-hook-form tries to attach would land on this wrapper component instead of the input itself, and the form simply wouldn't track this field at all.
const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function PasswordInput(props, ref) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={isVisible ? "text" : "password"}
          className={`${props.className || ""} pr-10`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-bark/40 hover:text-bark/70 transition"
          aria-label={isVisible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {isVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
    );
  }
);

export default PasswordInput;