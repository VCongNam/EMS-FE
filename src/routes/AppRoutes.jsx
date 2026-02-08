// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export const AppRoutes = () => {
     return (
          <BrowserRouter>
               <Routes>
                    {/* Define routes here */}
                    <Route path="/" element={<div>Welcome to EMS</div>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
               </Routes>
          </BrowserRouter>
     );
};
