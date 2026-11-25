import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import * as THREE from 'three';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, Card, PhotoCutout, PickerNumber, useT} from '../../components/ios';
import {BigWord, Callout, Headline, Lead} from '../../components/analytics/Headline';
import {Abs, Kicker} from '../messi91/kit';
import {Stage3D, ShadowFloor, Pitch3D, Pin, Trail, along, Token} from '../../components/three/kit3d';
import {Football3D} from '../../components/three/Football3D';
import {W} from './words';

export const red = '#FF3B30';
const img = (n: string) => `images/fouls/graded/${n}.png`;

/* S1 · 0.00 "Defenders had one plan for Lionel Messi. Follow him. And when that fails… kick him."
   3D from frame 0: Messi dribbles across a tilted pitch, three defenders hunt him, trails draw on
   "follow", he pulls away on "fails", the nearest one slides in on "kick". */
const S1PATH: [number, number][] = [[-5.5, 7], [-2.5, 3.5], [0.5, 1], [2.5, -2.5], [5, -6.5]];
export const S1: React.FC = () => {
  const {p, t} = useT();
  const fail = p(W.fails, 0.8, paperEase.arrive);
  const kick = p(W.kick - 0.12, 0.35, paperEase.arrive);
  const uM = Math.min(0.97, 0.16 + 0.085 * t + 0.16 * fail);
  const [mx, mz, mh] = along(S1PATH, uM);
  const offs = [[-1.1, 0.10], [1.2, 0.16], [0.1, 0.24]];
  const defs = offs.map(([dx, lag], i) => {
    const u = Math.max(0, uM - lag - fail * (0.06 + i * 0.03));
    const [x, z, h] = along(S1PATH, u);
    let px = x + dx * Math.cos(h), pz = z - dx * Math.sin(h), lean = 0.12;
    if (i === 0) { // the tackler
      px += (mx - 0.5 - px) * kick; pz += (mz + 0.9 - pz) * kick; lean = 0.12 + kick * 0.95;
    }
    return {x: px, z: pz, h: Math.atan2(mx - px, mz - pz), lean, i};
  });
  const trail = p(W.follow, 1.6, paperEase.glide);
  const words: [string, number, string?][] = [['plan.', W.plan], ['follow him.', W.follow], ['kick him.', W.kick, red]];
  const cur = words.filter(([, a]) => t >= a - 0.15).length - 1;
  return (
    <AbsoluteFill>
      <Stage3D cam={[mx - 1.8, 10.5 - kick * 1.5, mz + 11 - kick * 2.5]} look={[mx, 0.5, mz - 1]} fov={30} shift={330}>
        <ShadowFloor />
        <Pitch3D w={18} d={26} />
        <Trail pts={S1PATH} progress={Math.min(trail, uM - 0.08)} />
        <Pin position={[mx, 0, mz]} heading={mh} lean={0.18 + fail * 0.12 - kick * 0.25} color="#1D1D1F" ring="#FFFFFF" squash={kick * 0.4} />
        <Football3D position={[mx + Math.sin(mh) * 0.75, 0.22, mz + Math.cos(mh) * 0.75]} rotation={[t * 9, mh, 0]} scale={0.22} />
        {defs.map((d) => (
          <Pin key={d.i} position={[d.x, 0, d.z]} heading={d.h} lean={d.lean} color={d.i === 0 && kick > 0 ? red : '#A7A7AE'} glow={d.i === 0 ? kick * 0.35 : 0} />
        ))}
      </Stage3D>
      <Abs top={180}><Lead words={[{text: 'Defenders', at: 0}, {text: 'had', at: W.had}, {text: 'one', at: W.one}]} exitAt={W.follow - 0.2} /></Abs>
      {words.map(([w, a, c], i) => (
        <Abs key={w} top={260}>{i === cur && <BigWord text={w} at={a} size={190} color={c} />}</Abs>
      ))}
      <Abs top={500}>
        <div style={{opacity: p(W.fails - 0.05, 0.4) * (1 - p(W.kick - 0.1, 0.3, paperEase.exit))}}>
          <Kicker at={W.fails - 0.05} text="when that fails…" size={30} />
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* S2 · 5.90 "2014–15. One season." */
export const S2: React.FC = () => {
  const {p, t} = useT();
  const bar = p(W.season, 1.1, paperEase.glide);
  const months = ['AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY'];
  return (
    <AbsoluteFill>
      <Abs top={560}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <PickerNumber from={2004} to={2014} start={W.twenty - 0.15} lockAt={W.fourteen + 0.15} size={250} band={false} />
          <div style={{fontFamily: fonts.display, fontSize: 250, fontWeight: 700, letterSpacing: '-0.05em', color: paper.text, opacity: p(W.fifteen - 0.1, 0.4), translate: `${(1 - p(W.fifteen - 0.1, 0.5)) * 80}px 0`, filter: `blur(${(1 - p(W.fifteen - 0.1, 0.5)) * 14}px)`, marginLeft: -20}}>–15</div>
        </div>
      </Abs>
      <Abs top={300}>
        <Lead words={[{text: 'One', at: W.oneS}, {text: 'season.', at: W.season}]} size={72} />
      </Abs>
      <Abs top={1040}>
        <div style={{width: 860, opacity: p(W.oneS, 0.4)}}>
          <div style={{height: 22, borderRadius: 22, background: '#E3E3E8', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${bar * 100}%`, borderRadius: 22, background: paper.text}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22}}>
            {months.map((m, i) => (
              <div key={m} style={{fontFamily: fonts.text, fontSize: 22, fontWeight: 600, letterSpacing: '0.08em', color: bar * 9.5 >= i ? paper.text : paper.text3}}>{m}</div>
            ))}
          </div>
        </div>
      </Abs>
      <Stage3D cam={[0, 1.2, 9]} look={[0, 0.6, 0]} fov={30} shift={560}>
        <ShadowFloor opacity={0.2} />
        {(() => {
          const x = interpolate(t, [5.95, 9.3], [-1.9, 1.9]);
          return <Football3D position={[x, 0.42, 0]} rotation={[0, 0, -x / 0.42]} scale={0.42} />;
        })()}
      </Stage3D>
    </AbsoluteFill>
  );
};

/* S3 · 9.20 "Every time he turned, someone was already there."
   3D: Messi spins on the spot and a defender rises from the pitch wherever he faces; then the
   real photo with the camera panning defender → defender as each gets ringed. */
export const S3: React.FC = () => {
  const {p, t} = useT();
  const swap = W.someone - 0.05;
  const k3 = 1 - p(swap, 0.35, paperEase.exit);
  // Messi heading turns on "time" and "turned"
  const h = -0.6 + p(W.time - 0.1, 0.4) * 2.3 + p(W.turned - 0.1, 0.4) * 2.6;
  const rise = (at: number) => p(at, 0.45, paperEase.lock);
  const ds = [{a: -0.6, at: W.every + 0.05}, {a: 1.7, at: W.time + 0.1}, {a: 4.3, at: W.turned + 0.1}];
  const orbit = t * 0.35;
  // photo pan
  const sc = 1060 / 1108, ox = 10, oy = 700;
  const rings = [{x: 282, y: 216, at: W.someone + 0.1, n: '1'}, {x: 543, y: 82, at: W.was, n: '2'}, {x: 878, y: 288, at: W.there, n: '3'}];
  const pan = interpolate(t, [swap, W.was, W.there, 12.2], [-140, 0, 0, 120], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: paperEase.glide});
  const pk = p(swap, 0.6, paperEase.arrive);
  return (
    <AbsoluteFill>
      {k3 > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: k3, filter: `blur(${(1 - k3) * 20}px)`}}>
          <Stage3D cam={[Math.sin(orbit) * 12, 9.5, Math.cos(orbit) * 12]} look={[0, 0.2, 0]} fov={32} shift={330}>
            <ShadowFloor />
            <Pitch3D w={18} d={26} />
            <Pin position={[0, 0, 0]} heading={h} lean={0.1} color="#1D1D1F" ring="#FFFFFF" />
            {ds.map((d, i) => {
              const r = rise(d.at);
              return <Pin key={i} position={[Math.sin(d.a) * 2.1, -2.2 * (1 - r), Math.cos(d.a) * 2.1]} heading={d.a + Math.PI} color={red} glow={0.15} scale={0.6 + 0.4 * r} />;
            })}
          </Stage3D>
        </div>
      )}
      <Headline lead={[{text: 'Every', at: W.every}, {text: 'time', at: W.time}, {text: 'he', at: W.he}, {text: 'turned,', at: W.turned}]} word={{text: 'already there.', at: W.already}} size={160} />
      {pk > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: pk, translate: `${-pan}px ${(1 - pk) * 160}px`, scale: String(1.18 + 0.04 * p(swap, 2, paperEase.glide)), filter: `blur(${(1 - pk) * 16}px)`}}>
          <div style={{position: 'absolute', left: ox, top: oy, width: 1060}}>
            <Img src={staticFile(img('madrid'))} style={{width: 1060}} />
          </div>
          {rings.map((r) => {
            const k = p(r.at - 0.05, 0.5, paperEase.lock);
            return (
              <div key={r.n} style={{position: 'absolute', left: ox + r.x * sc - 80, top: oy + r.y * sc - 80, width: 160, height: 160, borderRadius: 160, border: `5px solid ${red}`, scale: String(0.4 + 0.6 * k), opacity: Math.min(1, k * 2)}}>
                <div style={{position: 'absolute', right: -14, top: -14, width: 54, height: 54, borderRadius: 54, background: red, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: fonts.display, fontSize: 30, fontWeight: 800}}>{r.n}</div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* S4 · 12.10 "Shirts pulled, ankles clipped, shoulders in the back." — a 3D mannequin turns while
   the foul points light up red: chest, ankle, then it swings round to show the back. */
const Limb: React.FC<{from: [number, number, number]; to: [number, number, number]; r: number; color: string}> = ({from, to, r, color}) => {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const len = a.distanceTo(b);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return (
    <mesh position={mid} quaternion={q} castShadow>
      <capsuleGeometry args={[r, len, 8, 20]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
};
export const S4: React.FC = () => {
  const {p, t} = useT();
  const words: [string, number][] = [['pulled.', W.pulled], ['clipped.', W.clipped], ['in the back.', W.back]];
  const cur = words.filter(([, a]) => t >= a - 0.15).length - 1;
  const ry = -0.5 + Math.sin(t * 0.9) * 0.25 + p(W.ankles - 0.2, 0.7) * 0.6 + p(W.shoulders - 0.25, 0.8, paperEase.glide) * 2.6;
  const g = '#A8A8AE';
  const hot = (at: number) => p(at - 0.05, 0.4, paperEase.lock);
  const pulse = (at: number) => (t > at ? 1 + Math.max(0, Math.sin((t - at) * 6)) * 0.18 : 1);
  const spots: {pos: [number, number, number]; at: number}[] = [
    {pos: [0.05, 1.45, 0.3], at: W.shirts},
    {pos: [0.2, 0.12, 0.12], at: W.ankles},
    {pos: [-0.3, 1.82, -0.28], at: W.shoulders},
  ];
  const ent = p(12.1, 0.8, paperEase.arrive);
  return (
    <AbsoluteFill>
      <Stage3D cam={[Math.sin(t * 0.2) * 0.8, 1.9, 9.2 - (t - 12) * 0.25]} look={[0, 1.2, 0]} fov={32} shift={330}>
        <ShadowFloor opacity={0.18} />
        <group rotation={[0, ry, 0]} position={[0, -2 * (1 - ent), 0]}>
          <mesh position={[0, 2.25, 0]} castShadow><sphereGeometry args={[0.22, 32, 32]} /><meshStandardMaterial color={g} roughness={0.5} /></mesh>
          <Limb from={[0, 1.2, 0]} to={[0, 1.8, 0]} r={0.3} color={g} />
          <Limb from={[-0.36, 1.85, 0]} to={[-0.5, 1.2, 0.05]} r={0.1} color={g} />
          <Limb from={[-0.5, 1.2, 0.05]} to={[-0.52, 0.75, 0.15]} r={0.09} color={g} />
          <Limb from={[0.36, 1.85, 0]} to={[0.5, 1.2, 0.05]} r={0.1} color={g} />
          <Limb from={[0.5, 1.2, 0.05]} to={[0.52, 0.75, 0.15]} r={0.09} color={g} />
          <Limb from={[-0.15, 1.0, 0]} to={[-0.18, 0.5, 0.02]} r={0.12} color={g} />
          <Limb from={[-0.18, 0.5, 0.02]} to={[-0.2, 0.1, 0]} r={0.1} color={g} />
          <Limb from={[0.15, 1.0, 0]} to={[0.18, 0.5, 0.02]} r={0.12} color={g} />
          <Limb from={[0.18, 0.5, 0.02]} to={[0.2, 0.1, 0]} r={0.1} color={g} />
          {spots.map((s, i) => {
            const k = hot(s.at);
            return k > 0 ? (
              <mesh key={i} position={s.pos} scale={k * pulse(s.at)}>
                <sphereGeometry args={[0.13, 32, 32]} />
                <meshStandardMaterial color={red} emissive={red} emissiveIntensity={0.8} />
              </mesh>
            ) : null;
          })}
        </group>
      </Stage3D>
      <Abs top={190}><Kicker at={W.shirts - 0.1} text="Foul map" size={30} /></Abs>
      {words.map(([w, a], i) => (
        <Abs key={w} top={250}>
          {i === cur && <BigWord text={w} at={a} size={190} />}
        </Abs>
      ))}
      <Abs top={500}>
        <div style={{display: 'flex', gap: 18}}>
          {[['SHIRT', W.shirts], ['ANKLE', W.ankles], ['SHOULDER', W.shoulders]].map(([l, a]) => (
            <Capsule key={l as string} at={a as number} label={l as string} background={red} color="#fff" size={26} />
          ))}
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* S5 · 15.60 "Ninety fouls in La Liga. More than two every game." */
export const S5: React.FC = () => {
  const {p, t} = useT();
  const swap = W.more - 0.1;
  const outA = p(swap, 0.4, paperEase.exit);
  const icons = [{at: W.two, fill: 1}, {at: W.two + 0.18, fill: 1}, {at: W.everyG, fill: 0.4}];
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - outA, filter: `blur(${outA * 12}px)`, translate: `0 ${-outA * 60}px`}}>
        <Abs top={230} z={2}>
          <PickerNumber from={0} to={90} start={W.ninety - 0.3} lockAt={W.ninety + 0.45} size={300} band={false} ticks={false} />
        </Abs>
        <Abs top={790} z={2}><Lead words={[{text: 'fouls', at: W.fouls}, {text: 'in', at: W.inLa}, {text: 'La', at: W.laLiga}, {text: 'Liga.', at: W.laLiga + 0.1}]} size={64} /></Abs>
        {/* 90 foul tokens rain down into 9 stacks of 10 */}
        <Stage3D cam={[Math.sin(t * 0.3) * 3, 6, 21]} look={[0, 1.0, 0]} fov={34} style={{zIndex: 0}} shift={560}>
          <ShadowFloor />
          {Array.from({length: 90}, (_, i) => {
            const c = i % 9, l = Math.floor(i / 9);
            const at = W.ninety - 0.1 + i * 0.013;
            const k = interpolate(t, [at, at + 0.45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) * (1 - x)});
            if (k <= 0) return null;
            const y = 0.08 + l * 0.17;
            return <Token key={i} position={[(c - 4) * 0.9, y + (1 - k) * 2.5, (l % 2) * 0.02]} rotation={[(1 - k) * 2.4, i, (1 - k) * 1.3]} color={l === 9 ? red : '#2C2C2E'} r={0.4} h={0.15} />;
          })}
        </Stage3D>
      </div>
      {t > swap - 0.05 && (
        <>
          <Abs top={300}><Lead words={[{text: 'More', at: W.more}, {text: 'than', at: W.than}]} size={64} /></Abs>
          <Abs top={380}><BigWord text="2 every game." at={W.two} size={170} /></Abs>
          <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 50}}>
            {icons.map((m, i) => {
              const k = p(m.at - 0.05, 0.45, paperEase.lock);
              return (
                <div key={i} style={{position: 'relative', width: 210, height: 210, borderRadius: 210, background: '#E3E3E8', overflow: 'hidden', opacity: Math.min(1, k * 2), scale: String(0.5 + 0.5 * k)}}>
                  <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${m.fill * 100}%`, background: red}} />
                  <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: fonts.display, fontSize: 72, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em'}}>{m.fill === 1 ? '1' : '.4'}</div>
                </div>
              );
            })}
          </div>
          <Abs top={1080}><Lead words={[{text: 'fouls', at: W.everyG}, {text: 'per', at: W.everyG + 0.1}, {text: 'game', at: W.game}]} size={56} caps /></Abs>
          <Abs top={1200}><Capsule at={W.game + 0.15} label="2.4 per game · La Liga 2014–15" variant="island" size={32} /></Abs>
        </>
      )}
    </AbsoluteFill>
  );
};

/* S6 · 19.60 "So did it work?" — iOS switch that tries to turn on */
export const S6: React.FC = () => {
  const {p, t} = useT();
  const try1 = p(W.work - 0.1, 0.35, paperEase.arrive);
  const back = p(W.work + 0.5, 0.45, paperEase.glide);
  const on = try1 * 0.55 * (1 - back);
  return (
    <AbsoluteFill>
      <Headline lead={[{text: 'So', at: W.so}, {text: 'did', at: W.did}, {text: 'it', at: W.it}]} word={{text: 'work?', at: W.work}} top={420} size={240} />
      <Abs top={980}>
        <Card at={W.so} radius={48} padding={0} style={{width: 820, transform: `perspective(1200px) rotateX(${Math.sin(t * 1.6) * 8}deg) rotateY(${Math.cos(t * 1.2) * 10}deg)`}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 48px'}}>
            <div style={{fontFamily: fonts.display, fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text}}>Messi stopped</div>
            <div style={{width: 150, height: 90, borderRadius: 90, background: `rgb(${233 + (52 - 233) * on}, ${233 + (199 - 233) * on}, ${235 + (89 - 235) * on})`, boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.06)', position: 'relative'}}>
              <div style={{position: 'absolute', top: 5, left: 5 + on * 60, width: 80, height: 80, borderRadius: 80, background: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,0.18)', scale: String(1 + 0.08 * Math.sin(Math.min(1, Math.max(0, t - W.work)) * Math.PI))}} />
            </div>
          </div>
        </Card>
      </Abs>
    </AbsoluteFill>
  );
};

/* S7 · 21.20 "Here's the strange part. He ran straight back at them." */
export const S7: React.FC = () => {
  const {p} = useT();
  const swap = W.he2 - 0.15;
  const outA = p(swap, 0.35, paperEase.exit);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - outA, filter: `blur(${outA * 12}px)`}}>
        <Headline lead={[{text: "Here's", at: W.heres}, {text: 'the', at: W.the}, {text: 'strange', at: W.strange}]} word={{text: 'part.', at: W.part}} top={680} size={260} />
      </div>
      {outA > 0 && (
        <>
          <Headline lead={[{text: 'He', at: W.he2}, {text: 'ran', at: W.ran}, {text: 'straight', at: W.straight}]} word={{text: 'back at them.', at: W.back2}} size={160} />
          <PhotoCutout src={img('eibar')} at={W.he2} until={24.6} height={1250} bottom={60} x={-40} from="left" drift={60} />
        </>
      )}
    </AbsoluteFill>
  );
};

/* S8 · 24.40 "4.6 completed dribbles a game. More than anyone in La Liga." */
export const S8: React.FC = () => {
  const {p, t} = useT();
  const v = Math.min(4.6, Math.max(0, ((t - W.four) / (W.six + 0.2 - W.four)) * 4.6));
  const vk = p(W.four - 0.1, 0.4);
  const rows = [1, 0.78, 0.7, 0.64, 0.57];
  return (
    <AbsoluteFill>
      <Abs top={250}>
        <div style={{fontFamily: fonts.display, fontSize: 330, fontWeight: 800, letterSpacing: '-0.06em', color: paper.text, fontVariantNumeric: 'tabular-nums', lineHeight: 0.9, opacity: vk, filter: `blur(${(1 - vk) * 18}px)`, scale: String(1.15 - 0.15 * vk)}}>{v.toFixed(1)}</div>
      </Abs>
      <Abs top={590}><Lead words={[{text: 'completed', at: W.completed}, {text: 'dribbles', at: W.dribbles}, {text: 'a', at: W.a}, {text: 'game.', at: W.game2}]} size={60} /></Abs>
      <div style={{position: 'absolute', top: 820, left: 110, width: 860, display: 'flex', flexDirection: 'column', gap: 30}}>
        {rows.map((w, i) => {
          const k = p(W.more2 + i * 0.1 - 0.1, 0.8, paperEase.arrive);
          const me = i === 0;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{width: 40, fontFamily: fonts.display, fontSize: 34, fontWeight: 800, color: me ? paper.text : paper.text3}}>{i + 1}</div>
              <div style={{flex: 1, height: 64}}>
                <div style={{height: '100%', width: `${w * k * 100}%`, borderRadius: 64, background: me ? paper.text : '#D8D8DD', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 24}}>
                  {me && <span style={{fontFamily: fonts.display, fontSize: 32, fontWeight: 700, color: '#fff', opacity: p(W.anyone, 0.4)}}>Messi · 4.6</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Abs top={1300}><Capsule at={W.laLiga2} label="#1 in La Liga · 2014–15" variant="island" size={34} /></Abs>
    </AbsoluteFill>
  );
};
