import React from 'react';
import './footer.css'

function Footer() {
  return <div className="bcsc__footer section__padding">
  <div className="bcsc__footer-heading">
    <h1 className="gradient__text">Do you want to step in to the future before others</h1>
  </div>

  <div className="bcsc__footer-btn">
    <p>Request Early Access</p>
  </div>

  <div className="bcsc__footer-links"> 
    <div className="bcsc__footer-links_div">
      <h4>Company</h4>
      <p>Terms & Conditions </p>
      <p>Privacy Policy</p>
      <p>Contact</p>
    </div>
    <div className="bcsc__footer-links_div">
      <h4>Get in touch</h4>
      <p>Homeoffice Street</p>
      <p>0931-123567</p>
      <p>info@payme.de</p>
    </div>
  </div>

  <div className="bcsc__footer-copyright">
    <p>@2022 BCSC_FWPM. All rights reserved.</p>
  </div>
</div>
}

export default Footer;
