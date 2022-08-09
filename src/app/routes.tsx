import { Routes, Route } from 'react-router';
import App from './app';
import Test from './components/testComponent/testComponent';

export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}
