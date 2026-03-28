import { useNavigate } from 'react-router-dom';
import { AIAssistantChat } from './shared/AIAssistantChat';

export function SaarhtiiKeSath() {
  const navigate = useNavigate();

  function handleFormFill(data: {
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) {
    sessionStorage.setItem('ai_prefill_grievance', JSON.stringify(data));
    navigate('/dashboard/new-grievance?from_ai=1');
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Saarhtii ke sath</h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Apni problem Saarthii AI ko batayein. Assistant aapki complaint details taiyar karega aur Register Complaint form ko auto-fill kar dega.
        </p>
      </div>

      <div className="h-[78vh] min-h-[560px]">
        <AIAssistantChat onFormFill={handleFormFill} />
      </div>
    </div>
  );
}
