import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStudents } from '../lib/mockData';

export default function WelcomeScreen() {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { setSessionCode, setStudent, setScreen } = useAppStore();

  const joinSession = async () => {
    if (code.length !== 4) {
      alert('El código debe tener 4 letras');
      return;
    }

    setIsJoining(true);
    try {
      let student;

      if (isSupabaseConfigured) {
        const { data: session } = await supabase
          .from('sessions')
          .select('*')
          .eq('code', code.toUpperCase())
          .single();

        if (!session) {
          alert('Código de sesión no encontrado');
          setIsJoining(false);
          return;
        }

        const nickname = `Escritor_${Math.floor(Math.random() * 1000)}`;
        const { data: newStudent } = await supabase
          .from('students')
          .insert({ session_code: code.toUpperCase(), nickname })
          .select()
          .single();

        student = newStudent;
      } else {
        student = {
          ...mockStudents[0],
          id: `student-${Date.now()}`,
          session_code: code.toUpperCase(),
          nickname: `Escritor_${Math.floor(Math.random() * 1000)}`,
        };
      }

      setSessionCode(code.toUpperCase());
      setStudent(student);
      setScreen('wizard');
    } catch (err) {
      console.error(err);
      alert('Error al unirse a la sesión. Intenta de nuevo.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-5xl font-serif font-bold mb-2 text-ink">NarraTerritorio</h1>
        <p className="text-lg text-gray-600 mb-8 font-serif italic">
          Laboratorio Virtual de Escritura Situada
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[var(--border)]">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ingresa el código de tu misión
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={4}
            placeholder="ABCD"
            className="w-full text-center text-3xl tracking-[0.5em] font-bold py-4 border-2 border-[var(--border)] rounded-xl focus:border-ink focus:outline-none uppercase transition-colors bg-paper"
          />
          <button
            onClick={joinSession}
            disabled={isJoining || code.length !== 4}
            className="w-full mt-6 py-4 bg-ink text-paper rounded-xl font-medium text-lg transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isJoining ? 'Uniéndose...' : 'Entrar al laboratorio'}
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Escribe el código de 4 letras que te dio tu docente
        </p>
      </div>
    </div>
  );
}
