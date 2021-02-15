import React from 'react';

export default function footer() {
  return (
    <footer className='footer u-center-text'>
      <div className='row'>
      {/* <hr className='footer__hr__line'/> */}
        <p className='footer__item copyright'>
          {' '}
          &copy; {new Date().getFullYear()} by Juyean Lee
        </p>
      </div>
    </footer>
  );
}
