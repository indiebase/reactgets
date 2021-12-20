import React, { forwardRef } from 'react';
import {
  MantineNumberSize,
  DefaultProps,
  MantineTheme,
  useMantineTheme,
  ClassNames,
  MantineMargin,
  getDefaultZIndex,
} from '@mantine/styles';
import { Box } from '../Box';
import { getSortedBreakpoints } from './get-sorted-breakpoints';
import useStyles from './AppShell.styles';

export type AppShellStylesNames = ClassNames<typeof useStyles>;

export interface AppShellProps extends Omit<DefaultProps<AppShellStylesNames>, MantineMargin> {
  /** <Navbar /> component */
  navbar?: React.ReactElement;

  /** <Header /> component */
  header?: React.ReactElement;

  /** zIndex prop passed to Navbar and Header components */
  zIndex?: number;

  /** true to switch from static layout to fixed */
  fixed?: boolean;

  /** AppShell content */
  children: React.ReactNode;

  /** Content padding */
  padding?: MantineNumberSize;

  /** Breakpoint at which Navbar component should no longer be offset with padding-left, applicable only for fixed position */
  navbarOffsetBreakpoint?: MantineNumberSize;
}

function getElementHeight(element: React.ReactElement) {
  const height = element?.props?.height;
  return typeof height === 'number' ? `${height}px` : typeof height === 'string' ? height : '0px';
}

function getNavbarWidth(element: React.ReactElement) {
  const width = element?.props?.width?.base;
  return typeof width === 'number' ? `${width}px` : typeof width === 'string' ? width : '0px';
}

function getNavbarBreakpoints(element: React.ReactElement, theme: MantineTheme) {
  const breakpoints = element?.props?.width;
  return breakpoints != null
    ? getSortedBreakpoints<{ width: number | string; height: number | string }>(
        breakpoints as any,
        theme
      )
    : [];
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      children,
      navbar,
      header,
      fixed = false,
      zIndex = getDefaultZIndex('app'),
      padding = 'md',
      navbarOffsetBreakpoint,
      className,
      styles,
      classNames,
      ...others
    }: AppShellProps,
    ref
  ) => {
    const theme = useMantineTheme();
    const navbarBreakpoints = getNavbarBreakpoints(navbar, theme);
    const navbarWidth = getNavbarWidth(navbar);
    const headerHeight = getElementHeight(header);
    const navbarHeight = getElementHeight(navbar);
    const { classes, cx } = useStyles(
      {
        padding,
        fixed,
        navbarWidth,
        headerHeight,
        navbarBreakpoints,
        navbarOffsetBreakpoint,
      },
      { styles, classNames, name: 'AppShell' }
    );
    const _header = header ? React.cloneElement(header, { fixed, zIndex }) : null;
    const _navbar = navbar
      ? React.cloneElement(navbar, {
          fixed,
          zIndex,
          height: navbarHeight !== '0px' ? navbarHeight : `calc(100vh - ${headerHeight})`,
          position: { top: headerHeight, left: 0 },
        })
      : null;

    return (
      <Box className={cx(classes.root, className)} ref={ref} {...others}>
        {_header}

        <div className={classes.body}>
          {_navbar}
          <main className={classes.main}>{children}</main>
        </div>
      </Box>
    );
  }
);

AppShell.displayName = '@mantine/core/AppShell';