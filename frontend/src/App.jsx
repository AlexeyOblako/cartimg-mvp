import SessionList from './components/SessionList';
import BookingHistory from './components/BookingHistory';
import './App.css';

function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>🏎️ Carting Center</h1>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Заезды</h2>
        <SessionList />
      </section>

      <section>
        <BookingHistory />
      </section>
    </div>
  );
}

export default App;
