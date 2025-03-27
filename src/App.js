import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: ''
    }
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setModalMessage('Пользователь успешно создан');
        setModalIsOpen(true);
        fetchUsers(); // Refresh the list
        reset(); // Reset form
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setModalMessage('Пользователь удален');
        setModalIsOpen(true);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
      <div className="container">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <input
                {...register('name', { required: 'Имя обязательно' })}
                placeholder="NAME"
                className="input"
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <input
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Неверный формат email'
                  }
                })}
                placeholder="EMAIL"
                className="input"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <input
                {...register('username', { required: 'Username обязателен' })}
                placeholder="USERNAME"
                className="input"
            />
            {errors.username && <span className="error">{errors.username.message}</span>}
          </div>

          <button type="submit" className="create-btn">CREATE</button>
        </form>


        {users.length === 0 ? (
            <p>Список пуст</p>
        ) : (
            <table className="table">
              <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>USERNAME</th>
                <th>ACTIONS</th>
              </tr>
              </thead>
              <tbody>
              {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>
                      <button
                          onClick={() => handleDelete(user.id)}
                          className="delete-btn"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}


        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="modal"
            overlayClassName="overlay"
        >
          <h2>{modalMessage}</h2>
          <button onClick={closeModal} className="close-btn">Закрыть</button>
        </Modal>
      </div>
  );
}

export default App;