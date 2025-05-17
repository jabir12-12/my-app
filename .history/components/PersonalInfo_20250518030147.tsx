'use client'; // Only needed if you're using this in a Next.js Client Component
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { IconButton, Typography } from '@mui/material';

interface PersonalInfoProps {
    isModalOpen: boolean;
    onClose: () => void;
}

export default function PersonalInfo({ isModalOpen, onClose }: PersonalInfoProps) {
    return (
        <Dialog open={isModalOpen} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    color: '#1D2939',
                    fontWeight: 'bold',
                    fontSize: '1.125rem'
                }}
            >
                <span className="text-gray-500 text-md">Personal Info</span>
                <IconButton
                    onClick={onClose}
                    sx={{
                        width: 32,
                        height: 32,
                        alignItems: 'flex-end'
                    }}
                >
                    <Image src="/images/cancel-01.svg" alt="Cancel" width={20} height={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: '0 1.5rem 1.5rem' }}>
                <div className="space-y-3">
                    {[
                        { label: 'Name', value: 'Jabir Ali' },
                        { label: 'Email', value: 'jabirali7975@gmail.com' },
                        { label: 'Profession', value: 'Professional Trader' },
                        { label: 'Location', value: 'Mumbai, India' },
                        { label: 'Experience', value: '5+ Years in Financial Markets' }
                    ].map((item, index) => (
                        <div key={index}>
                            <Typography variant="subtitle2" sx={{ color: '#667085', fontSize: '0.75rem' }}>
                                {item.label}
                            </Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#101828' }}>
                                {item.value}
                            </Typography>
                        </div>
                    ))}
                </div>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #D0D5DD',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1.5
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        padding: '0.625rem 1.5rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        borderColor: '#D0D5DD',
                        color: '#344054',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#F2F4F7',
                            borderColor: '#D0D5DD'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        padding: '0.625rem 1.5rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderRadius: '8px',
                        backgroundColor: '#8501FF',
                        textTransform: 'none',
                        boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.05)',
                        '&:hover': {
                            backgroundColor: '#6D0DCC'
                        }
                    }}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
