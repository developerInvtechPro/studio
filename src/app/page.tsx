
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import PosLayout from '@/components/pos/PosLayout';

export default function Home() {
  return (
    <ProtectedLayout>
      <PosLayout />
    </ProtectedLayout>
  );
}
