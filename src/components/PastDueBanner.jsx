import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function PastDueBanner() {
  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2.5 flex items-center gap-2 text-sm font-semibold">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">Payment failed — your subscription is past due.</span>
      <Link to="/billing" className="underline underline-offset-2 whitespace-nowrap font-bold">
        Fix Now
      </Link>
    </div>
  );
}