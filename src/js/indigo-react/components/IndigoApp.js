import React from 'react';
import cn from 'classnames';

export default function({ debug = false, ...rest }) {
  return (
    <main
      className={cn('minh-100', { debug })}
      style={{ position: 'relative' }}
      {...rest}
    />
  );
}
