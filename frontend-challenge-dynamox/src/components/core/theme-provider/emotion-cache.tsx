import * as React from 'react';
import createCache from '@emotion/cache';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

interface Registry {
  cache: EmotionCache;
  flush: () => { name: string; isGlobal: boolean }[];
}

export interface AppEmotionCacheProviderProps {
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
  CacheProvider?: (props: { value: EmotionCache; children: React.ReactNode }) => React.JSX.Element | null;
  children: React.ReactNode;
}

export default function AppEmotionCacheProvider(props: AppEmotionCacheProviderProps): React.JSX.Element {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const [registry] = React.useState<Registry>(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: { name: string; isGlobal: boolean }[] = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }

      return prevInsert(...args);
    };
    const flush = (): { name: string; isGlobal: boolean }[] => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  React.useEffect(() => {
    const inserted = registry.flush();

    if (inserted.length === 0) {
      return;
    }

    let styles = '';
    let dataEmotionAttribute = registry.cache.key;

    const globals: { name: string; style: string }[] = [];

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style !== 'boolean') {
        if (isGlobal) {
          if (style) {
            globals.push({ name, style });
          }
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    globals.forEach(({ name, style }) => {
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-emotion', `${registry.cache.key}-global ${name}`);
      styleTag.innerHTML = style;
      document.head.appendChild(styleTag);
    });

    if (styles) {
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-emotion', dataEmotionAttribute);
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }
  }, [registry]);

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
