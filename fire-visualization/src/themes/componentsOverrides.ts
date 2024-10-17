// material-ui
import { Theme } from '@mui/material';

// third-party
import { merge } from 'lodash';

// project import
import { Badge } from './overrides/Badge';
import { Button } from './overrides/Button';
import { CardContent } from './overrides/CardContent';
import { Checkbox } from './overrides/Checkbox';
import { Chip } from './overrides/Chip';
import { IconButton } from './overrides/IconButton';
import { InputLabel } from './overrides/InputLabel';
import { LinearProgress } from './overrides/LinearProgress';
import { Link } from './overrides/Link';
import { ListItemIcon } from './overrides/ListItemIcon';
import { OutlinedInput } from './overrides/OutlinedInput';
import { Tab } from './overrides/Tab';
import { TableCell } from './overrides/TableCell';
import { Tabs } from './overrides/Tabs';
import { Typography } from './overrides/Typography';

// ==============================|| OVERRIDES - MAIN ||============================== //

export const componentsOverrides = (theme: Theme) => {
  return merge(
    Button(theme),
    Badge(theme),
    CardContent(),
    Checkbox(theme),
    Chip(theme),
    IconButton(theme),
    InputLabel(theme),
    LinearProgress(),
    Link(),
    ListItemIcon(),
    OutlinedInput(theme),
    Tab(theme),
    TableCell(theme),
    Tabs(),
    Typography(),
  );
};
