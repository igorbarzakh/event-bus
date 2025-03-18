import React from 'react';
import { createRoot } from 'react-dom/client';
import EventBus from '../../Utils/event-bus';

const App = () => {
  const [success, setSuccess] = React.useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);

    EventBus.publish('submit/2', { requestId: 5 });
  };

  React.useEffect(() => {
    const handleEvent = (data) => {
      if (success) return;
      if (data.requestId) {
        setSuccess(true);
      }
      console.log('Microfront2: Получены данные:', data);
    };

    const unsubscribe = EventBus.subscribe('submit/1', handleEvent);

    return () => unsubscribe();
  }, [success]);

  return (
    <div>
      <h1>Microfront2</h1>
      {success && <h2>Success</h2>}
      {!success && (
        <form onSubmit={onSubmit}>
          <input type="text" />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default App;

const container = document.getElementById('microfront2');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
