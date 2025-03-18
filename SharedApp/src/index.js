import React from 'react';
import { createRoot } from 'react-dom/client';

const MicroFrontend1 = React.lazy(async () => await import('Microfront1/App'));
const MicroFrontend2 = React.lazy(async () => await import('Microfront2/App'));

const App = () => {
  return (
    <div>
      <h1>Shared Application</h1>
      {MicroFrontend1 && <MicroFrontend1 />}
      {MicroFrontend2 && <MicroFrontend2 />}
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);
root.render(<App />);
