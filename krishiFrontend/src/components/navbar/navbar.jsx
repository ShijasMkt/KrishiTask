import React, { useEffect,useState,useRef } from 'react'
import { useLocation } from 'react-router-dom';
import './navbar.css'
import { logoutFunc } from '../../tools/logout';
import { Menu } from 'primereact/menu';
        

export default function Navbar() {
    const menu = useRef(null);
    const [page,setPage]=useState('');
    const location = useLocation();
    let menuItems = [
        { label: 'Settings', icon: 'pi pi-cog' },
        { label: 'Logout', icon: 'pi pi-sign-out', command: logoutFunc}
    ];
    useEffect(()=>{
        switch (location.pathname) {
            case '/':
                setPage('Dashboard')
                break;
            case '/farms/view':
                setPage('Farms')
                break;
            case '/fields/':
                setPage('Select a farm')
                break;
            case '/fields/view':
                setPage('Fields')
                break;   
            case '/crops/':
                setPage('Crops')
                break;            
            case '/projects/':
                setPage('Projects')
                break;
            default:
                break;
        }
    },[location])
  return (
    
      <div className='navbar-body'>
        <div className="d-flex justify-content-between align-items-center">
            <div >
            <h4 className='mb-0 fw-bold'>{page}</h4>
            </div>
            <div onClick={(event) => menu.current.toggle(event)} className='d-flex gap-2 admin-box'>
                <div className='text-end'>
                <h6 className='fw-bold'>Admin</h6>
                <span>(Super Admin)</span>
                </div>
                
                <img src="src/assets/user-img.jpg" alt="" className='user-img' />
                
            
            </div>
        </div>
        <Menu model={menuItems} popup ref={menu} />
      </div>
    

  

    
       
    
)}
        
 


