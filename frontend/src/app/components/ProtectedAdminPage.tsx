import { ProtectedRoute } from './ProtectedRoute';
import { Admin } from '../pages/Admin';

export function ProtectedAdminPage() {
  return (
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  );
}
