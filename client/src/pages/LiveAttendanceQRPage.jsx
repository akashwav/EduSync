// File: client/src/pages/LiveAttendanceQRPage.jsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const LiveAttendanceQRPage = () => {
  const location = useLocation();
  const { session } = location.state || {};

  if (!session) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error: No Class Session Selected</h2>
          <Link to="/faculty/dashboard" className="mt-6 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Return to Dashboard
          </Link>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Live Attendance QR Code</h2>
      <p className="text-gray-600 mt-2 mb-6">
        Ask students to scan this QR code with the EduSync app. This code is valid for the entire class session.
      </p>
      
      <div className="flex flex-col items-center">
        <div className="p-4 bg-white border-4 border-blue-500 rounded-lg">
          <QRCodeSVG value={session.id} size={256} />
        </div>
      </div>
    </div>
  );
};

export default LiveAttendanceQRPage;