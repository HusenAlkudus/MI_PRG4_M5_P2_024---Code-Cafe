import axios from 'axios';
import {
  useEffect,
  useReducer,
  useState,
  useMemo,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import { items } from './items';
import Details from './components/Details';
import DetailItem from './components/DetailItem';
import {
  cartReducer,
  CartTypes,
  initialCartState,
} from './reducers/cartReducer';
import NotFound from './components/NotFounds';
import Cart from './components/Cart';
import CurrentUserContext from './contexts/CurrentUserContext';
import Login from './components/Login';
import Orders from './components/Orders';

const storageKey = 'cart';

function App() {
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    (initialState) => {
      try {
        const storedCart = JSON.parse(
          localStorage.getItem(storageKey),
        );

        return storedCart || initialState;
      } catch (error) {
        console.log('Error parsing cart', error);
        return initialState;
      }
    },
  );

  const [currentUser, setCurrentUser] = useState({});

  const currentUserContextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
    }),
    [currentUser],
  );

  useEffect(() => {
    axios
      .get('/api/auth/current-user')
      .then((result) => setCurrentUser(result.data))
      .catch(console.error);
  }, []);

  const addToCart = (itemId) => {
    dispatch({
      type: CartTypes.ADD,
      itemId,
    });
  };

  if (items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <CurrentUserContext.Provider value={currentUserContextValue}>
        <Header cart={cart} />

        <Routes>
          <Route
            path="/details"
            element={<Details items={items} />}
          >
            <Route
              path=":id"
              element={(
                <DetailItem
                  items={items}
                  addToCart={addToCart}
                />
            )}
            />
            <Route
              index
              element={<div>No Item Selected</div>}
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/orders"
            element={<Orders items={items} />}
          />
          <Route path="/" element={<Home items={items} />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/cart"
            element={(
              <Cart
                cart={cart}
                dispatch={dispatch}
                items={items}
              />
          )}
          />
        </Routes>
      </CurrentUserContext.Provider>
    </Router>
  );
}

export default App;
