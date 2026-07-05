import SessionList from './components/SessionList';
import BookingForm from './components/BookingForm';
import BookingHistory from './components/BookingHistory';
import './App.css';

function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>🏎️ Carting Center</h1>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Sessions</h2>
        <SessionList />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <BookingForm />
      </section>

      <section>
        <BookingHistory />
      </section>
    </div>
  );
}

export default App;
