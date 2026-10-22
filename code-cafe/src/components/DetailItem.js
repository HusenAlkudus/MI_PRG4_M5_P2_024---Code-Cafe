import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { itemImages } from '../items';
import ItemType from './item';
// import { CartTypes } from '../reducers/cartReducer';
import './DetailItem.css';

function DetailItem({ addToCart, items }) {
  const { id } = useParams();

  const detailItem = items.find(
    (item) => item.itemId === id,
  );

  const addItemToCart = () => {
    addToCart(detailItem.itemId);
  };

  return (
    <div className="detail-item-component">
      {detailItem ? (
        <>
          <img
            className="details-image"
            src={itemImages[detailItem.imageId]}
            alt={detailItem.title}
          />

          <h2>{detailItem.title}</h2>

          <div>
            $
            {(detailItem.salePrice ?? detailItem.price).toFixed(2)}
          </div>

          <button
            type="button"
            onClick={addItemToCart}
          >
            Add to Cart
          </button>
        </>
      ) : (
        <h2>Unknown Item</h2>
      )}
    </div>
  );
}

DetailItem.propTypes = {
  addToCart: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(ItemType).isRequired,
};

export default DetailItem;
