import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import nat15 from '../../img/nat-15-xsmall.jpg';
import nat14 from '../../img/nat-14-xsmall.jpg';

class Landing extends Component {

  render() {
    return (
      <Fragment>
        <header className='header'>
          <div className='header__text-box'>
            <h1 className='heading-primary'>
              <span className='heading-primary--main'>nature</span>
              <span className='heading-primary--sub'>
                Connect with yourself
              </span>
            </h1>
            <Link to='/packages' className='btn btn--green'>
              Explore our packages
            </Link>
          </div>
        </header>
        <main>
          <section className='section-about'>
            <div className='u-center-text u-margin-top-big'>
              <h2 className='heading-secondary u-margin-top-very-big u-margin-bottom-medium'>
                Relax and Recharge
              </h2>
            </div>
            <div className='row'>
              <div className='col-1-of-2'>
                <h3 className='heading-tertiary u-margin-left-small u-margin-right-small'>
                  Adventure Retreats
                </h3>
                <p className='paragraph u-margin-left-small u-margin-right-small'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Doloremque rem nostrum illum vel odit aut odio veniam maiores?
                  Commodi nam non expedita sed accusamus. Culpa sed facere vel.
                  Maxime, animi.
                </p>
                <h3 className='heading-tertiary u-margin-left-small'>
                  Wellness Retreats
                </h3>
                <p className='paragraph u-margin-left-small'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Numquam laborum quaerat alias cupiditate. Nulla porro, veniam
                  deleniti reprehenderit temporibus, possimus sed harum ratione
                  facere ea nihil at, labore unde ex?
                </p>

                <span className='btn-text-wrapper'>
                  <Link to='/packages' className='btn-text'>
                    Learn more &rsaquo;&rsaquo;
                  </Link>
                </span>
              </div>
              <div className='col-1-of-2'>
                <div className='about u-center-text'>
                  <h3 className='heading-special heading-special--space '>
                    Special Offer!!!
                  </h3>
                  <div className='card'>
                    <div className='card__picture card__picture--1'>
                      &nbsp;
                      <h4 className='card__heading'>
                        <span className='card__heading-span card__heading-span--1'>
                          20% off of the Blue Hill package
                        </span>
                      </h4>
                    </div>
                    <div className='card__reserve'>
                      <span className='btn-text-reserve'>
                        <Link
                          to='package-detail/5c88fa8cf4afda39709c2955'
                          className='btn-text'
                        >
                          Check Now <i className='fas fa-concierge-bell'></i>
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='section-testimonial'>
            <div className='u-center-text'>
              <h2 className='heading-secondary u-margin-top-medium u-margin-bottom-medium'>
                From our guests...
              </h2>
            </div>
            <div className='row'>
              <div className='testimonial'>
                <figure className='testimonial__shape'>
                  <img src={nat14} alt='' className='testimonial__img' />
                </figure>
                <div className='testimonial__text'>
                  <h3 className='heading-tertiary'>Amazing...</h3>
                  <p className='paragraph'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Magnam quas exercitationem officia, cumque consectetur modi
                    reprehenderit perspiciatis impedit natus ullam omnis. Labore, voluptatibus. - Michael J., Seattle, WA
                  </p>
                </div>
              </div>
              <div className='testimonial'>
                <figure className='testimonial__shape'>
                  <img src={nat15} alt='' className='testimonial__img' />
                </figure>
                <div className='testimonial__text'>
                  <h3 className='heading-tertiary'>Wow...</h3>
                  <p className='paragraph'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Magnam quas exercitationem officia, cumque consectetur modi
                    reprehenderit perspiciatis impedit natus ullam, animi
                    incidunt at quia nobis obcaecati omnis. Labore, voluptatibus
                    impedit. - Jane K., NY, NY
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Fragment>
    );
  }
}


export default Landing