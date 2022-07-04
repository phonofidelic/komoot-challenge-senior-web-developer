import React from 'react'
import { Typography } from '@mui/material';

type DownloadButtonProps = {
  disabled?: boolean;
  onDownload(): void;
}

export default function DownloadButton({ disabled, onDownload }: DownloadButtonProps) {
  return (
    <button 
      style={{ 
        display: 'block',
        width: '90%',
        height: '42px',
        margin: '16px auto',
        borderRadius: 6,
        backgroundColor: '#C3E452',
        color: '#383838',
        border: 'none',
        cursor: 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
      disabled={disabled}
      onClick={onDownload}
    >
      <Typography><b>Download your route</b></Typography>
    </button>
  )
}