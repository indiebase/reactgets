import React from 'react';
import { noop, useUncontrolled } from '@mantine/utils';
import { Popover } from '../Popover';
import { MenuDivider } from './MenuDivider/MenuDivider';
import { MenuDropdown } from './MenuDropdown/MenuDropdown';
import { MenuItem } from './MenuItem/MenuItem';
import { MenuLabel } from './MenuLabel/MenuLabel';
import { MenuTrigger } from './MenuTrigger/MenuTrigger';
import { MenuContextProvider } from './Menu.context';

export interface MenuProps {
  /** Menu content */
  children?: React.ReactNode;

  /** Controlled menu opened state */
  opened?: boolean;

  /** Uncontrolled menu initial opened state */
  defaultOpened?: boolean;

  /** Called when menu opened state changes */
  onChange?(opened: boolean): void;

  /** Called when Menu is opened */
  onOpen?(): void;

  /** Called when Menu is closed */
  onClose?(): void;
}

export function Menu({
  children,
  onOpen,
  onClose,
  opened,
  defaultOpened,
  onChange = noop,
}: MenuProps) {
  const [_opened, setOpened] = useUncontrolled({
    value: opened,
    defaultValue: defaultOpened,
    finalValue: false,
    onChange,
  });

  const toggleDropdown = () => {
    setOpened(!_opened);
  };

  return (
    <MenuContextProvider value={{ toggleDropdown }}>
      <Popover
        opened={_opened}
        onChange={setOpened}
        defaultOpened={defaultOpened}
        onOpen={onOpen}
        onClose={onClose}
      >
        {children}
      </Popover>
    </MenuContextProvider>
  );
}

Menu.displayName = '@mantine/core/Menu';
Menu.Item = MenuItem;
Menu.Label = MenuLabel;
Menu.Dropdown = MenuDropdown;
Menu.Trigger = MenuTrigger;
Menu.Divider = MenuDivider;