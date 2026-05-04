import { useAppStore } from './store/useAppStore';
import WelcomeScreen from './pages/WelcomeScreen';
import WizardScreen from './pages/WizardScreen';
import EditorScreen from './pages/EditorScreen';
import PublishScreen from './pages/PublishScreen';
import ClassGallery from './pages/ClassGallery';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  const { screen } = useAppStore();

  return (
    <div className="min-h-screen bg-paper">
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'wizard' && <WizardScreen />}
      {screen === 'editor' && <EditorScreen />}
      {screen === 'publish' && <PublishScreen />}
      {screen === 'gallery' && <ClassGallery />}
      {screen === 'teacher-dashboard' && <TeacherDashboard />}
    </div>
  );
}

export default App;
