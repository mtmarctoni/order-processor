import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DocumentUpload from './pages/DocumentUpload';
import ProcessingPage from './pages/ProcessingPage';
import TemplateDesigner from './pages/TemplateDesigner';
import TemplateUpload from './pages/TemplateUpload';
import Settings from './pages/Settings';
import ProcessingQueue from './pages/ProcessingQueue';
import DriveIntegration from './pages/DriveIntegration';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route path="/process" element={<ProcessingPage />} />
          <Route path="/templates" element={<TemplateDesigner />} />
          <Route path="/templates/upload" element={<TemplateUpload />} />
          <Route path="/queue" element={<ProcessingQueue />} />
          <Route path="/drive" element={<DriveIntegration />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;