<template>
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask id="eyeMask">
      <circle cx="100" cy="100" r="40" fill="white" />
    </mask>
    <g mask="url(#eyeMask)">
      <rect x="60" y="60" width="35" height="35" rx="4" fill="#374151" />
      <rect x="105" y="60" width="35" height="35" rx="4" fill="#374151" />
      <rect x="60" y="105" width="35" height="35" rx="4" fill="#374151" />
      <rect
        x="105"
        y="105"
        width="35"
        height="35"
        rx="4"
        fill="var(--ui-primary, #00758F)"
      />
    </g>
  </svg>
</template>
