import { Route, Routes } from 'react-router-dom';
import { Nav } from '../components/nav';
import { About } from './about/about';
import { Home } from './home/home';

export function App() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1>Welcome react-app</h1>
        <Nav />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about/:id?" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
