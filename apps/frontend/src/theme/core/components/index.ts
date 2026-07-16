import type { Theme, Components } from '@mui/material/styles';

import { list } from './list';
import { card } from './card';
import { menu } from './menu';
import { chip } from './chip';
import { link } from './link';
import { form } from './form';
import { tabs } from './tabs';
import { table } from './table';
import { alert } from './alert';
import { stack } from './stack';
import { badge } from './badge';
import { radio } from './radio';
import { paper } from './paper';
import { appBar } from './appbar';
import { dialog } from './dialog';
import { avatar } from './avatar';
import { drawer } from './drawer';
import { select } from './select';
import { rating } from './rating';
import { slider } from './slider';
import { button } from './button';
import { fab } from './button-fab';
import { tooltip } from './tooltip';
import { popover } from './popover';
import { stepper } from './stepper';
import { switches } from './switch';
import { svgIcon } from './svg-icon';
import { skeleton } from './skeleton';
import { backdrop } from './backdrop';
import { progress } from './progress';
import { checkbox } from './checkbox';
import { accordion } from './accordion';
import { textField } from './text-field';
import { pagination } from './pagination';
import { iconButton } from './button-icon';
import { breadcrumbs } from './breadcrumbs';
import { buttonGroup } from './button-group';
import { autocomplete } from './autocomplete';
import { toggleButton } from './button-toggle';
import { datePicker } from './mui-x-date-picker';

// ----------------------------------------------------------------------

export const components: Components<Theme> = {
  ...card,
  ...link,
  ...tabs,
  ...chip,
  ...menu,
  ...list,
  ...stack,
  ...paper,
  ...table,
  ...alert,
  ...badge,
  ...dialog,
  ...appBar,
  ...avatar,
  ...drawer,
  ...stepper,
  ...tooltip,
  ...popover,
  ...svgIcon,
  ...skeleton,
  ...backdrop,
  ...progress,
  ...accordion,
  ...pagination,
  ...breadcrumbs,
  // ➤➤ Forms ➤➤
  ...form,
  ...radio,
  ...select,
  ...slider,
  ...rating,
  ...switches,
  ...checkbox,
  ...textField,
  ...autocomplete,
  // ➤➤ Buttons ➤➤
  ...fab,
  ...button,
  ...iconButton,
  ...buttonGroup,
  ...toggleButton,
  // ➤➤ MUI X ➤➤
  ...datePicker,
};
