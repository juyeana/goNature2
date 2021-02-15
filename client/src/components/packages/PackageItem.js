import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class PackageItem extends Component {
  render() {
    const { item } = this.props;

    return (
      <div className='col-1-of-3'>
        <div className='card__package'>
          <div
            className={`card__package__picture card__package__${item.imageCover}`}
          >
            &nbsp;
          </div>
          <div>
            <h4 className='card__package__heading heading-special u-margin-top-very-small u-margin-top-very-small'>
              {item.name}
            </h4>
          </div>
          <div className='card__package__details'>
            <ul>
              {item.accomodations.map((el, idx) => (
                <li key={idx}>{el}</li>
              ))}
            </ul>
          </div>
          <div className='card__package__price'>
            <div className='card__package__price-value u-center-text'>
              {`$${item.price}`} <span className='paragraph'>per person</span>
            </div>
            <div className='card__package__btn-location u-center-text'>
              <Link
                to={`/package-detail/${item._id}`}
                className='btn btn--white'
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PackageItem;
