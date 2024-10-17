// project import
import { SimpleBarScroll } from '../../../components/third-party/SimpleBar';
import { WorkspaceNavigation } from './WorkspaceNavigation/WorkspaceNavigation';

// ==============================|| DRAWER CONTENT ||============================== //

export const DrawerContent = () => (
  <SimpleBarScroll
    sx={{
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column',
      },
    }}
  >
    <WorkspaceNavigation />
  </SimpleBarScroll>
);
