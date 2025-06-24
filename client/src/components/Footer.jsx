import React from 'react';

export default function Footer() {
  return (
    <footer style={{ textAlign: 'center' }}>
      <p>© {new Date().getFullYear()} VirtualCare. All rights reserved.</p>
    </footer>
  );
}
