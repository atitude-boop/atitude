'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const CHAVE = 'atitude.teleprompter';
const EXEMPLO = `Você já saiu de uma reunião com a sensação de que não disse o que queria?

Eu também. E foi por isso que eu comecei a treinar a minha comunicação todos os dias.

Hoje eu quero te mostrar, em um minuto, a ideia que mudou a forma como eu apresento o meu negócio.

Primeiro: comece pelo problema de quem ouve, não pela sua empresa.

Segundo: mostre um resultado concreto, com número.

Terceiro: diga com clareza qual é o próximo passo.

Quem comunica com clareza é lembrado. Comece hoje.`;

type Fase = 'editar' | 'contagem' | 'rodando' | 'pronto';
const pxPorSegundo = (v: number) => 14 + v * 9;
const relogio = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function tipoDeVideo() {
  if (typeof MediaRecorder === 'undefined') return null;
  for (const t of ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return '';
}

export default function Teleprompter() {
  const [texto, setTexto] = useState(EXEMPLO);
  const [vel, setVel] = useState(4);
  const [fonte, setFonte] = useState(30);
  const [fase, setFase] = useState<Fase>('editar');
  const [gravando, setGravando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [conta, setConta] = useState(3);
  const [tempo, setTempo] = useState(0);
  const [erro, setErro] = useState('');
  const [video, setVideo] = useState<{ url: string; blob: Blob; ext: string } | null>(null);

  const stream = useRef<MediaStream | null>(null);
  const gravador = useRef<MediaRecorder | null>(null);
  const pedacos = useRef<Blob[]>([]);
  const vivo = useRef<HTMLVideoElement>(null);
  const faixa = useRef<HTMLDivElement>(null);
  const rolo = useRef<HTMLDivElement>(null);
  const y = useRef(0);
  const velRef = useRef(vel);
  const pausaRef = useRef(false);
  velRef.current = vel;
  pausaRef.current = pausado;

  // O roteiro e os ajustes ficam guardados neste aparelho.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CHAVE) ?? 'null');
      if (s?.texto) setTexto(s.texto);
      if (s?.vel) setVel(s.vel);
      if (s?.fonte) setFonte(s.fonte);
    } catch { /* sem armazenamento: segue com o exemplo */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(CHAVE, JSON.stringify({ texto, vel, fonte })); } catch { /* idem */ }
  }, [texto, vel, fonte]);

  const soltarCamera = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);
  useEffect(() => soltarCamera, [soltarCamera]);

  // Contagem 3, 2, 1 antes de o texto começar a subir.
  useEffect(() => {
    if (fase !== 'contagem') return;
    if (vivo.current && stream.current) vivo.current.srcObject = stream.current;
    if (conta === 0) {
      if (stream.current && gravador.current) { pedacos.current = []; gravador.current.start(1000); }
      y.current = 0;
      setTempo(0);
      setPausado(false);
      setFase('rodando');
      return;
    }
    const t = setTimeout(() => setConta((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, conta]);

  // Rolagem do texto e relógio.
  useEffect(() => {
    if (fase !== 'rodando') return;
    if (vivo.current && stream.current) vivo.current.srcObject = stream.current;
    const inicio = (faixa.current?.clientHeight ?? 300) * 0.55;
    let antes = performance.now();
    let quadro = 0;
    const passo = (agora: number) => {
      const dt = Math.min(0.1, (agora - antes) / 1000);
      antes = agora;
      if (!pausaRef.current) {
        y.current += pxPorSegundo(velRef.current) * dt;
        setTempo((t) => t + dt);
      }
      if (rolo.current) rolo.current.style.transform = `translateY(${inicio - y.current}px)`;
      quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    let trava: WakeLockSentinel | null = null;
    navigator.wakeLock?.request('screen').then((w) => { trava = w; }).catch(() => {});
    return () => { cancelAnimationFrame(quadro); trava?.release().catch(() => {}); };
  }, [fase]);

  async function comecar(comCamera: boolean) {
    setErro('');
    if (!texto.trim()) { setErro('Escreva o roteiro antes de começar.'); return; }
    if (video) { URL.revokeObjectURL(video.url); setVideo(null); }
    if (comCamera) {
      const tipo = tipoDeVideo();
      if (!navigator.mediaDevices?.getUserMedia || tipo === null) {
        setErro('Este navegador não grava vídeo. Você pode ensaiar sem gravar, ou abrir o app no Chrome ou no Safari atualizados.');
        return;
      }
      try {
        stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true });
      } catch {
        setErro('Não foi possível usar a câmera e o microfone. Permita o acesso nas configurações do navegador e tente de novo.');
        return;
      }
      const g = new MediaRecorder(stream.current, tipo ? { mimeType: tipo } : undefined);
      g.ondataavailable = (e) => { if (e.data.size) pedacos.current.push(e.data); };
      g.onstop = () => {
        const mime = g.mimeType || tipo || 'video/webm';
        const blob = new Blob(pedacos.current, { type: mime });
        setVideo({ url: URL.createObjectURL(blob), blob, ext: mime.includes('mp4') ? 'mp4' : 'webm' });
        soltarCamera();
        setFase('pronto');
      };
      gravador.current = g;
    } else {
      gravador.current = null;
    }
    setGravando(comCamera);
    setConta(3);
    setFase('contagem');
  }

  function parar() {
    if (gravador.current && gravador.current.state !== 'inactive') { gravador.current.stop(); return; }
    soltarCamera();
    setFase('editar');
  }

  function alternarPausa() {
    const g = gravador.current;
    if (g?.state === 'recording') g.pause();
    else if (g?.state === 'paused') g.resume();
    setPausado((p) => !p);
  }

  const nomeArquivo = video ? `atitude-teleprompter.${video.ext}` : '';
  async function compartilhar() {
    if (!video) return;
    const arquivo = new File([video.blob], nomeArquivo, { type: video.blob.type });
    try { await navigator.share({ files: [arquivo], title: 'Meu vídeo' }); } catch { /* a pessoa cancelou */ }
  }
  const podeCompartilhar = !!video && typeof navigator !== 'undefined' && !!navigator.canShare
    && navigator.canShare({ files: [new File([video.blob], nomeArquivo, { type: video.blob.type })] });

  if (fase === 'contagem' || fase === 'rodando') {
    return (
      <div className="tp">
        {gravando && <video ref={vivo} className="espelho" autoPlay muted playsInline />}
        <div className="faixa" ref={faixa}>
          <div className="texto" ref={rolo} style={{ fontSize: fonte, transform: 'translateY(60vh)' }}>{texto}</div>
        </div>
        {fase === 'contagem' && <div className="conta" aria-live="assertive">{conta || ''}</div>}
        {fase === 'rodando' && gravando && <div className="rec" role="status"><i style={pausado ? { background: '#A8A39A' } : undefined} />{pausado ? 'Pausado' : 'Gravando'} · {relogio(tempo)}</div>}
        <div className="barra">
          <button onClick={() => setVel((v) => Math.max(1, v - 1))} aria-label="Texto mais devagar">−</button>
          <button onClick={alternarPausa} disabled={fase !== 'rodando'}>{pausado ? 'Continuar' : 'Pausar'}</button>
          <button className="parar" onClick={parar}>{gravando ? 'Parar e ver o vídeo' : 'Parar'}</button>
          <button onClick={() => setVel((v) => Math.min(10, v + 1))} aria-label="Texto mais rápido">+</button>
        </div>
      </div>
    );
  }

  if (fase === 'pronto' && video) {
    return (
      <>
        <div className="card">
          <video src={video.url} controls playsInline style={{ width: '100%', borderRadius: 12, background: '#000', maxHeight: '56vh' }} />
          <span className="mut" style={{ fontSize: 13 }}>O vídeo está só neste aparelho. Salve agora: se você sair desta tela, ele se perde.</span>
          {podeCompartilhar && <button className="btn" onClick={compartilhar}>Salvar ou compartilhar</button>}
          <a className={podeCompartilhar ? 'btn sec2' : 'btn'} href={video.url} download={nomeArquivo}>Baixar o vídeo</a>
        </div>
        <button className="btn sec2" onClick={() => comecar(true)}>Gravar de novo</button>
        <button className="btn fantasma" onClick={() => setFase('editar')}>Voltar ao roteiro</button>
      </>
    );
  }

  return (
    <>
      <div className="card" style={{ gap: 16 }}>
        <div className="campo">
          <label htmlFor="roteiro">Seu roteiro</label>
          <textarea id="roteiro" value={texto} onChange={(e) => setTexto(e.target.value)} rows={10} maxLength={12000} placeholder="Cole ou escreva aqui o que você vai falar." />
          <span className="dica">Fica guardado neste aparelho. Deixe uma linha em branco entre as ideias para respirar.</span>
        </div>
        <div className="campo">
          <label htmlFor="vel">Velocidade do texto · {vel} de 10</label>
          <input id="vel" type="range" min={1} max={10} value={vel} onChange={(e) => setVel(Number(e.target.value))} />
        </div>
        <div className="campo">
          <label htmlFor="fonte">Tamanho da letra</label>
          <input id="fonte" type="range" min={20} max={48} step={2} value={fonte} onChange={(e) => setFonte(Number(e.target.value))} />
          <span style={{ fontSize: fonte, fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{texto.trim().split('\n')[0] || 'Seu texto aparece assim'}</span>
        </div>
      </div>
      {erro && <div className="aviso erro" role="alert">{erro}</div>}
      <button className="btn" onClick={() => comecar(true)}>Gravar com a câmera</button>
      <button className="btn fantasma" onClick={() => comecar(false)}>Ensaiar sem gravar</button>
      <p className="mut" style={{ fontSize: 12.5 }}>O texto sobe perto da câmera para você manter o olhar. Dá para pausar e mudar a velocidade durante a gravação.</p>
    </>
  );
}
