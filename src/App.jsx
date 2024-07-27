import { Provider } from 'react-redux';
import store from './redux/store';
import Column from './component/TaskList';
import Navbar from './component/Navbar';


const App = () => {
  return (
    <Provider store={store}>
      <Navbar />
      <div className="board">
        <Column name="todo" />
        <Column name="doing" />
        <Column name="done" />
      </div>
    </Provider>
  );
};

export default App;
