import React from 'react';
import { useSEO } from '../seo/useSEO';

const NotFound = () => {
    useSEO({
        title: '404 - Page Not Found',
        description: 'The page you are looking for does not exist.',
        path: '/404',
        noindex: true
    });
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404</h1>
            <p>Page Not Found</p>
            <a href="/">Go Home</a>
        </div>
    );
};

export default NotFound;