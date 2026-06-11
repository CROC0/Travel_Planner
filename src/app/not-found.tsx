import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8">
      <div className="text-8xl font-bold neon-glow-teal text-[#00e5cc]">404</div>
      <Plane className="w-12 h-12 text-[#8888aa] rotate-45" />
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Lost in transit</h2>
        <p className="text-[#8888aa]">This page doesn&apos;t exist on the map.</p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-[#00e5cc] text-[#0a0a0f] font-semibold hover:brightness-110 transition-all shadow-[0_0_20px_#00e5cc44]"
      >
        Back to home
      </Link>
    </div>
  );
}
