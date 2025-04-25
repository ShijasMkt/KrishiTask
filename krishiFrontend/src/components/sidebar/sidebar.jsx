import React, { useState } from 'react';
import './sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();
    const navigateTo = useNavigate();
    const [expandedMenu, setExpandedMenu] = useState(null);

    const menuItems = [
        { label: 'Dashboard', icon: 'fa-solid fa-house', path: '/' },
        { 
            label:'Insights', 
            icon: 'fa-solid fa-tractor', 
            path: '/farms/view', 
            subItems: [
                { label: 'Farms', path: '/farms/view' },
                { label: 'Fields', path: '/fields/' },
                { label: 'Crops', path: '/crops/' },
            ],
        },
        {
            label: 'Projects',
            icon: 'fa-solid fa-diagram-project',
            path:'/projects/view',
            
        },
    ];

    const handleMenuClick = (item) => {
        if (item.subItems) {
            setExpandedMenu(expandedMenu === item.label ? null : item.label);
            navigateTo(item.path);
        } else {
            navigateTo(item.path);
            setExpandedMenu(null);
        }
    };

    
    const isActive = (item) => {
        if (item.subItems) {
            return item.subItems.some(subItem => location.pathname.startsWith(subItem.path)) || expandedMenu === item.label;
        }
        return location.pathname === item.path;
    };

    return (
        <div className="sidebar-body">
            <div className="logo">
                <h5 className='text-theme'>Krishi.com</h5>
            </div>
            <div className="menu-sec">
                <ul className="custom-menu">
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {/* Main menu item */}
                            <li
                                className={`menu-item ${isActive(item) ? 'active' : ''}`}
                                onClick={() => handleMenuClick(item)}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                                {item.subItems && (
                                    <i className={`submenu-icon ${expandedMenu === item.label ? 'expanded' : ''}`}></i>
                                )}
                            </li>

                            {/* Submenu items */}
                            {item.subItems && expandedMenu === item.label && (
                                <ul className="submenu">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li
                                            key={subIndex}
                                            className={`menu-item ${location.pathname.startsWith(subItem.path) ? 'active' : ''}`}
                                            onClick={() => navigateTo(subItem.path)}
                                        >
                                            <span>{subItem.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </div>
    );
}