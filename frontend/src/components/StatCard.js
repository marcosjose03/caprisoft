import React from 'react';
import '../styles/Admin.css';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-icon">
                <Icon size={32} />
            </div>
            <div className="stat-content">
                <p className="stat-title">{title}</p>
                <p className="stat-value">{value}</p>
                {subtitle && <p className="stat-subtitle">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;