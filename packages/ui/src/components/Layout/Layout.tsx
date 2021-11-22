import classNames from 'classnames'
import { memo } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { LayoutChrome, LayoutChromeProps } from './LayoutChrome'

interface LayoutProps extends LayoutChromeProps {
  className?: string
}

export const Layout = memo(({
  className,
  children,
  navBarHead,
  navBarFoot,
  switchers,
  navigation,
}: LayoutProps) => {
	const prefix = useClassNamePrefix()
  const classList = classNames(
    `${prefix}layout`,
    className,
  )

  return (
    <div className={classList}>
      <LayoutChrome
        navBarHead={navBarHead}
        navBarFoot={navBarFoot}
        navigation={navigation}
        switchers={switchers}
      >
        {children}
      </LayoutChrome>
    </div>
  )
})