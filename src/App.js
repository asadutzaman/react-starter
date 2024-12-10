// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ItemComponent from './components/ItemComponent';
import ItemDetail from './components/ItemDetail';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Wrap all main routes within MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<ItemComponent />} />
                    <Route path="/items/:id" element={<ItemDetail />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
