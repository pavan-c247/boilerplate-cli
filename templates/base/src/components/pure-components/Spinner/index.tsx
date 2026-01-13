import React from "react";

import type { SpinnerProps } from "./types";

const Spinner: React.FC<SpinnerProps> = ({
  width = 16,
  height = 16,
  className = "",
}) => {
  const spinnerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <span
      className={`spinner-border spinner-border-sm d-inline-block ${className}`}
      aria-hidden="true"
      style={spinnerStyle}
    />
  );
};

export default Spinner;