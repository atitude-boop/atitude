'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { concluirDesafio } from '../actions';

const LIMITE = 60;
type Fase = 'pronto' | 'contagem' | 'gravando' | 'revisar';

function tipoDeVideo() {
  if (typeof MediaRecorder === 'undefined') return null;
  for (const t of ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return '';
}

export default function Gravador({ desafio }: { desafio: string }) {
  const [fase, setFase] = useState<Fase>('pronto');
  const [conta, setConta] = useState(3);
  const [resta, setResta] = useState(LIMITE);
  const [erro, setErro] = useState('');
  const [video, setVideo] = useState<{ url: string; ext: string } | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const gravador = useRef<MediaRecorder | null>(null);
  const pedacos = useRef<Blob[]>([]);
  const vivo = useRef<HTMLVideoElement>(null);

  const soltar = useCallback(() => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; }, []);
  useEffect(() => soltar, [soltar]);

  useEffect(() => {
    if (fase !== 'contagem' && fase !== 'gravando') return;
    if (vivo.current && stream.current && vivo.current.srcObject !== stream.current) vivo.current.srcObject = stream.current;
    if (fase === 'contagem') {
      if (conta === 0) { pedacos.current = []; gravador.current?.start(1000); setResta(LIMITE); setFase('gravando'); return; }
      const t = setTimeout(() => setConta((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (resta === 0) { parar(); return; }
    const t = setTimeout(() => setResta((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, conta, resta]);

  async function comecar() {
    setErro('');
    const tipo = tipoDeVideo();
    if (!navigator.mediaDevices?.getUserMedia || tipo === null) {
      setErro('Este navegador não grava vídeo. Faça o desafio em voz alta e marque como feito, ou abra o app no Chrome ou no Safari atualizados.');
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
      setVideo({ url: URL.createObjectURL(new Blob(pedacos.current, { type: mime })), ext: mime.includes('mp4') ? 'mp4' : 'webm' });
      soltar();
      setFase('revisar');
    };
    gravador.current = g;
    if (video) { URL.revokeObjectURL(video.url); setVideo(null); }
    setConta(3);
    setFase('contagem');
  }

  function parar() {
    if (gravador.current && gravador.current.state !== 'inactive') gravador.current.stop();
    else { soltar(); setFase('pronto'); }
  }

  if (fase === 'contagem' || fase === 'gravando') {
    return (
      <div className="tp">
        <video ref={vivo} className="espelho" autoPlay muted playsInline />
        <div className="faixa" style={{ height: 'auto', padding: 'calc(54px + env(safe-area-inset-top, 0px)) 0 44px', WebkitMaskImage: 'none', maskImage: 'none' }}>
          <div className="texto" style={{ position: 'static', fontSize: 22 }}>{desafio}</div>
        </div>
        {fase === 'contagem' && <div className="conta" aria-live="assertive">{conta || ''}</div>}
        {fase === 'gravando' && <div className="rec" role="status"><i />Gravando · 0:{String(resta).padStart(2, '0')}</div>}
        <div className="barra">
          <button className="parar" onClick={parar}>{fase === 'gravando' ? 'Parar e ver o vídeo' : 'Cancelar'}</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card hi">
        <div className="h" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.35 }}>{desafio}</div>
        {fase === 'pronto' && <span className="mut" style={{ fontSize: 13.5 }}>Você tem 60 segundos. Feche com a sua frase-chave, nunca com “é isso”.</span>}
      </div>
      {fase === 'revisar' && video && (
        <div className="card">
          <video src={video.url} controls playsInline style={{ width: '100%', borderRadius: 12, background: '#000', maxHeight: '46vh' }} />
          <span className="mut" style={{ fontSize: 13 }}>Assista prestando atenção nos vícios de linguagem, no olhar e no fechamento. O vídeo fica só neste aparelho.</span>
          <a className="btn sec2" href={video.url} download={`desafio-atitude.${video.ext}`}>Baixar o vídeo</a>
        </div>
      )}
      {erro && <div className="aviso erro" role="alert">{erro}</div>}
      {fase === 'revisar'
        ? <form action={concluirDesafio}><button className="btn">Concluir o desafio de hoje</button></form>
        : <button className="btn" onClick={comecar}>Abrir a câmera e gravar</button>}
      {fase === 'revisar'
        ? <button className="btn fantasma" onClick={comecar}>Gravar de novo</button>
        : <form action={concluirDesafio}><button className="btn fantasma">Fiz sem gravar: marcar como feito</button></form>}
    </>
  );
}
