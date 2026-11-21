import React from 'react';
import {Search} from 'lucide-react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from './scene';

/** Spotlight-style search capsule; the query words appear on their spoken timestamps. */
export const SearchBar: React.FC<{at: number; words: {text: string; at: number}[]; width?: number; size?: number; exitAt?: number}> = ({at, words, width = 920, size = 48, exitAt}) => {
  const {p, t} = useT();
  const k = p(at - 0.1, 0.6, paperEase.arrive);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  const caret = Math.floor(t * 2) % 2 === 0 && t < (words[words.length - 1]?.at ?? 0) + 0.6;
  return (
    <div style={{width, height: size * 2.3, borderRadius: size * 2, background: paper.card, boxShadow: paper.shadow, display: 'flex', alignItems: 'center', padding: `0 ${size * 0.7}px`, gap: size * 0.45,
      clipPath: `inset(0 ${(1 - k) * 42}% 0 ${(1 - k) * 42}% round ${size * 2}px)`, opacity: Math.min(1, k * 2) * (1 - out), filter: `blur(${out * 10}px)`, translate: `0 ${-out * 24}px`}}>
      <Search size={size * 0.95} strokeWidth={2.6} color={paper.text2} style={{flexShrink: 0, scale: String(0.6 + 0.4 * k)}} />
      <div style={{display: 'flex', flexWrap: 'nowrap', gap: size * 0.24, fontFamily: fonts.text, fontSize: size, fontWeight: 600, letterSpacing: '-0.02em', color: paper.text, overflow: 'hidden', whiteSpace: 'nowrap'}}>
        {words.map((w, i) => {
          const q = p(w.at - 0.06, 0.32);
          return <span key={i} style={{opacity: q, translate: `0 ${(1 - q) * 18}px`, filter: `blur(${(1 - q) * 6}px)`}}>{w.text}</span>;
        })}
        <span style={{width: 4, height: size * 1.1, background: paper.blue, borderRadius: 2, opacity: caret ? 1 : 0, alignSelf: 'center'}} />
      </div>
    </div>
  );
};
