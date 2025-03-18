import React from 'react';
import { createRoot } from 'react-dom/client';
import EventBus from '../../Utils/event-bus';

const App = () => {
  const [success, setSuccess] = React.useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);

    EventBus.publish('submit/1', { requestId: 10 });
  };

  React.useEffect(() => {
    const handleEvent = (data) => {
      if (data?.requestId) {
        setSuccess(true);
      }
      console.log('Microfront1: Получены данные:', data);
    };

    const unsubscribe = EventBus.subscribe('submit/2', handleEvent);

    return () => unsubscribe();
  }, [success]);

  return (
    <div>
      <h1>Microfront1</h1>
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

const container = document.getElementById('microfront1');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
