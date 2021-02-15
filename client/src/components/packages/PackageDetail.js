import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import { getPackageDetail } from '../../actions/packageActions';
import Spinner from '../common/Spinner';


class PackageDetail extends Component {


  componentDidMount() {
    this.props.getPackageDetail(this.props.match.params.id);
  }

  // componentDidUpdate(prevProps) {
  //   if(prevProps.auth.isAuthenticated!== this.props.auth.isAuthenticated){
  //     this.setState({ isAuthenticated: this.props.auth.isAuthenticated });
  //   }
  // }
  render() {
    const { packageDetail, loading } = this.props.packageDetail;
    const { isAuthenticated} = this.props.auth;
    // console.log(packageDetail);
    let packageRender;

    if (Object.keys(packageDetail).length <= 0 || loading) {
      packageRender = <Spinner />;
    } else {
      packageRender = (
        <Fragment>
          <div className='u-center-text'>
            <h2 className='heading-secondary u-margin-top-medium'>
              {packageDetail.name}
            </h2>

          </div>

          <div className='section-details__box'>
            <div className='section-details__header'>
              <div className='row'>
                <div className='section-details__highlights'>
                  <ul className='section-details__list'>
                    <li className='section-details__item'>
                      <i className='far fa-calendar-alt icon'></i>
                      {packageDetail.accomodations[0]}
                    </li>
                    <li className='section-details__item'>
                      <i className='fas fa-utensils icon'></i>
                      {packageDetail.accomodations[1]}
                    </li>
                    <li className='section-details__item'>
                      <i className='fas fa-hiking icon'></i>
                      {packageDetail.accomodations[2]}
                    </li>
                    <li className='section-details__item'>
                      <i className='fas fa-spa icon'></i>
                      {packageDetail.accomodations[3]}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='section-details__description u-margin-bottom-small'>
              <div className='row'>
                <h4 className='heading-tertiary'>About...</h4>
                <p className='paragraph'>{packageDetail.description}</p>
              </div>
            </div>
            <div className='composition'>
              <div className='row'>
                {packageDetail.images.map((img) => (
                  <div
                    alt='composition'
                    key={img}
                    className={`composition__photo composition__${img}`}
                  ></div>
                ))}
              </div>
            </div>

            <div className='row'>
              <div className='btn--book__package'>
                {/* {console.log('isAuthenticated: ', isAuthenticated)} */}
                {isAuthenticated ? (
                  <Link
                    to={`/booking/${packageDetail._id}`}
                    className='btn btn--white'
                  >
                    {' '}
                    Book Now
                  </Link>
                ) : (
                  <Link to='/login' className='btn btn--white'>
                    {' '}
                    Login to Book
                  </Link>
                )}

              </div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <section className='section-details'>
        {packageRender} 
      </section>
    );
  }
}

PackageDetail.propTypes = {
  getPackageDetail: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  packageDetail: state.packages,
  loading: state.packages,
});
export default connect(mapStateToProps, { getPackageDetail })(PackageDetail);
