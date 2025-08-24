import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { verifyAndSubmitAttendance } from '../api/attendanceApi';

const CheckInScreen = () => {
    const [status, setStatus] = useState('Ready to scan. Please grant permissions if prompted.');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckIn = async () => {
        setIsLoading(true);
        setStatus('Requesting camera permission...');
        try {
            // 1. Request camera permission
            const permission = await BarcodeScanner.requestPermissions();
            if (permission.camera !== 'granted') {
                setStatus('Camera permission is required to scan QR codes.');
                setIsLoading(false);
                return;
            }

            // 2. Start the scanner
            setStatus('Starting camera... Point it at the QR code.');
            document.body.style.backgroundColor = 'transparent';

            const { barcodes } = await BarcodeScanner.scan();

            if (barcodes.length > 0) {
                const qrToken = barcodes[0].displayValue;
                setStatus('QR Code scanned. Verifying with server...');

                // 3. Send QR token to the backend for verification
                const response = await verifyAndSubmitAttendance({ qrToken });

                setStatus(`Success: ${response.data.message}`);
                setTimeout(() => navigate('/student/dashboard'), 2000);
            } else {
                setStatus('Scan was cancelled. Ready to try again.');
            }
        } catch (error) {
            console.error("Check-in process failed:", error);
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            setStatus(`Failed: ${errorMessage}`);
        } finally {
            document.body.style.backgroundColor = '';
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md text-center flex flex-col items-center h-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Live Attendance Check-In</h2>
            <div className="my-8 flex-1 flex flex-col justify-center items-center">
                <button
                    onClick={handleCheckIn}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg disabled:bg-blue-300 flex items-center"
                >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    {isLoading ? 'Processing...' : 'Start Scan & Check In'}
                </button>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg w-full">
                <p className="text-sm font-medium text-gray-500">STATUS</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{status}</p>
            </div>
        </div>
    );
};

export default CheckInScreen;
