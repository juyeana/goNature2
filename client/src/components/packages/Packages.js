import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPackages } from '../../actions/packageActions';
import PackageItem from './PackageItem';
class Packages extends Component {
  componentDidMount() {
    this.props.getPackages();
  }

  render() {
    const { packages } = this.props.packages;
    // packages.map(item=>console.log(item))
    return (
      <section className='section-overview'>
        <div className='u-center-text'>
          <h2 className='heading-secondary u-margin-top-medium'>
            Wellness & adventure Retreats
          </h2>
        </div>
        <div className='section-overview__packages'>
          <div className='row u-margin-both-small'>

            {packages.map(el=> <PackageItem item={el} key={el._id}/>)}
          </div>


        </div>
      </section>
    );
  }
}

Packages.propTypes = {
  getPackages: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  packages: state.packages,
});
export default connect(mapStateToProps, { getPackages })(Packages);
