import React from "react";

export default function ButtonChevron({ className = "" }) {
  return <svg className={`pk-action-chevron ${className}`.trim()} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>;
}
