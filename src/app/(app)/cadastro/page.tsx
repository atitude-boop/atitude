import type { Metadata } from 'next';
import Link from 'next/link';
import { exigeAluno } from '@/lib/auth';
import { IcoCadeado, IcoVoltar } from '@/components/Icones';
import { COLABORADORES, FATURAMENTOS } from '@/lib/opcoes';
import { salvarCadastro } from './actions';

export const metadata: Metadata = { title: 'Cadastro' };

type CampoProps = { nome: string; rotulo: string; valor: string; dica?: string; longo?: boolean; tipo?: string; max?: number; ex?: string };
function Campo({ nome, rotulo, valor, dica, longo, tipo = 'text', max = 300, ex }: CampoProps) {
  return (
    <div className="campo">
      <label htmlFor={nome}>{rotulo}</label>
      {longo
        ? <textarea id={nome} name={nome} defaultValue={valor} maxLength={max} placeholder={ex} />
        : <input id={nome} name={nome} type={tipo} defaultValue={valor} maxLength={max} placeholder={ex} />}
      {dica && <span className="dica">{dica}</span>}
    </div>
  );
}

export default async function Cadastro() {
  const a = await exigeAluno();
  return (
    <>
      <div className="topo">
        <Link href="/perfil" className="voltar" aria-label="Voltar para o perfil"><IcoVoltar /></Link>
        <div className="txt">
          <span className="sobre">Seus dados</span>
          <h1 className="titulo m">Cadastro</h1>
        </div>
      </div>

      <form action={salvarCadastro} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card" style={{ gap: 16 }}>
          <div>
            <h2 className="sec">Sobre você e a sua empresa</h2>
            <span className="mut" style={{ fontSize: 13 }}>Esta parte poderá aparecer para outros alunos quando a área de Conexões for aberta.</span>
          </div>
          <Campo nome="nome" rotulo="Nome" valor={a.nome} max={80} />
          <Campo nome="empresa" rotulo="Empresa" valor={a.empresa} max={80} />
          <Campo nome="cargo" rotulo="Cargo" valor={a.cargo} max={80} ex="Ex.: Sócia-diretora" />
          <Campo nome="o_que_faz" rotulo="O que a empresa faz" valor={a.o_que_faz} longo />
          <Campo nome="segmento" rotulo="Segmento" valor={a.segmento} max={80} ex="Ex.: Saúde, varejo, tecnologia" />
          <fieldset className="campo">
            <legend>Número de colaboradores</legend>
            <div className="opcoes">
              {COLABORADORES.map((c) => (
                <label key={c}><input type="radio" name="colaboradores" value={c} defaultChecked={a.colaboradores === c} /><span>{c}</span></label>
              ))}
            </div>
          </fieldset>
          <Campo nome="cidade" rotulo="Cidade" valor={a.cidade} max={80} />
          <Campo nome="instagram" rotulo="Instagram ou site" valor={a.instagram} max={120} />
          <Campo nome="posso_ajudar" rotulo="Posso ajudar com" valor={a.posso_ajudar} longo />
          <Campo nome="procuro" rotulo="Estou procurando" valor={a.procuro} longo />
          <label className="check">
            <input type="checkbox" name="aparecer_conexoes" defaultChecked={a.aparecer_conexoes} />
            <span>Quero aparecer para outros alunos em Conexões</span>
          </label>
        </div>

        <div className="card" style={{ gap: 16 }}>
          <div>
            <h2 className="sec" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="ouro" style={{ display: 'flex' }}><IcoCadeado size={18} /></span> Só a escola vê</h2>
            <span className="mut" style={{ fontSize: 13 }}>Estes dados não aparecem para outros alunos. A equipe usa para te acompanhar.</span>
          </div>
          <Campo nome="whatsapp" rotulo="WhatsApp" valor={a.whatsapp} tipo="tel" max={30} ex="(62) 99999-0000" />
          <Campo nome="aniversario" rotulo="Aniversário" valor={a.aniversario} max={10} ex="dia/mês" />
          <div className="campo">
            <label htmlFor="faturamento">Faixa de faturamento</label>
            <select id="faturamento" name="faturamento" defaultValue={a.faturamento}>
              <option value="">Selecione</option>
              {FATURAMENTOS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <Campo nome="desafio" rotulo="Maior desafio do negócio hoje" valor={a.desafio} longo max={600} />
          <Campo nome="objetivo" rotulo="Seu objetivo com a Atitude" valor={a.objetivo} longo max={600} />
          <Campo nome="como_conheceu" rotulo="Como conheceu a escola" valor={a.como_conheceu} />
        </div>

        <button className="btn">Salvar cadastro</button>
      </form>
    </>
  );
}
