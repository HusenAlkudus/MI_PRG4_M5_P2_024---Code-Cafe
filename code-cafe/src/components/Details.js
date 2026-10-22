import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { itemImages } from '../items';
import ItemType from './item';
import Thumbnail from './Thumbnail';
import './Details.css';

function Details({ items }) {
  return (
    <div className="details-component">
      <div>
        <Outlet />
      </div>

      <div className="details-component-sidebar">
        {items.map((item) => (
          <Thumbnail
            key={item.itemId}
            itemId={item.itemId}
            image={itemImages[item.imageId]}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}

Details.propTypes = {
  items: PropTypes.arrayOf(ItemType).isRequired,
};

export default Details;
