import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useCurrentUserContext } from '../contexts/CurrentUserContext';

import ItemType from './item';
import './Orders.css';

function Orders({ items }) {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useCurrentUserContext();

  const loadOrders = () => {
    axios.get('/api/orders')
      .then((result) => setOrders(result.data))
      .catch(console.error);
  };

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`/api/orders/${order.id}`);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser.access === 'associate') {
      loadOrders();

      const ws = new WebSocket(`${(
        window.location.protocol === 'https:' ? 'wss://' : 'ws://'
      )}${window.location.host}/ws-cafe`);

      ws.onopen = () => {
        console.log('connected');
      };

      ws.onerror = (event) => {
        console.error(event);
      };

      ws.onmessage = (message) => {
        const newOrders = JSON.parse(message.data);
        setOrders(newOrders);
      };

      ws.onclose = () => {
        console.log('disconnected');
      };

      return () => {
        ws.close();
        setOrders([]);
      };
    }

    return () => {};
  }, [currentUser]);

  return (
    <div className="orders-component">
      <h2>Existing Orders</h2>

      {orders.length === 0
        ? (
          <div>
            {currentUser.access === 'associate'
              ? 'No Orders'
              : 'Access Denied'}
          </div>
        )
        : orders.map((order) => (
          <div className="order" key={order.id}>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>ZIP Code</th>
                  {order.phone && <th>Phone</th>}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{order.name}</td>
                  <td>{order.zipcode}</td>
                  {order.phone && <td>{order.phone}</td>}
                </tr>
              </tbody>
            </table>

            <table>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Item</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((orderItem) => (
                  <tr key={orderItem.itemId}>
                    <td>{orderItem.quantity}</td>
                    <td>
                      {items.find(
                        (item) => item.itemId === orderItem.itemId,
                      )?.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => deleteOrder(order)}
            >
              Delete Order
            </button>
          </div>
        ))}
    </div>
  );
}

Orders.propTypes = {
  items: PropTypes.arrayOf(ItemType).isRequired,
};

export default Orders;
