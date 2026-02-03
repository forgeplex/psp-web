import { createFileRoute } from '@tanstack/react-router';
import { RoutingRulesPage } from '../../../features/channels/pages/RoutingRulesPage';

export const Route = createFileRoute('/_authenticated/channels/routing-rules')({
  component: RoutingRulesPage,
});
