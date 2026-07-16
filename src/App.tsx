import React from 'react';
import { ProfileSettingsForm } from './components/ProfileSettingsForm';
import './index.css';

const App: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Profile Settings</h1>
      <ProfileSettingsForm />
    </div>
  );
};

export default App;
