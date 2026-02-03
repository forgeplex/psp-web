import { createFileRoute } from '@tanstack/react-router';
import { ChannelConfigsPage } from '../../../features/channels/pages/ChannelConfigsPage';

export const Route = createFileRoute('/_authenticated/channels/channel-configs')({
  component: ChannelConfigsPage,
});
