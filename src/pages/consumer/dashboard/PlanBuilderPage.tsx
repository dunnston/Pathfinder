/**
 * Plan Builder Page
 * Assemble accepted suggestions and custom recommendations into a plan
 */

import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlanBuilder } from '@/components/suggestions';
import { ChevronLeft } from 'lucide-react';

export function PlanBuilderPage() {
  return (
    <DashboardLayout
      title="Your Plan"
      subtitle="Organize and track your financial action items"
    >
      <div className="space-y-6">
        {/* Back to suggestions link */}
        <Link
          to="/consumer/dashboard/suggestions"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Suggestions
        </Link>

        {/* Plan Builder */}
        <PlanBuilder />
      </div>
    </DashboardLayout>
  );
}
