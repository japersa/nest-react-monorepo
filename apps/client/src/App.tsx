import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux/es/hooks/useSelector';

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.users.usersList);
  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, []);
  return (
    <div>
      {users.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default App;
