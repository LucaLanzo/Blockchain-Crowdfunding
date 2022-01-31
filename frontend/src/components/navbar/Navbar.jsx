import React, {useState} from 'react';
import {RiMenu3Line, RiCloseLine} from'react-icons/ri';
import './navbar.css'
// import logo from '../../logo.svg';

const Menu = () =>(
  <>
  <p><a href='#home'>Home</a></p>
     <p><a href='#whatfund'>What is Blockfund?</a></p>
     {/* <p><a className='#invest'>Invest</a></p> */}
     </>
)

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  return <div className='bcsc__navbar'>
  <div className='bcsc__navbar-links'>
  <div className='bcsc__navbar-links_logo'>
  {/* <img src={logo} /> */}
   </div>
   <div className='bcsc__navbar-links_container'>
     <Menu />
   </div>
   </div>
   <div className='bcsc__navbar-connect'>
     <button type='button'>Connect Wallet</button>
   </div>
   <div className='bcsc__navbar-menu'>
  {toggleMenu
  ? <RiCloseLine color='#fff' size={27} onClick={() => setToggleMenu(false)}/>
  : <RiMenu3Line color='#fff' size={27} onClick={() => setToggleMenu(true)}/>  
  }
  {toggleMenu&& (
    <div className='bcsc__navbar-menu_container scale-up-center'>
      <div className='bcsc__navbar-menu_container-links'>
      <Menu />
      <div className='bcsc__navbar-menu_container-links-connect'>
     <button type='button'>Connect Wallet</button>
   </div>
    </div>
    </div>
  )}
   </div>
  </div>;
}

export default Navbar;
